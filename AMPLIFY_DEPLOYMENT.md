# AWS Amplify Frontend Deployment Quick Start

## Prerequisites
- GitHub account with your code
- AWS account (same one where Amplify is configured)
- AWS Amplify CLI installed: `npm install -g @aws-amplify/cli`

---

## Option 1: Using AWS Amplify Console (Easiest) ⭐

### Step 1: Push Code to GitHub
```bash
cd Ironlog
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ironlog.git
git push -u origin main
```

### Step 2: Connect to Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click **"Create app"** → **"Host web app"**
3. Select **GitHub** as source
4. **Authorize** AWS to access your GitHub account
5. Select your **ironlog** repository
6. Select **main** branch
7. Accept default build settings (Amplify auto-detects Vite)
8. Click **Save and deploy**

### Step 3: Add Environment Variables
1. In Amplify Console, go to **App settings** → **Environment variables**
2. Add these variables:
   ```
   VITE_API_URL = https://your-ec2-domain.com
   VITE_AWS_PROJECT_REGION = ap-south-1
   VITE_AWS_USER_POOLS_ID = ap-south-1_LKeBeMENH
   VITE_AWS_USER_POOLS_WEB_CLIENT_ID = 7j50580qnn5upjatjr96ufgn9u
   VITE_AWS_COGNITO_IDENTITY_POOL_ID = ap-south-1:6cd7267f-5a94-41a9-ac85-da11f41ad6ba
   ```
3. Click **Save**
4. Trigger a new deployment to use these variables

### Step 4: Monitor Deployment
- Amplify will automatically build and deploy
- Watch the build logs in real-time
- Once complete, you'll get a public URL: `https://main.xxx.amplifyapp.com`

**✅ Frontend is now live!**

---

## Option 2: Using Amplify CLI

### Step 1: Initialize Amplify (if not done)
```bash
cd Ironlog
amplify init
# Follow prompts:
# - Environment name: prod
# - Editor: Visual Studio Code
# - App type: javascript
# - JS framework: react
# - Source dir: src
# - Distribution dir: dist
# - Build cmd: npm run build
# - Start cmd: npm run dev
```

### Step 2: Add Hosting
```bash
amplify add hosting
# Select: "Hosting with Amplify Console"
# Deployment method: "Git-based deployments"
```

### Step 3: Configure Environment Variables
```bash
# In amplify/backend/amplify-meta.json, add:
amplify env add
# or manually add to amplify/backend/.env
```

### Step 4: Push to AWS
```bash
amplify publish
# Choose to publish: Yes (Y)
# Watch the deployment progress
```

### Step 5: Get Your URL
```bash
amplify status
# Look for the Hosting URL
```

**✅ Frontend is now deployed!**

---

## Updating Frontend After Deployment

### Update Code and Redeploy
```bash
cd Ironlog

# Make changes to your code
# ... edit files ...

# Commit and push
git add .
git commit -m "Feature: Add new workout type"
git push origin main
```

Amplify will **automatically rebuild and deploy** when you push to main!

### Monitor Deployments
1. Go to Amplify Console
2. Click on your app
3. Go to **Deployments** tab
4. See all deployment history and logs

---

## Troubleshooting

### Build Fails
1. Check Amplify build logs in Console
2. Ensure all dependencies in `package.json` are correct
3. Run locally first: `npm run build && npm run preview`
4. Check for TypeScript/ESLint errors

### Blank Page After Deploy
1. Check browser DevTools Console for errors
2. Verify `VITE_API_URL` is set correctly
3. Ensure backend is running and accessible
4. Clear browser cache: Ctrl+Shift+Del

### API Connection Fails
1. Verify `VITE_API_URL` environment variable is set
2. Check EC2 backend is running: `pm2 status`
3. Verify CORS is configured correctly in backend
4. Check network tab in DevTools for 4xx/5xx errors

### Custom Domain
1. In Amplify Console: **App settings** → **Domain management**
2. Click **Add domain**
3. Enter your domain name
4. Update DNS records as instructed
5. Amplify auto-provisions SSL certificate

---

## Environment Variables

### Available in Browser (Vite)
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

### Must Start with `VITE_` to be accessible in frontend
❌ Not available: `API_URL`  
✅ Available: `VITE_API_URL`

### Set in Amplify Console
1. App settings → Environment variables
2. Add key=value pairs
3. Redeploy after adding

---

## Performance Optimization

### Amplify Deployments
- [ ] Enable CloudFront CDN (automatic)
- [ ] Enable image optimization
- [ ] Setup custom headers for cache control
- [ ] Monitor performance in CloudWatch

### Frontend Optimization
```bash
# Before deploying, test build:
npm run build
npm run preview

# Check bundle size:
npm run build -- --report

# Verify performance:
# - LCP < 2.5s
# - FID < 100ms
# - CLS < 0.1
```

---

## Continuous Deployment

### Branch Deployments
1. In Amplify Console: **App settings** → **Branch settings**
2. Connect multiple branches (e.g., `develop`, `staging`)
3. Each branch gets its own deployment URL
4. Test before merging to `main`

### Example Workflow
```
develop → https://develop.xxx.amplifyapp.com  (staging)
main    → https://main.xxx.amplifyapp.com     (production)
```

---

## Rollback Deployment

If something goes wrong:

1. In Amplify Console: **Deployments** tab
2. Find the previous successful deployment
3. Click **Redeploy**
4. Wait for build to complete
5. Old version is now live again

---

## Monitoring

### Check Logs
```bash
amplify logs backend --follow  # Watch logs in real-time
```

### Check Status
```bash
amplify status
```

### Analytics
1. Amplify Console → **Analytics**
2. View user activity, errors, performance

---

## Useful Commands

```bash
# Local development
npm run dev              # Start dev server (port 5173)

# Production build
npm run build            # Create optimized build
npm run preview          # Preview production build locally

# Amplify
amplify init             # Initialize Amplify
amplify push             # Push changes to AWS
amplify publish          # Push and deploy frontend
amplify status           # Check status
amplify logs frontend    # View frontend logs
amplify delete           # Remove Amplify resources

# Git
git push origin main     # Trigger Amplify deployment
git log --oneline        # View commit history
git revert HEAD~1        # Undo last commit
```

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Connect to Amplify Console
3. ✅ Add environment variables
4. ✅ Monitor first deployment
5. ✅ Verify frontend loads
6. 👉 Next: Deploy backend to EC2 (see DEPLOYMENT_GUIDE.md)

---

**Your Frontend URL:** `https://main.xxx.amplifyapp.com`  
**Monitor at:** https://console.aws.amazon.com/amplify

Questions? Check [Amplify Docs](https://docs.amplify.aws/)
