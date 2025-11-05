#!/bin/bash
# EC2 Backend Deployment Script
# Usage: bash deploy-ec2.sh
# Run this on your EC2 instance to quickly setup and start the backend

set -e  # Exit on any error

echo "🚀 IronLog Backend EC2 Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Check if running on EC2
print_status "Checking environment..."
if [ ! -d "/home/ubuntu" ] && [ ! -d "/root" ]; then
    print_warning "This script is designed for Ubuntu EC2. Some paths may differ."
fi

# Step 2: Update system
print_status "Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Step 3: Install Node.js
print_status "Installing Node.js v18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "  Node.js already installed: $(node -v)"
fi

# Step 4: Install PM2 globally
print_status "Installing PM2..."
if ! npm list -g pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    echo "  PM2 already installed"
fi

# Step 5: Install Git
print_status "Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install -y git
else
    echo "  Git already installed"
fi

# Step 6: Clone repository (or pull if exists)
REPO_DIR="$HOME/ironlog"
if [ ! -d "$REPO_DIR" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/yourusername/ironlog.git "$REPO_DIR"
else
    print_status "Repository already exists, pulling latest..."
    cd "$REPO_DIR"
    git pull origin main
fi

# Step 7: Navigate to backend
cd "$REPO_DIR/amplify/backend"
print_status "Changed to backend directory: $(pwd)"

# Step 8: Install dependencies
print_status "Installing backend dependencies..."
npm install

# Step 9: Check for .env file
if [ ! -f ".env" ]; then
    print_warning ".env file not found!"
    print_status "Creating .env file from .env.example..."
    cp .env.example .env
    print_error "IMPORTANT: Edit .env file and add your actual values:"
    print_error "  nano .env"
    print_error "  - MONGO_URI: Add MongoDB connection string"
    print_error "  - CORS_ORIGIN: Add your domain"
    read -p "Press Enter after editing .env file..."
fi

# Step 10: Test backend locally
print_status "Testing backend connection..."
timeout 5 node server.js &
sleep 2
if curl -s http://localhost:5000/health > /dev/null; then
    print_status "Backend health check passed ✓"
else
    print_warning "Backend health check failed - check MongoDB connection"
fi
pkill -f "node server.js" || true

# Step 11: Start with PM2
print_status "Starting backend with PM2..."
pm2 delete ironlog-backend 2>/dev/null || true
pm2 start server.js --name "ironlog-backend" --env production

# Step 12: Setup PM2 auto-startup
print_status "Configuring PM2 for system startup..."
pm2 startup
pm2 save

# Step 13: Optional - Install Nginx
read -p "Install Nginx as reverse proxy? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Installing Nginx..."
    sudo apt install -y nginx
    
    # Create Nginx config
    print_status "Creating Nginx configuration..."
    sudo tee /etc/nginx/sites-available/ironlog > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    sudo ln -sf /etc/nginx/sites-available/ironlog /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    print_status "Nginx configured"
fi

# Step 14: Optional - Setup SSL with Let's Encrypt
read -p "Setup SSL with Let's Encrypt? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    
    read -p "Enter your domain name: " DOMAIN
    print_status "Getting SSL certificate for $DOMAIN..."
    sudo certbot --nginx -d "$DOMAIN"
    
    print_status "SSL certificate installed"
fi

# Final status
echo ""
echo "=========================================="
print_status "Backend deployment complete!"
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "📋 Next steps:"
echo "  1. Verify .env file has correct values: cat .env"
echo "  2. Check logs: pm2 logs ironlog-backend"
echo "  3. Test health: curl http://localhost:5000/health"
echo "  4. Update frontend VITE_API_URL to: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000"
echo ""
echo "📝 Useful commands:"
echo "  pm2 status              - Check server status"
echo "  pm2 logs                - View server logs"
echo "  pm2 restart all         - Restart servers"
echo "  pm2 stop all            - Stop servers"
echo "  pm2 delete all          - Delete from PM2"
echo ""
print_status "Deployment script completed!"
