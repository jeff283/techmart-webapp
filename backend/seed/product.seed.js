const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product.model');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedProducts = async () => {
  try {
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      const products = [
        {
          name: "Acer Aspire 5",
          description: "A powerful and budget-friendly laptop for multitasking.",
          price: 499.99,
          stock: 50,
          category: "Laptops",
          image: "https://placehold.co/600x400?text=Acer+Aspire+5",
          featured: true
        },
        {
          name: "Apple iPhone 14 Pro",
          description: "The latest iPhone with advanced camera features and powerful performance.",
          price: 1199.99,
          stock: 30,
          category: "Smartphones",
          image: "https://placehold.co/600x400?text=iPhone+14+Pro",
          featured: true
        },
        {
          name: "Samsung Galaxy Watch 6",
          description: "A versatile smartwatch with fitness tracking and health monitoring.",
          price: 349.99,
          stock: 20,
          category: "Wearables",
          image: "https://placehold.co/600x400?text=Galaxy+Watch+6"
        },
        {
          name: "Logitech MX Master 3",
          description: "An ergonomic wireless mouse designed for professionals.",
          price: 99.99,
          stock: 100,
          category: "Accessories",
          image: "https://placehold.co/600x400?text=MX+Master+3"
        },
        {
          name: "Dell XPS 13",
          description: "A high-end ultrabook with stunning display and great performance.",
          price: 1299.99,
          stock: 15,
          category: "Computers",
          image: "https://placehold.co/600x400?text=Dell+XPS+13",
          featured: true
        }
      ];

      await Product.insertMany(products);
      console.log("✅ 5 products have been seeded successfully!");
    } else {
      console.log("ℹ️ Products already exist in the database. Seeding skipped.");
    }
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
