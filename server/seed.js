const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample categories
const categories = [
  {
    name: 'Electronics',
    description: 'Latest electronic devices and gadgets',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Home & Garden',
    description: 'Everything for your home and garden',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Books',
    description: 'Books and educational materials',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    name: 'Beauty & Health',
    description: 'Beauty products and health supplements',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=300&fit=crop',
    isActive: true
  }
];

// Sample products
const products = [
  // Electronics
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Experience the future of mobile technology.',
    price: 999.99,
    originalPrice: 1099.99,
    category: 'Electronics',
    brand: 'Apple',
    sku: 'IPHONE15PRO-128GB',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        alt: 'iPhone 15 Pro Front View'
      },
      {
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
        alt: 'iPhone 15 Pro Back View'
      }
    ],
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '128GB',
      'Camera': '48MP Main Camera',
      'Battery': 'Up to 23 hours video playback'
    },
    stock: 50,
    isActive: true,
    isFeatured: true,
    tags: ['smartphone', 'apple', 'premium', 'latest'],
    rating: 4.8,
    reviewCount: 124
  },
  {
    name: 'MacBook Air M2',
    description: 'Supercharged by M2 chip. Incredibly thin and light design with all-day battery life.',
    price: 1199.99,
    originalPrice: 1299.99,
    category: 'Electronics',
    brand: 'Apple',
    sku: 'MBA-M2-256GB',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
        alt: 'MacBook Air M2'
      }
    ],
    specifications: {
      'Chip': 'Apple M2',
      'Display': '13.6-inch Liquid Retina',
      'Memory': '8GB unified memory',
      'Storage': '256GB SSD',
      'Battery': 'Up to 18 hours'
    },
    stock: 30,
    isActive: true,
    isFeatured: true,
    tags: ['laptop', 'apple', 'ultrabook', 'productivity'],
    rating: 4.9,
    reviewCount: 89
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
    price: 349.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'Sony',
    sku: 'SONY-WH1000XM5-BLACK',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
        alt: 'Sony WH-1000XM5 Headphones'
      }
    ],
    specifications: {
      'Type': 'Over-ear, Wireless',
      'Noise Canceling': 'Yes, Industry-leading',
      'Battery': '30 hours',
      'Connectivity': 'Bluetooth 5.2, Wired',
      'Weight': '250g'
    },
    stock: 75,
    isActive: true,
    isFeatured: false,
    tags: ['headphones', 'sony', 'noise-canceling', 'wireless'],
    rating: 4.7,
    reviewCount: 156
  },

  // Clothing
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket made from premium cotton. Perfect for layering and versatile styling.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Clothing',
    brand: "Levi's",
    sku: 'DENIM-JACKET-M-BLUE',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
        alt: 'Classic Denim Jacket'
      }
    ],
    specifications: {
      'Material': '100% Cotton Denim',
      'Fit': 'Regular',
      'Closure': 'Button-up',
      'Pockets': '2 chest pockets, 2 side pockets',
      'Care': 'Machine wash cold'
    },
    variants: [
      { size: 'S', color: 'Blue', stock: 15 },
      { size: 'M', color: 'Blue', stock: 25 },
      { size: 'L', color: 'Blue', stock: 20 },
      { size: 'XL', color: 'Blue', stock: 12 }
    ],
    stock: 72,
    isActive: true,
    isFeatured: true,
    tags: ['denim', 'jacket', 'casual', 'unisex'],
    rating: 4.5,
    reviewCount: 203
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft premium cotton t-shirt with perfect fit. Essential wardrobe staple.',
    price: 24.99,
    originalPrice: 34.99,
    category: 'Clothing',
    brand: 'ComfortWear',
    sku: 'COTTON-TEE-WHITE-M',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
        alt: 'Premium Cotton T-Shirt'
      }
    ],
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Regular',
      'Neckline': 'Crew neck',
      'Sleeve': 'Short sleeve',
      'Care': 'Machine wash warm'
    },
    variants: [
      { size: 'S', color: 'White', stock: 20 },
      { size: 'M', color: 'White', stock: 35 },
      { size: 'L', color: 'White', stock: 25 },
      { size: 'XL', color: 'White', stock: 15 }
    ],
    stock: 95,
    isActive: true,
    isFeatured: false,
    tags: ['t-shirt', 'cotton', 'basic', 'comfortable'],
    rating: 4.6,
    reviewCount: 78
  },

  // Home & Garden
  {
    name: 'Smart LED Strip Lights',
    description: 'WiFi-enabled LED strip lights with 16 million colors. Control with smartphone app or voice commands.',
    price: 39.99,
    originalPrice: 59.99,
    category: 'Home & Garden',
    brand: 'SmartHome',
    sku: 'LED-STRIP-16FT-RGB',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
        alt: 'Smart LED Strip Lights'
      }
    ],
    specifications: {
      'Length': '16 feet (5 meters)',
      'Colors': '16 million colors',
      'Connectivity': 'WiFi, Bluetooth',
      'Control': 'App, Voice commands',
      'Power': '12V DC adapter included'
    },
    stock: 120,
    isActive: true,
    isFeatured: true,
    tags: ['led', 'smart-home', 'lighting', 'rgb'],
    rating: 4.4,
    reviewCount: 234
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 modern ceramic plant pots with drainage holes. Perfect for indoor plants and succulents.',
    price: 34.99,
    originalPrice: 49.99,
    category: 'Home & Garden',
    brand: 'GreenThumb',
    sku: 'CERAMIC-POT-SET-3PC',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop',
        alt: 'Ceramic Plant Pot Set'
      }
    ],
    specifications: {
      'Material': 'High-quality ceramic',
      'Sizes': 'Small, Medium, Large',
      'Drainage': 'Yes, with holes',
      'Finish': 'Matte white',
      'Includes': '3 pots, 3 saucers'
    },
    stock: 60,
    isActive: true,
    isFeatured: false,
    tags: ['plants', 'pots', 'ceramic', 'garden'],
    rating: 4.7,
    reviewCount: 92
  },

  // Sports & Fitness
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick, non-slip yoga mat made from eco-friendly materials. Perfect for all types of yoga and exercise.',
    price: 49.99,
    originalPrice: 69.99,
    category: 'Sports & Fitness',
    brand: 'ZenFit',
    sku: 'YOGA-MAT-PREMIUM-PURPLE',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
        alt: 'Premium Yoga Mat'
      }
    ],
    specifications: {
      'Thickness': '6mm extra thick',
      'Material': 'Eco-friendly TPE',
      'Size': '72" x 24"',
      'Texture': 'Non-slip surface',
      'Weight': '2.5 lbs'
    },
    stock: 85,
    isActive: true,
    isFeatured: true,
    tags: ['yoga', 'fitness', 'mat', 'exercise'],
    rating: 4.8,
    reviewCount: 167
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbells with quick-change weight system. Perfect for home workouts.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Sports & Fitness',
    brand: 'FitPro',
    sku: 'DUMBBELL-ADJ-50LB-PAIR',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
        alt: 'Adjustable Dumbbells Set'
      }
    ],
    specifications: {
      'Weight Range': '5-50 lbs per dumbbell',
      'Adjustment': 'Quick-change dial system',
      'Material': 'Cast iron with rubber coating',
      'Handle': 'Ergonomic grip',
      'Includes': 'Pair of dumbbells, storage tray'
    },
    stock: 25,
    isActive: true,
    isFeatured: false,
    tags: ['dumbbells', 'weights', 'fitness', 'home-gym'],
    rating: 4.6,
    reviewCount: 143
  },

  // Books
  {
    name: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming techniques and best practices. Perfect for developers of all levels.',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Books',
    brand: 'TechPress',
    sku: 'BOOK-PROG-ART-2024',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop',
        alt: 'The Art of Programming Book'
      }
    ],
    specifications: {
      'Pages': '650 pages',
      'Format': 'Paperback',
      'Language': 'English',
      'Publisher': 'TechPress',
      'Edition': '3rd Edition (2024)'
    },
    stock: 200,
    isActive: true,
    isFeatured: false,
    tags: ['programming', 'technology', 'education', 'software'],
    rating: 4.9,
    reviewCount: 45
  },

  // Beauty & Health
  {
    name: 'Vitamin C Serum',
    description: 'Premium vitamin C serum with hyaluronic acid. Brightens skin and reduces signs of aging.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Beauty & Health',
    brand: 'GlowSkin',
    sku: 'SERUM-VITC-30ML',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop',
        alt: 'Vitamin C Serum'
      }
    ],
    specifications: {
      'Volume': '30ml',
      'Active Ingredient': '20% Vitamin C',
      'Additional': 'Hyaluronic Acid, Vitamin E',
      'Skin Type': 'All skin types',
      'Usage': 'Morning application'
    },
    stock: 150,
    isActive: true,
    isFeatured: true,
    tags: ['skincare', 'vitamin-c', 'serum', 'anti-aging'],
    rating: 4.5,
    reviewCount: 289
  }
];

// Sample users
const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'customer',
    isEmailVerified: true,
    phone: '+1234567890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'customer',
    isEmailVerified: true,
    phone: '+1987654321',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210'
  }
];

// Clear existing data and seed new data
const seedData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    
    // Clear existing collections
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    
    console.log('✅ Existing data cleared');

    console.log('📂 Creating categories...');
    
    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    console.log('📦 Creating products...');
    
    // Create products with category references
    const productsWithCategoryIds = products.map(product => {
      const category = createdCategories.find(cat => cat.name === product.category);
      return {
        ...product,
        category: category._id
      };
    });

    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('👥 Creating users...');
    
    // Create users with hashed passwords
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Users: ${createdUsers.length}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('Customer 1: john.doe@example.com / password123');
    console.log('Customer 2: jane.smith@example.com / password123');

    console.log('\n✨ Featured Products:');
    const featuredProducts = createdProducts.filter(p => p.isFeatured);
    featuredProducts.forEach(product => {
      console.log(`  • ${product.name} - $${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

// Run the seed script
const runSeed = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('\n🚀 Database seeded successfully! You can now start using the application.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Execute if this file is run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedData, connectDB };
