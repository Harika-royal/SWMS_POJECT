const { getSalesChart, getInventoryChart, getShipmentChart } = require('../services/reportService');
const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryItem = require('../models/InventoryItem');
const Shipment = require('../models/Shipment');
const Warehouse = require('../models/Warehouse');

exports.getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = { status: { $in: ['Completed', 'Delivered'] } };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const [chart, summary] = await Promise.all([
      getSalesChart(),
      Order.aggregate([
        { $match: match },
        { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalOrders: { $sum: 1 }, avgOrderValue: { $avg: '$total' } } },
      ]),
    ]);

    res.json({
      success: true,
      chart,
      summary: summary[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInventoryReport = async (req, res) => {
  try {
    const [chart, lowStockItems] = await Promise.all([
      getInventoryChart(),
      InventoryItem.find().populate('productId', 'name sku minStock').then((items) =>
        items.filter((i) => i.quantity <= (i.productId?.minStock || 10))
      ),
    ]);

    const totalProducts = await Product.countDocuments();
    const totalInventory = await InventoryItem.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]);

    res.json({
      success: true,
      chart,
      summary: {
        totalProducts,
        totalInventory: totalInventory[0]?.total || 0,
        lowStockCount: lowStockItems.length,
      },
      lowStockItems,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getShipmentReport = async (req, res) => {
  try {
    const [chart, recent] = await Promise.all([
      getShipmentChart(),
      Shipment.find().sort({ createdAt: -1 }).limit(20),
    ]);

    res.json({ success: true, chart, recent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWarehouseReport = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ name: 1 });
    const enriched = await Promise.all(warehouses.map(async (w) => {
      const items = await InventoryItem.find({ warehouseId: w._id });
      const usedCapacity = items.reduce((s, i) => s + i.quantity, 0);
      const utilization = w.capacity ? Math.min(100, Math.round((usedCapacity / w.capacity) * 100)) : 0;
      return { ...w.toObject(), usedCapacity, utilization, itemCount: items.length };
    }));

    res.json({ success: true, warehouses: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
