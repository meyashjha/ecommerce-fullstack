#!/bin/bash

# E-commerce Application Deployment Setup Script
# This script helps you set up the project for deployment

echo "🚀 E-commerce Application Deployment Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "client" ] && [ ! -d "server" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Checking project structure...${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v16 or higher.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js is installed${NC}"
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm is installed${NC}"
fi

if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Git is installed${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"

echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd server
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd client
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

# Create environment files if they don't exist
echo -e "${BLUE}🔧 Setting up environment files...${NC}"

if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo -e "${YELLOW}⚠️  Created server/.env from template. Please update with your values.${NC}"
else
    echo -e "${GREEN}✅ server/.env already exists${NC}"
fi

if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo -e "${YELLOW}⚠️  Created client/.env from template. Please update with your values.${NC}"
else
    echo -e "${GREEN}✅ client/.env already exists${NC}"
fi

# Initialize git if not already done
echo -e "${BLUE}📝 Setting up Git repository...${NC}"

if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

# Test build
echo -e "${BLUE}🏗️  Testing production build...${NC}"

echo -e "${YELLOW}Testing frontend build...${NC}"
cd client
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    cd ..
    exit 1
fi

cd ..

# Create deployment checklist
echo -e "${BLUE}📋 Creating deployment checklist...${NC}"

cat > DEPLOYMENT_CHECKLIST.md << EOF
# Deployment Checklist ✅

## Prerequisites
- [ ] Node.js v16+ installed
- [ ] npm installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] MongoDB Atlas account created

## Environment Setup
- [ ] Update \`server/.env\` with your MongoDB URI
- [ ] Update \`server/.env\` with a secure JWT secret
- [ ] Update \`client/.env\` with your API URL

## GitHub Repository
- [ ] Create repository on GitHub
- [ ] Add remote origin: \`git remote add origin https://github.com/USERNAME/REPO.git\`
- [ ] Push code: \`git add . && git commit -m "Initial commit" && git push -u origin main\`

## Backend Deployment (Railway)
- [ ] Sign up at railway.app
- [ ] Connect GitHub repository
- [ ] Set root directory to \`server\`
- [ ] Add environment variables in Railway dashboard
- [ ] Deploy and test API endpoints

## Frontend Deployment (Vercel)
- [ ] Sign up at vercel.com
- [ ] Connect GitHub repository
- [ ] Set root directory to \`client\`
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy and test application

## Post-Deployment
- [ ] Test all user flows
- [ ] Verify API integration
- [ ] Test responsive design
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)

## Environment Variables Reference

### Backend (.env)
\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_32_char_jwt_secret
NODE_ENV=production
PORT=5000
\`\`\`

### Frontend (.env)
\`\`\`
REACT_APP_API_URL=https://your-backend-url.railway.app
\`\`\`
EOF

echo -e "${GREEN}✅ Deployment checklist created${NC}"

# Final instructions
echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. ${YELLOW}Update environment files:${NC}"
echo -e "   - Edit ${BLUE}server/.env${NC} with your MongoDB URI and JWT secret"
echo -e "   - Edit ${BLUE}client/.env${NC} with your API URL"
echo -e "\n2. ${YELLOW}Create GitHub repository and push code:${NC}"
echo -e "   ${BLUE}git add .${NC}"
echo -e "   ${BLUE}git commit -m \"Initial commit: E-commerce application\"${NC}"
echo -e "   ${BLUE}git remote add origin https://github.com/USERNAME/REPO.git${NC}"
echo -e "   ${BLUE}git push -u origin main${NC}"
echo -e "\n3. ${YELLOW}Deploy to Railway (backend) and Vercel (frontend)${NC}"
echo -e "   Follow the detailed guide in ${BLUE}DEPLOYMENT_GUIDE.md${NC}"
echo -e "\n4. ${YELLOW}Check the deployment checklist:${NC}"
echo -e "   ${BLUE}DEPLOYMENT_CHECKLIST.md${NC}"
echo -e "\n${GREEN}📚 Documentation:${NC}"
echo -e "   - ${BLUE}README-DEPLOYMENT.md${NC} - Project overview and setup"
echo -e "   - ${BLUE}DEPLOYMENT_GUIDE.md${NC} - Detailed deployment instructions"
echo -e "   - ${BLUE}explanation.md${NC} - Technical documentation"

echo -e "\n${GREEN}Happy deploying! 🚀${NC}"
