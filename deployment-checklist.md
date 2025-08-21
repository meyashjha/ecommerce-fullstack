# 📋 Deployment Checklist

## Pre-Deployment Setup ✅

- [ ] **Dependencies Installed**
  - [ ] Frontend dependencies (`cd client && npm install`)
  - [ ] Backend dependencies (`cd server && npm install`)

- [ ] **Environment Variables Configured**
  - [ ] `client/.env` with `REACT_APP_API_URL`
  - [ ] `server/.env` with `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`

- [ ] **Build Tests Successful**
  - [ ] Frontend builds without errors (`cd client && npm run build`)
  - [ ] Backend starts without errors (`cd server && npm start`)

- [ ] **Git Repository Setup**
  - [ ] Git initialized (`git init`)
  - [ ] All files added (`git add .`)
  - [ ] Initial commit made (`git commit -m "Initial commit"`)

## Deployment Steps 🚀

### 1. GitHub Repository Setup
- [ ] Create new repository on GitHub: `ecommerce-fullstack`
- [ ] Push code to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/ecommerce-fullstack.git
  git branch -M main
  git push -u origin main
  ```

### 2. Backend Deployment (Railway) 🚆
- [ ] Sign up at [Railway](https://railway.app)
- [ ] Connect GitHub account
- [ ] Create new project → Deploy from GitHub repo
- [ ] Configure settings:
  - [ ] **Root Directory**: `server`
  - [ ] **Start Command**: `npm start`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI=your_mongodb_connection_string`
  - [ ] `JWT_SECRET=your_super_secure_jwt_secret`
- [ ] Deploy and note the backend URL

### 3. Frontend Deployment (Vercel) ⚡
- [ ] Sign up at [Vercel](https://vercel.com)
- [ ] Connect GitHub account
- [ ] Import project from GitHub
- [ ] Configure settings:
  - [ ] **Framework Preset**: Create React App
  - [ ] **Root Directory**: `client`
  - [ ] **Build Command**: `npm run build`
  - [ ] **Output Directory**: `build`
- [ ] Add environment variable:
  - [ ] `REACT_APP_API_URL=https://your-backend-url.railway.app`
- [ ] Deploy and note the frontend URL

### 4. Database Configuration (MongoDB Atlas) 🍃
- [ ] Update Network Access:
  - [ ] Add IP address `0.0.0.0/0` (allow all)
  - [ ] Or add specific Railway IP addresses
- [ ] Verify connection string is correct in backend `.env`

### 5. Final Backend Configuration 🔧
- [ ] Update CORS settings in `server/index.js`:
  ```javascript
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://your-frontend-url.vercel.app'
    ],
    credentials: true
  }));
  ```
- [ ] Commit and push changes to trigger redeployment

## Post-Deployment Testing 🧪

### Frontend Testing
- [ ] Homepage loads correctly
- [ ] Navigation works properly
- [ ] Product catalog displays
- [ ] Search functionality works
- [ ] User registration works
- [ ] User login works
- [ ] Cart functionality works
- [ ] Responsive design on mobile

### Backend Testing
- [ ] API endpoints respond correctly
- [ ] Authentication works
- [ ] Database operations successful
- [ ] CORS configured properly
- [ ] Environment variables loaded

### End-to-End Testing
- [ ] Complete user registration flow
- [ ] Browse and search products
- [ ] Add items to cart
- [ ] Complete checkout process
- [ ] View order history
- [ ] Test on different devices/browsers

## Production URLs 🌐

- **Frontend URL**: https://your-app.vercel.app
- **Backend API URL**: https://your-api.railway.app
- **Admin Access**: Use seeded admin credentials

## Alternative Deployment Options

### Option 2: Netlify + Heroku
- **Frontend**: [Netlify](https://netlify.com)
- **Backend**: [Heroku](https://heroku.com)

### Option 3: Digital Ocean App Platform
- **Full Stack**: [Digital Ocean](https://digitalocean.com/products/app-platform)

### Option 4: AWS
- **Frontend**: AWS Amplify
- **Backend**: AWS Lambda + API Gateway
- **Database**: AWS DocumentDB

## Troubleshooting 🔍

### Common Issues:
1. **CORS Errors**: Update CORS origins in backend
2. **Build Failures**: Check package.json and dependencies
3. **Database Connection**: Verify MongoDB URI and network access
4. **Environment Variables**: Ensure all required variables are set
5. **API Not Found**: Verify REACT_APP_API_URL is correct

### Support Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

## Security Best Practices ✅

- [ ] JWT secret is strong (32+ characters)
- [ ] MongoDB credentials are secure
- [ ] CORS origins are specific (not wildcard in production)
- [ ] Environment variables contain no hardcoded secrets
- [ ] HTTPS is enabled on all endpoints
- [ ] Input validation is implemented
- [ ] Password hashing is working

---

**🎉 Congratulations! Your e-commerce application is now live!**

Remember to monitor your application and update dependencies regularly for security and performance.
