# Deploy Express Backend to AWS Elastic Beanstalk

**Goal:** Move your backend from EC2 to Elastic Beanstalk for automatic HTTPS, load balancing, and free tier eligibility.

**Estimated Time:** 30-45 minutes

---

## **Phase 1: Prepare Backend for Beanstalk (5 min)**

### Step 1A: Update `amplify/backend/server.js` for Beanstalk

Beanstalk uses environment variable `PORT` (default 8081). Update your server to listen on any port:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

**Your current code already does this!** ✅

### Step 1B: Create `.ebignore` file

In `amplify/backend/`, create a file named `.ebignore` to exclude unnecessary files:

```
node_modules/
.git/
.gitignore
README.mdpip install awsebclipip install awsebclipip install awsebcli
*.log
.env.local
.env.*.local
.DS_Store
```

### Step 1C: Verify `package.json` has correct scripts

Your `amplify/backend/package.json` should have:

```json
{
  "name": "ironlog-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    // ... your deps
  }
}
```

The `"start"` script is CRITICAL — Beanstalk runs this to start your app.

---

## **Phase 2: Create Elastic Beanstalk Environment (15 min)**

### Step 2A: Install Elastic Beanstalk CLI

```bash
# On Windows:
choco install awsebcli
# or download from: https://github.com/aws/aws-elastic-beanstalk-cli-setup

# Verify:
eb --version
```

### Step 2B: Initialize Beanstalk in Your Backend

```bash
cd C:\Ironlog\amplify\backend
eb init
```

**Follow the prompts:**
- **Region:** `ap-south-1` (same as your AWS setup)
- **Application name:** `ironlog-backend`
- **Platform:** `Node.js running on 64bit Amazon Linux 2`
- **CodeCommit:** `n` (no, use git push instead)
- **SSH:** `n` (skip for now)

### Step 2C: Create Environment

```bash
eb create production --instance-type t2.micro --envvars MONGO_URI=mongodb+srv://inderdevgan90_db_user:Inder@123@cluster0.1ahnfxk.mongodb.net/IronlogDB?retryWrites=true&w=majority,COGNITO_REGION=ap-south-1,COGNITO_USER_POOL_ID=ap-south-1_LKeBeMENH,COGNITO_CLIENT_ID=7j50580qnn5upjatjr96ufgn9u,NODE_ENV=production
```

**What this does:**
- Creates environment named `production`
- Uses `t2.micro` (free tier eligible for 12 months)
- Sets all your environment variables
- Deploys your code automatically

**Wait 10-15 minutes** for deployment...

### Step 2D: Monitor Deployment

```bash
eb status
```

Keep running until you see: `Status: Ready`

Then get your URL:

```bash
eb open
```

This opens your backend URL in browser. You should see:
```
IronLog backend is running ✅
```

**Copy this URL!** It looks like:
```
http://ironlog-backend-production.ap-south-1.elasticbeanstalk.com
```

---

## **Phase 3: Enable HTTPS (5 min)**

### Step 3A: Enable HTTPS in Beanstalk Console

1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk)
2. Click your environment (`production`)
3. Go to **Configuration** → **Load Balancer**
4. Click **Edit**
5. Under **Listeners**, add:
   - **Port:** 443
   - **Protocol:** HTTPS
   - **SSL Certificate:** Choose or create from ACM
6. **Save**

OR use AWS CLI:

```bash
eb scale 1
```

This ensures load balancer is enabled (required for HTTPS).

Then in console, manually add HTTPS listener.

### Step 3B: Get HTTPS URL

Once HTTPS is enabled, your URL becomes:
```
https://ironlog-backend-production.ap-south-1.elasticbeanstalk.com
```

---

## **Phase 4: Update Frontend (5 min)**

### Step 4A: Update Amplify Environment Variable

1. Go to [Amplify Console](https://console.aws.amazon.com/amplify)
2. **Hosting** → **Environment variables**
3. Update `VITE_API_URL`:
   - **Old:** `http://13.202.84.153:80`
   - **New:** `https://ironlog-backend-production.ap-south-1.elasticbeanstalk.com`
4. **Save**

### Step 4B: Redeploy Frontend

Push a git commit:

```bash
cd C:\Ironlog
git add .
git commit -m "update backend url to elastic beanstalk https"
git push origin main
```

Wait 5 minutes for Amplify build to complete.

---

## **Phase 5: Test Login (5 min)**

1. Go to `https://main.d1ooh0nczm0urv.amplifyapp.com/login`
2. Try to login
3. **Check browser console (F12 → Console)**
4. Should see **NO errors** ✅
5. Login should work! 🎉

---

## **Troubleshooting**

| Error | Fix |
|-------|-----|
| `502 Bad Gateway` | Backend not running. Check: `eb logs` |
| Connection timeout | Security group not allowing traffic. Check AWS SG rules. |
| `CORS error` | Update backend `cors()` to allow Amplify domain. |
| HTTPS cert warning | Wait 30 min for cert provisioning. |

---

## **Clean Up (Optional)**

### Stop the old EC2 instance

If you want to save money:

```bash
# SSH into EC2
ssh -i /path/to/key.pem ec2-user@13.202.84.153

# Kill the Node process
sudo pkill -f "node /home/ec2-user/Ironlog"

# Optionally stop the instance in AWS Console
```

---

## **Monitoring**

After deployment, check logs:

```bash
eb logs
```

See environment status:

```bash
eb status
```

View in dashboard:

```bash
eb open
```

---

**You're done!** Your backend is now on Elastic Beanstalk with HTTPS! 🎉

For production, consider setting up CI/CD with `git push` → auto-deploy.

