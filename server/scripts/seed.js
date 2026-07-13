// Load .env from project root
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Warehouse = require('../models/Warehouse');
const Product = require('../models/Product');
const InventoryItem = require('../models/InventoryItem');

const seed = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env — cannot seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // ── Admin user ──────────────────────────────────────────────────────────
    await User.deleteMany({ email: 'admin@swms.com' });
    const admin = new User({
      name: 'Admin User',
      email: 'admin@swms.com',
      password: 'password123',
      role: 'admin',
    });
    await admin.save();
    console.log('👤 Admin created   → admin@swms.com / password123');

    // ── Warehouses ───────────────────────────────────────────────────────────
    await Warehouse.deleteMany({});
    const warehouses = await Warehouse.insertMany([
      { name: 'Main Warehouse',  location: 'New York, NY',    capacity: 10000, zones: 5, status: 'active' },
      { name: 'West Coast Hub',  location: 'Los Angeles, CA', capacity: 8000,  zones: 4, status: 'active' },
      { name: 'South Depot',     location: 'Houston, TX',     capacity: 6000,  zones: 3, status: 'active' },
    ]);
    console.log(`🏭 Warehouses      → ${warehouses.length} created`);

    // ── Products ─────────────────────────────────────────────────────────────
    await Product.deleteMany({});
    const products = await Product.insertMany([
      { sku: 'ELEC-001', name: 'Laptop Pro 15"',       category: 'Electronics',  price: 1299.99, minStock: 10 },
      { sku: 'ELEC-002', name: 'Wireless Mouse',        category: 'Electronics',  price: 29.99,   minStock: 20 },
      { sku: 'ELEC-003', name: '4K Monitor 27"',        category: 'Electronics',  price: 449.99,  minStock: 5  },
      { sku: 'FURN-001', name: 'Ergonomic Chair',       category: 'Furniture',    price: 299.99,  minStock: 8  },
      { sku: 'FURN-002', name: 'Standing Desk',         category: 'Furniture',    price: 599.99,  minStock: 5  },
      { sku: 'PACK-001', name: 'Bubble Wrap Roll',      category: 'Packaging',    price: 12.99,   minStock: 50 },
      { sku: 'PACK-002', name: 'Cardboard Boxes (20pk)',category: 'Packaging',    price: 24.99,   minStock: 30 },
      { sku: 'TOOL-001', name: 'Power Drill',           category: 'Tools',        price: 89.99,   minStock: 15 },
    ]);
    console.log(`📦 Products        → ${products.length} created`);

    // ── Inventory ────────────────────────────────────────────────────────────
    await InventoryItem.deleteMany({});
    const invItems = products.map((p, i) => ({
      productId: p._id,
      warehouseId: warehouses[i % warehouses.length]._id,
      quantity: Math.floor(Math.random() * 200) + 20,
      reserved: 0,
      location: `Zone-${String.fromCharCode(65 + (i % 5))}-${String(i + 1).padStart(2, '0')}`,
    }));
    await InventoryItem.insertMany(invItems);
    console.log(`📊 Inventory items → ${invItems.length} created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('───────────────────────────────');
    console.log('Login: admin@swms.com');
    console.log('Pass:  password123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
