# TeachNexus - Complete Setup Guide

This guide provides step-by-step instructions to set up and deploy TeachNexus.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Production Deployment](#production-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### 1. Clone Repository & Install Dependencies

```bash
# Clone project
git clone https://github.com/yourusername/teachnexus.git
cd teachnexus

# Backend setup
cd backend
npm install
cd ..

# Frontend setup
cd frontend
npm install
cd ..
```

### 2. Create Environment Files

**Backend (.env)**:

```bash
cd backend
touch .env
```

Add the following and replace with your values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teachnexus?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long!
JWT_EXPIRE=7d

# Cloudinary (Image/File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=teachnexus

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_51234567890abcdefg
STRIPE_PUBLISHABLE_KEY=pk_test_1234567890abcdefg
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890

# Email (SendGrid or Gmail)
SENDGRID_API_KEY=SG.your-sendgrid-key-here
SENDGRID_EMAIL=noreply@teachnexus.com
# OR for Gmail (app-specific password required)
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-specific-password

# Redis (Optional, for job queue)
REDIS_URL=redis://localhost:6379

# Frontend & External URLs
APP_FRONTEND_URL=http://localhost:3000
APP_BACKEND_URL=http://localhost:5000

# Logging
LOG_LEVEL=debug
```

**Frontend (.env.local)**:

```bash
cd ../frontend
touch .env.local
```

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 3. Set Up MongoDB Locally (Optional)

**Using Docker**:

```bash
docker run -d \
  --name teachnexus-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:5.0
```

Update `MONGODB_URI` in .env:

```
MONGODB_URI=mongodb://admin:password@localhost:27017/teachnexus?authSource=admin
```

**OR Use MongoDB Atlas (Recommended)**:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new project
4. Build a Cluster (M0 free tier)
5. Create database user
6. Whitelist your IP (or 0.0.0.0)
7. Get connection string → paste in MONGODB_URI

### 4. Start Development Servers

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### 5. Test Connection

Visit http://localhost:3000

- Try registering a new teacher account
- Verify email in console logs (no real email sent in dev)
- Dashboard should load

---

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel

1. **Push to GitHub**:

```bash
cd frontend
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Select `frontend` as root directory

3. **Set Environment Variables**:
   - Add `REACT_APP_API_BASE_URL` = `https://teachnexus-backend.render.com`
   - Deploy

#### Backend on Render

1. **Push to GitHub**:

```bash
cd backend
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create Service on Render**:
   - Go to https://render.com
   - Click "New +" → Web Service
   - Connect GitHub
   - Select repository
   - Select `backend` directory
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`

3. **Set Environment Variables** (in Render dashboard):
   - Add all variables from `.env.example`
   - Ensure `MONGODB_URI` points to MongoDB Atlas
   - Ensure `APP_FRONTEND_URL` = Vercel URL

4. **Deploy** - Render deploys automatically

### Option 2: Deploy Everything to VPS (DigitalOcean, Linode, etc.)

```bash
# SSH into server
ssh root@your_server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb

# Install Nginx (reverse proxy)
sudo apt-get install -y nginx

# Clone repo
git clone https://github.com/yourusername/teachnexus.git
cd teachnexus

# Setup backend
cd backend
npm install
npm run build
# Create PM2 startup script (see below)

# Setup frontend
cd ../frontend
npm install
npm run build
# Serve with Nginx (see below)
```

**PM2 Configuration** (backend/ecosystem.config.js):

```javascript
module.exports = {
  apps: [
    {
      name: "teachnexus-api",
      script: "./src/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
    },
  ],
};
```

```bash
# Install PM2 globally
sudo npm install pm2 -g

# Start app with PM2
pm2 start ecosystem.config.js

# Make it start on boot
pm2 startup
pm2 save
```

**Nginx Configuration** (/etc/nginx/sites-available/default):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /home/ubuntu/teachnexus/frontend/build;
        try_files $uri /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket proxy
    location /socket.io {
        proxy_pass http://localhost:5000/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable Nginx config
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Environment Configuration

### Cloudinary Setup

1. **Create Account**: https://cloudinary.com/users/register/free
2. **Dashboard → Settings**:
   - Copy `Cloud Name` → `CLOUDINARY_CLOUD_NAME`
   - Copy `API Key` → `CLOUDINARY_API_KEY`
   - Copy `API Secret` → `CLOUDINARY_API_SECRET`
3. Create folder named `teachnexus` for uploads

### Stripe Setup

1. **Create Account**: https://dashboard.stripe.com
2. **Get API Keys**:
   - Publishable Key (starts with `pk_`) → frontend
   - Secret Key (starts with `sk_`) → backend
   - Webhook Secret (after creating webhook) → backend
3. **Create Products**:
   - Basic Plan: $5/month
   - Premium Plan: $15/month
   - Enterprise Plan: $50/month

### SendGrid Setup

1. **Create Account**: https://sendgrid.com
2. **Create API Key**:
   - Settings → API Keys → Create API Key
   - Copy key → `SENDGRID_API_KEY`
3. **Verify Email**:
   - Settings → Sender Authentication
   - Verify domain for production

---

## Database Setup

### Seed Development Data

**Create file: backend/scripts/seed.js**:

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../src/models/User");
const School = require("../src/models/School");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany({});
    await School.deleteMany({});

    // Create schools
    const schools = await School.insertMany([
      {
        name: "Springfield Elementary",
        motto: "Excellence in Education",
        email: "info@springfield-elem.edu",
        phone: "+1-555-0100",
        schoolType: "public",
      },
      {
        name: "Lincoln High School",
        motto: "Preparing Tomorrow's Leaders",
        email: "info@lincoln-high.edu",
        phone: "+1-555-0200",
        schoolType: "public",
      },
    ]);

    // Create test users
    const salt = await bcrypt.genSalt(10);
    const users = await User.insertMany([
      {
        firstName: "John",
        lastName: "Teacher",
        email: "john@example.com",
        password: await bcrypt.hash("Password123!", salt),
        userType: "teacher",
        schoolName: schools[0].name,
        subjectSpecializations: ["Mathematics", "Science"],
        gradeLevels: ["9-10"],
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: await bcrypt.hash("Password123!", salt),
        userType: "teacher",
        schoolName: schools[1].name,
        subjectSpecializations: ["English Language Arts"],
        gradeLevels: ["11-12"],
      },
    ]);

    console.log("✅ Seeded 2 schools and 2 users");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedData();
```

**Run seed**:

```bash
cd backend
node scripts/seed.js
```

**Test Login**:

- Email: `john@example.com`
- Password: `Password123!`

---

## Troubleshooting

### "EADDRINUSE :::5000"

Port 5000 already in use:

```bash
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>
# Or use different port
PORT=5001 npm run dev
```

### "MongoDB connection refused"

```bash
# Check connection string
echo $MONGODB_URI

# Test connection with MongoDB Compass
# URI: mongodb+srv://user:pass@cluster.net/teachnexus

# Or ensure local MongoDB running
docker ps  # Check Docker container
sudo systemctl status mongodb  # Check system service
```

### "CORS error in browser"

Add to backend server.js:

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "https://yourdomain.com"],
    credentials: true,
  }),
);
```

### "Cloudinary upload fails"

- Verify API credentials in .env
- Check upload folder exists in Cloudinary dashboard
- Test URL format returned from upload

### Frontend blank/404 on production

- Build frontend: `npm run build`
- Ensure nginx serves from correct build directory
- Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### "Token invalid" after deployment

- Check `JWT_SECRET` consistent across deployments
- Ensure `.env` variables copied correctly
- Clear browser localStorage and re-login

---

## Performance Optimization

### Frontend

```bash
# Analyze bundle
npm run build -- --analyze

# Use lazy loading for pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

### Backend

```javascript
// Add caching headers
app.use(express.static("public", { maxAge: "1d" }));

// Add compression
const compression = require("compression");
app.use(compression());

// Use MongoDB indexes
db.resources.createIndex({ title: "text", description: "text" });
```

---

## Monitoring & Logging

### Backend Logging

Install Winston:

```bash
npm install winston
```

Use in controllers:

```javascript
logger.info("Resource created", { userId, resourceId });
logger.error("Upload failed", error);
```

### Application Monitoring

Consider: Sentry, New Relic, or DataDog

---

**Deployment checklist**:

- [ ] All `.env` variables configured
- [ ] MongoDB Atlas connection working
- [ ] Cloudinary credentials valid
- [ ] Stripe test keys set
- [ ] SendGrid API key configured
- [ ] Frontend built (`npm run build`)
- [ ] Backend running on production port
- [ ] Nginx/reverse proxy configured
- [ ] SSL certificate installed (HTTPS)
- [ ] Database backups configured
- [ ] Monitoring alerts enabled

For more help, check the [README.md](./README.md) or open an issue on GitHub.
