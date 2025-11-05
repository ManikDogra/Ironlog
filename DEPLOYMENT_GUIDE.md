# IronLog Deployment Guide
**Version:** 1.0  
**Date:** November 6, 2025  
**Architecture:** AWS Amplify (Frontend + Cognito Auth) + EC2 (Express Backend)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Users (Internet)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  AWS Amplify     │      │   AWS Cognito    │
│  (Frontend)      │      │  (Auth Service)  │
│  - React/Vite    │      │  - JWT Tokens    │
│  - Tailwind CSS  │      │  - User Pool     │
│  - Framer Motion │      │  - Email OTP     │
└────────┬─────────┘      └──────────────────┘
         │                       ▲
         │                       │ (authenticate)
         └───────────────────────┤
                                 │
                    ┌────────────┴─────────┐
                    │                      │
                    ▼                      ▼
            ┌──────────────────┐  ┌──────────────────┐
            │   Express API    │  │   MongoDB Atlas  │
            │  (EC2 Instance)  │  │   (Database)     │
            │  Port: 5000      │  │  ap-south-1      │
            │  - User Routes   │  │                  │
            │  - Workout CRUD  │  │  Collections:    │
            │  - Weight Track  │  │  - Users         │
            │  - Profile Mgmt  │  │  - Workouts      │
            └──────────────────┘  │  - Weights       │
                                  │  - Profiles      │
                                  └──────────────────┘
```

---

## 📋 Pre-Deployment Checklist

### ✅ Frontend (AWS Amplify)
- [ ] Install Amplify CLI: `npm install -g @aws-amplify/cli`
- [ ] Configure AWS credentials: `amplify configure`
- [ ] Build production bundle: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Verify API endpoint URLs point to EC2 domain
- [ ] Clear browser cache before testing

### ✅ Backend (EC2 Instance)
- [ ] AWS EC2 instance created (Ubuntu 20.04+)
- [ ] Node.js v18+ installed
- [ ] MongoDB connection string verified
- [ ] Environment variables configured (.env file)
- [ ] Port 5000 open in security group
- [ ] PM2 or similar process manager installed
- [ ] SSL certificate (AWS ACM or Let's Encrypt)

### ✅ Database (MongoDB Atlas)
- [ ] MongoDB cluster created in ap-south-1
- [ ] IP whitelist includes EC2 instance
- [ ] Database user created with strong password
- [ ] Collections created and indexed
- [ ] Backup enabled

### ✅ Security
- [ ] HTTPS/TLS enabled
- [ ] CORS properly configured
- [ ] JWT verification working
- [ ] Rate limiting configured
- [ ] Environment variables secured

---

## 🚀 Deployment Steps

### **Phase 1: Prepare Environment Variables**

#### **Frontend (.env.local or .env.production)**
Located in root directory: `Ironlog/`

```bash
# AWS Amplify / Cognito (auto-generated from amplifyconfiguration.json)
VITE_AWS_PROJECT_REGION=ap-south-1
VITE_AWS_USER_POOLS_ID=ap-south-1_LKeBeMENH
VITE_AWS_USER_POOLS_WEB_CLIENT_ID=7j50580qnn5upjatjr96ufgn9u
VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:6cd7267f-5a94-41a9-ac85-da11f41ad6ba

# Backend API URL (change to EC2 public IP or domain)
VITE_API_URL=http://YOUR_EC2_IP:5000
# Production: https://api.yourdomain.com
```

#### **Backend (.env file in amplify/backend/)**
Located in: `Ironlog/amplify/backend/.env`

```bash
# Environment
NODE_ENV=production

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ironlog?retryWrites=true&w=majority

# Port
PORT=5000

# CORS Origins (add your Amplify domain + EC2 domain)
CORS_ORIGIN=https://yourdomain.amplifyapp.com,https://api.yourdomain.com

# Cognito JWKS URL (for JWT verification)
COGNITO_JWKS_URI=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_LKeBeMENH/.well-known/jwks.json

# Cognito audience/issuer
COGNITO_AUDIENCE=7j50580qnn5upjatjr96ufgn9u
COGNITO_ISSUER=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_LKeBeMENH
```

---

### **Phase 2: Deploy Frontend to AWS Amplify**

#### **Option A: Using Amplify Console (Recommended)**

1. **Push to GitHub** (if not already)
   ```bash
   cd Ironlog
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ironlog.git
   git push -u origin main
   ```

2. **Connect to Amplify Console**
   - Go to AWS Console → Amplify
   - Click "Create app" → "Host web app"
   - Select GitHub → Select your repo
   - Select main branch
   - Build settings: Auto-detected (Vite)
   - Deploy

3. **Configure Environment Variables in Amplify Console**
   - App Settings → Environment Variables
   - Add all `VITE_*` variables from `.env.production`
   - Redeploy after adding

#### **Option B: Using Amplify CLI**

```bash
cd Ironlog

