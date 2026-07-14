// Load .env from the project root (one level above server/)
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
// Connect to MongoDB
connectDB();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/dashboard',     require('./routes/dashboard'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/inventory',     require('./routes/inventory'));
app.use('/api/warehouses',    require('./routes/warehouses'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/shipments',     require('./routes/shipments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/employees',     require('./routes/employees'));
app.use('/api/customers',     require('./routes/customers'));
app.use('/api/reports',       require('./routes/reports'));
app.use('/api/inbound', require('./routes/inboundRoutes'));
app.use("/api/profile", profileRoutes);
app.use('/api/iot', require('./routes/iotRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SWMS Server running on http://localhost:${PORT}`);
  console.log(`📡 API base: http://localhost:${PORT}/api`);
  console.log(`🗄️  MongoDB: ${process.env.MONGO_URI ? 'connecting…' : '⚠️  MONGO_URI not set in .env'}\n`);
});
