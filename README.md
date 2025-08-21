# E-commerce Full Stack Application

A modern, full-featured e-commerce platform built with React.js frontend and Node.js/Express backend.

## 🚀 Features

### Frontend (React.js)
- **Modern UI/UX**: Responsive design with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Product Catalog**: Advanced filtering, search, and pagination
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login, register, profile management
- **Checkout Process**: Multi-step checkout with payment simulation
- **Order History**: Track orders and view details
- **Product Reviews**: Customer reviews and ratings

### Backend (Node.js/Express)
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based secure authentication
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing with bcrypt
- **CORS**: Cross-origin resource sharing enabled
- **Data Validation**: Input validation and sanitization

### Key Pages & Features
- **Home Page**: Featured products and categories
- **Products Page**: Full catalog with filtering and search
- **Product Detail**: Image gallery, reviews, specifications
- **Shopping Cart**: Item management and checkout flow
- **User Profile**: Account management and order history
- **Authentication**: Secure login/register system

## 🛠️ Technology Stack

### Frontend
- React.js 18
- Redux Toolkit
- React Router DOM
- Tailwind CSS 3.4.17
- Heroicons
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS middleware

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (or local MongoDB installation)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   - Copy `.env.example` to `.env` (or create `.env` file)
   - Update the MongoDB URI in `.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will open at http://localhost:3000

## 🗄️ Database Schema

### User Model
- Personal information (name, email)
- Authentication (hashed password)
- Address information
- Role (customer/admin)

### Product Model
- Product details (name, description, price)
- Category and stock management
- Image gallery
- Specifications and ratings
- Featured product flag

### Cart Model
- User association
- Product items with quantities
- Automatic total calculation

n

## 🧪 Sample Data & Database Seeding

The application includes a comprehensive seed script with premium sample data:

### Sample Data Overview:
- **6 Categories**: Electronics, Clothing, Home & Garden, Sports & Fitness, Books, Beauty & Health
- **11 Premium Products** with detailed specifications and high-quality images
- **3 User Accounts**: 1 Admin + 2 Customer accounts with complete profiles
- **Featured Products**: Curated selection for homepage display

### Running the Seed Script:
```bash
# Navigate to server directory
cd server

# Run the seed script  
npm run seed
# OR
node seed.js
```

### Login Credentials (After Seeding):
- **Admin**: admin@ecommerce.com / admin123
- **Customer 1**: john.doe@example.com / password123  
- **Customer 2**: jane.smith@example.com / password123

### Featured Sample Products:
- **iPhone 15 Pro** ($999.99) - Latest smartphone with A17 Pro chip
- **MacBook Air M2** ($1,199.99) - Ultrabook with all-day battery  
- **Classic Denim Jacket** ($89.99) - Timeless fashion staple
- **Smart LED Strip Lights** ($39.99) - WiFi-enabled RGB lighting
- **Premium Yoga Mat** ($49.99) - Eco-friendly exercise mat
- **Vitamin C Serum** ($29.99) - Anti-aging skincare product

### Product Categories with Sample Items:
- **Electronics**: iPhone, MacBook, Sony Headphones
- **Clothing**: Denim Jacket, Cotton T-Shirt  
- **Home & Garden**: LED Strip Lights, Ceramic Plant Pots
- **Sports & Fitness**: Yoga Mat, Adjustable Dumbbells
- **Books**: Programming guides and technical books
- **Beauty & Health**: Skincare serums and health products

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order

## 🎨 UI Components

### Layout Components
- **Header**: Navigation, cart icon, user menu
- **Footer**: Links and company information
- **LoadingSpinner**: Consistent loading states

### Page Components
- **Home**: Hero section, featured products
- **Products**: Grid layout, filters, pagination
- **ProductDetail**: Image gallery, reviews, specs
- **Cart**: Item management, total calculation
- **Checkout**: Multi-step form, payment processing
- **Profile**: User information, order history

## 🚀 Production Deployment

### Environment Variables
```env
MONGODB_URI=production_mongodb_uri
JWT_SECRET=secure_random_string_32_chars_minimum
PORT=5000
NODE_ENV=production
```

### Build Commands
```bash
# Frontend build
cd client && npm run build

# Backend start
cd server && npm start
```


