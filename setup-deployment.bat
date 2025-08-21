@echo off
setlocal enabledelayedexpansion

:: E-commerce Application Deployment Setup Script (Windows)
:: This script helps you set up the project for deployment

echo.
echo ============================================
echo    E-commerce Application Deployment Setup
echo ============================================
echo.

:: Check if we're in the right directory
if not exist "client" (
    if not exist "server" (
        echo ERROR: Please run this script from the project root directory
        pause
        exit /b 1
    )
)

echo [INFO] Checking project structure...

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Node.js is installed
)

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed.
    pause
    exit /b 1
) else (
    echo [SUCCESS] npm is installed
)

:: Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Git is installed
)

:: Install dependencies
echo.
echo [INFO] Installing dependencies...

echo [INFO] Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend dependencies installed
)

cd ..

echo [INFO] Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend dependencies installed
)

cd ..

:: Create environment files
echo.
echo [INFO] Setting up environment files...

if not exist "server\.env" (
    copy "server\.env.example" "server\.env" >nul
    echo [WARNING] Created server\.env from template. Please update with your values.
) else (
    echo [SUCCESS] server\.env already exists
)

if not exist "client\.env" (
    copy "client\.env.example" "client\.env" >nul
    echo [WARNING] Created client\.env from template. Please update with your values.
) else (
    echo [SUCCESS] client\.env already exists
)

:: Initialize git if not already done
echo.
echo [INFO] Setting up Git repository...

if not exist ".git" (
    git init
    echo [SUCCESS] Git repository initialized
) else (
    echo [SUCCESS] Git repository already exists
)

:: Test build
echo.
echo [INFO] Testing production build...

echo [INFO] Testing frontend build...
cd client
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    cd ..
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend build successful
)

cd ..

:: Create deployment checklist
echo.
echo [INFO] Creating deployment checklist...

(
echo # Deployment Checklist ✅
echo.
echo ## Prerequisites
echo - [ ] Node.js v16+ installed
echo - [ ] npm installed
echo - [ ] Git installed
echo - [ ] GitHub account created
echo - [ ] MongoDB Atlas account created
echo.
echo ## Environment Setup
echo - [ ] Update `server/.env` with your MongoDB URI
echo - [ ] Update `server/.env` with a secure JWT secret
echo - [ ] Update `client/.env` with your API URL
echo.
echo ## GitHub Repository
echo - [ ] Create repository on GitHub
echo - [ ] Add remote origin: `git remote add origin https://github.com/USERNAME/REPO.git`
echo - [ ] Push code: `git add . ^&^& git commit -m "Initial commit" ^&^& git push -u origin main`
echo.
echo ## Backend Deployment ^(Railway^)
echo - [ ] Sign up at railway.app
echo - [ ] Connect GitHub repository
echo - [ ] Set root directory to `server`
echo - [ ] Add environment variables in Railway dashboard
echo - [ ] Deploy and test API endpoints
echo.
echo ## Frontend Deployment ^(Vercel^)
echo - [ ] Sign up at vercel.com
echo - [ ] Connect GitHub repository
echo - [ ] Set root directory to `client`
echo - [ ] Add environment variables in Vercel dashboard
echo - [ ] Deploy and test application
echo.
echo ## Post-Deployment
echo - [ ] Test all user flows
echo - [ ] Verify API integration
echo - [ ] Test responsive design
echo - [ ] Set up monitoring
echo - [ ] Configure custom domain ^(optional^)
echo.
echo ## Environment Variables Reference
echo.
echo ### Backend ^(.env^)
echo ```
echo MONGODB_URI=your_mongodb_connection_string
echo JWT_SECRET=your_secure_32_char_jwt_secret
echo NODE_ENV=production
echo PORT=5000
echo ```
echo.
echo ### Frontend ^(.env^)
echo ```
echo REACT_APP_API_URL=https://your-backend-url.railway.app
echo ```
) > DEPLOYMENT_CHECKLIST.md

echo [SUCCESS] Deployment checklist created

:: Final instructions
echo.
echo ============================================
echo            Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo.
echo 1. Update environment files:
echo    - Edit server\.env with your MongoDB URI and JWT secret
echo    - Edit client\.env with your API URL
echo.
echo 2. Create GitHub repository and push code:
echo    git add .
echo    git commit -m "Initial commit: E-commerce application"
echo    git remote add origin https://github.com/USERNAME/REPO.git
echo    git push -u origin main
echo.
echo 3. Deploy to Railway (backend) and Vercel (frontend)
echo    Follow the detailed guide in DEPLOYMENT_GUIDE.md
echo.
echo 4. Check the deployment checklist:
echo    DEPLOYMENT_CHECKLIST.md
echo.
echo Documentation:
echo    - README-DEPLOYMENT.md - Project overview and setup
echo    - DEPLOYMENT_GUIDE.md - Detailed deployment instructions
echo    - explanation.md - Technical documentation
echo.
echo Happy deploying!
echo.
pause
