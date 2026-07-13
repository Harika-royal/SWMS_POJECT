const Order = require('../models/Order');
const Shipment = require('../models/Shipment');
const Product = require('../models/Product');
const InventoryItem = require('../models/InventoryItem');

/**
 * Sales chart: last 12 months revenue grouped by month
 */
const getSalesChart = async () => {
  const result = await Order.aggregate([
    { $match: { status: { $in: ['completed', 'Completed'] } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return result.map((r) => ({
    month: months[r._id.month - 1],
    revenue: Math.round(r.revenue || 0),
    orders: r.orders,
  }));
};

/**
 * Inventory by category
 */
const getInventoryChart = async () => {
  return Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { category: '$_id', count: 1, _id: 0 } },
    { $sort: { count: -1 } },
  ]);
};

/**
 * Shipments grouped by status
 */
const getShipmentChart = async () => {
  return Shipment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { status: '$_id', count: 1, _id: 0 } },
  ]);
};

module.exports = { getSalesChart, getInventoryChart, getShipmentChart };