# Configure hosting (if not done already)
amplify hosting add

# Push to AWS
amplify publish

# Choose to publish: yes (Y)
```

---

### **Phase 3: Deploy Backend to EC2**

#### **Step 1: SSH into EC2 Instance**
```bash
ssh -i /path/to/your/key.pem ec2-user@YOUR_EC2_PUBLIC_IP
# or for Ubuntu:
ssh -i /path/to/your/key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

#### **Step 2: Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

#### **Step 3: Clone Backend Code**
```bash
# Clone your repository
git clone https://github.com/yourusername/ironlog.git
cd ironlog/amplify/backend

# Install dependencies
npm install
```

#### **Step 4: Create .env File**
```bash
# Create .env file with production values
sudo nano .env

# Paste this (update with your values):
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ironlog?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=https://yourdomain.amplifyapp.com,https://your-ec2-domain.com
COGNITO_JWKS_URI=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_LKeBeMENH/.well-known/jwks.json
COGNITO_AUDIENCE=7j50580qnn5upjatjr96ufgn9u
COGNITO_ISSUER=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_LKeBeMENH

# Save: Ctrl+X → Y → Enter
```

#### **Step 5: Test Locally on EC2**
```bash
# Test the server
node server.js

# Should show:
# ✅ Connected to MongoDB Atlas
# 🚀 Server running on port 5000

# Test in another terminal:
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"...","uptime":...,"environment":"production"}

# Stop with Ctrl+C
```

#### **Step 6: Setup PM2 to Keep Server Running**
```bash
# Start with PM2
pm2 start server.js --name "ironlog-backend"

# Make it start on reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs ironlog-backend
```

#### **Step 7: Setup Nginx as Reverse Proxy (Optional but Recommended)**
```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/ironlog

# Paste this:
server {
    listen 80;
    server_name YOUR_EC2_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Save: Ctrl+X → Y → Enter

# Enable the site
sudo ln -s /etc/nginx/sites-available/ironlog /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### **Step 8: Setup SSL with Let's Encrypt (Recommended)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --standalone -d YOUR_EC2_DOMAIN

# If using Nginx:
sudo certbot --nginx -d YOUR_EC2_DOMAIN

# Auto-renewal (already enabled)
sudo systemctl enable certbot.timer
```

---

### **Phase 4: Configure Frontend to Connect to Backend**

Update `src/main.jsx` or create `.env.production.local`:

```bash
cd Ironlog
echo 'VITE_API_URL=https://your-ec2-domain.com' > .env.production.local
```

Or update in code any hardcoded API URLs:

```javascript
// Update all fetch calls to use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Example:
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

---

### **Phase 5: Final Testing**

#### **Test Backend Health**
```bash
# Test from anywhere
curl https://your-ec2-domain.com/health
# Expected: {"status":"ok","timestamp":"..."}

# Test API endpoint
curl -X GET https://your-ec2-domain.com/workouts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Test Frontend**
1. Visit: `https://yourdomain.amplifyapp.com`
2. Go through signup flow
3. Verify Cognito OTP email received
4. Complete profile setup
5. Create a workout
6. Verify data saved in MongoDB
7. Check browser DevTools Network tab for API calls

#### **Test Full User Journey**
- [ ] Signup with new email
- [ ] Receive and enter OTP
- [ ] Complete profile setup
- [ ] Create workout
- [ ] Mark exercises complete
- [ ] View in history
- [ ] Track weight
- [ ] View PRs
- [ ] Update profile
- [ ] Logout and login again

---

## 📊 Monitoring & Maintenance

### **Backend Logs**
```bash
# SSH into EC2
ssh -i /path/to/key.pem ubuntu@YOUR_EC2_IP

# View logs
pm2 logs ironlog-backend

# View specific errors
pm2 logs ironlog-backend --err
```

### **Database Monitoring**
- MongoDB Atlas Dashboard: https://cloud.mongodb.com
- Monitor: Connections, operations, storage, performance

### **Frontend Monitoring**
- Amplify Console: https://console.aws.amazon.com/amplify
- Monitor: Build status, deployments, errors

### **Performance Checks**
```bash
# On EC2, check server status
pm2 status

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
```

### **Backup Strategy**
- MongoDB: Auto-backups every 6 hours
- Code: GitHub repository
- Manual backup before major changes

---

## 🔒 Security Considerations

