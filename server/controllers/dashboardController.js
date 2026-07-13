const Product = require('../models/Product');
const Order = require('../models/Order');
const Shipment = require('../models/Shipment');
const InventoryItem = require('../models/InventoryItem');
const Warehouse = require('../models/Warehouse');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

exports.getDashboardStats = async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        stats: { totalProducts: 0, totalOrders: 0, pendingShipments: 0, inventoryValue: 0, lowStockCount: 0, totalRevenue: 0, totalWarehouses: 0 },
        recentOrders: [],
        inventoryChart: MONTHS.slice(0, 6).map((m) => ({ month: m, value: 0 })),
        ordersChart: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => ({ day: d, orders: 0 })),
        recentActivity: [{ text: 'Connect MongoDB to see live data', time: 'now' }],
      });
    }

    // --- Parallel counts ---
    const [
      totalProducts,
      totalOrders,
      pendingShipments,
      totalWarehouses,
      inventoryItems,
      recentOrders,
      recentNotifications,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Shipment.countDocuments({ status: { $in: ['Pending', 'In Transit'] } }),
      Warehouse.countDocuments(),
      InventoryItem.find().populate('productId', 'price minStock name'),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Notification.find().sort({ createdAt: -1 }).limit(10),
    ]);

    // --- Inventory value & low stock ---
    let inventoryValue = 0;
    let lowStockCount = 0;
    for (const item of inventoryItems) {
      inventoryValue += item.quantity * (item.productId?.price || 0);
      if (item.quantity <= (item.productId?.minStock || 10)) lowStockCount++;
    }

    // --- Total revenue (completed orders) ---
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['Completed', 'Delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // --- Orders chart: last 7 days ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, orders: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]);
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const ordersMap = {};
    dailyOrders.forEach((d) => { ordersMap[d._id] = d.orders; });
    const ordersChart = [1,2,3,4,5,6,7].map((dow) => ({
      day: dayNames[dow === 7 ? 0 : dow],
      orders: ordersMap[dow] || 0,
    }));

    // --- Inventory chart: last 12 months revenue ---
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo }, status: { $in: ['Completed', 'Delivered'] } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, value: { $sum: '$total' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    const inventoryChart = monthlyRevenue.map((r) => ({
      month: MONTHS[r._id.month - 1],
      value: Math.round(r.value || 0),
    }));
    if (inventoryChart.length === 0) {
      MONTHS.slice(0, 6).forEach((m) => inventoryChart.push({ month: m, value: 0 }));
    }

    // --- Recent activity from notifications ---
    const recentActivity = recentNotifications.map((n) => ({
      text: n.message,
      time: formatTimeAgo(n.createdAt),
      type: n.type,
    }));

    res.json({
      stats: { totalProducts, totalOrders, pendingShipments, inventoryValue: Math.round(inventoryValue), lowStockCount, totalRevenue: Math.round(totalRevenue), totalWarehouses },
      recentOrders,
      inventoryChart,
      ordersChart,
      recentActivity,
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

function formatTimeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}