### **Environment Variables**
- ✅ Never commit `.env` files to Git
- ✅ Use `.env.example` as template
- ✅ Rotate database passwords regularly
- ✅ Keep JWT secrets secure

### **CORS Configuration**
- ✅ Frontend and Backend on same AWS account
- ✅ CORS restricted to known domains
- ✅ Credentials enabled for cookies

### **Database Security**
- ✅ MongoDB credentials in `.env` only
- ✅ IP whitelist in MongoDB Atlas
- ✅ Database user with minimal permissions
- ✅ Encryption at rest enabled

### **API Security**
- ✅ JWT verification on all protected endpoints
- ✅ Rate limiting configured
- ✅ Input validation on all fields
- ✅ Error messages don't leak sensitive info

---

## 📝 Environment Variables Reference

### **Frontend (.env.production.local)**
```
VITE_API_URL=https://your-ec2-domain.com
VITE_AWS_PROJECT_REGION=ap-south-1
VITE_AWS_USER_POOLS_ID=ap-south-1_LKeBeMENH
VITE_AWS_USER_POOLS_WEB_CLIENT_ID=7j50580qnn5upjatjr96ufgn9u
VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:6cd7267f-5a94-41a9-ac85-da11f41ad6ba
```

### **Backend (.env)**
```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ironlog
PORT=5000
CORS_ORIGIN=https://yourdomain.amplifyapp.com,https://api.yourdomain.com
COGNITO_JWKS_URI=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_LKeBeMENH/.well-known/jwks.json
COGNITO_AUDIENCE=7j50580qnn5upjatjr96ufgn9u
COGNITO_ISSUER=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_LKeBeMENH
```

---

## 🔗 Useful Resources

- [AWS Amplify Docs](https://docs.amplify.aws/)
- [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Express Deployment on EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PM2 Docs](https://pm2.keymetrics.io/)

---

## 🆘 Troubleshooting

### **Issue: "Cannot connect to API"**
- Check EC2 security group allows port 5000 (or 443 if using Nginx)
- Verify backend server is running: `pm2 status`
- Check logs: `pm2 logs ironlog-backend`
- Verify MONGO_URI is correct

### **Issue: "CORS error"**
- Update CORS_ORIGIN in .env to include frontend domain
- Restart backend: `pm2 restart ironlog-backend`
- Clear browser cache

### **Issue: "JWT verification failed"**
- Verify COGNITO_JWKS_URI is correct
- Check token expiration: decode JWT at jwt.io
- Ensure backend can reach Cognito JWKS URL

### **Issue: "Database connection failed"**
- Verify MONGO_URI string is correct
- Check IP whitelist in MongoDB Atlas includes EC2 IP
- Verify database user credentials

### **Issue: "502 Bad Gateway" (Nginx)**
- Check backend is running: `pm2 status`
- Check backend logs: `pm2 logs ironlog-backend`
- Verify Nginx config: `sudo nginx -t`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All code committed to GitHub
- [ ] Environment variables documented in .env.example
- [ ] Frontend build tested locally: `npm run build && npm run preview`
- [ ] Backend tested locally: `node server.js`
- [ ] All tests passing
- [ ] Security review completed

### Frontend Deployment (Amplify)
- [ ] GitHub repo connected
- [ ] Build settings configured
- [ ] Environment variables added to Amplify Console
- [ ] Build completed successfully
- [ ] Frontend accessible at public URL
- [ ] Cognito login page loads

### Backend Deployment (EC2)
- [ ] EC2 instance created and configured
- [ ] Node.js and dependencies installed
- [ ] Code cloned from GitHub
- [ ] .env file created with all variables
- [ ] Backend starts without errors
- [ ] Health endpoint responding
- [ ] PM2 configured for auto-restart

### Integration Testing
- [ ] Frontend → Cognito authentication works
- [ ] Cognito → Backend JWT validation works
- [ ] Backend → MongoDB connections work
- [ ] API endpoints returning data
- [ ] Error handling working properly
- [ ] CORS not blocking requests

### Post-Deployment
- [ ] Monitor backend logs
- [ ] Monitor Amplify build status
- [ ] Monitor MongoDB performance
- [ ] User testing with real data
- [ ] Performance acceptable
- [ ] No errors in logs

---

## 📅 Next Steps

1. **Today:** Complete .env.example and deployment guide
2. **Tomorrow:** Deploy backend to EC2 and test
3. **Tomorrow:** Deploy frontend to Amplify and test
4. **Next Day:** Full E2E testing and bug fixes
5. **Next Week:** Production monitoring and optimization

---

**Deployment Status:** Ready for Production ✅

For questions or issues, refer to the troubleshooting section or check server logs with `pm2 logs`.
