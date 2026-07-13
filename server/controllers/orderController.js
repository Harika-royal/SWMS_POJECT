const Order = require('../models/Order');
const InventoryItem = require('../models/InventoryItem');
const { notifyNewOrder } = require('../services/notificationService');

const buildQuery = (query) => {
  const q = {};
  if (query.status) q.status = query.status;
  if (query.search) {
    q.$or = [
      { orderNumber: { $regex: query.search, $options: 'i' } },
      { 'customer.name': { $regex: query.search, $options: 'i' } },
      { 'customer.company': { $regex: query.search, $options: 'i' } },
    ];
  }
  return q;
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const query = buildQuery(req.query);
    const skip = (page - 1) * limit;
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const [orders, total] = await Promise.all([
      Order.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({ success: true, orders, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customer, items = [], payment } = req.body;
    const total = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
    const order = new Order({ customer, items, total, payment });
    await order.save();
    // Fire notification
    await notifyNewOrder(order.orderNumber, customer?.name || customer?.company || 'Unknown');
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Order not found' });

    const wasCompleted = existing.status === 'Completed' || existing.status === 'completed';
    const isNowCompleted = req.body.status === 'Completed' || req.body.status === 'completed';

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // Auto-reduce inventory when order transitions to Completed
    if (!wasCompleted && isNowCompleted && order.items?.length) {
      for (const item of order.items) {
        if (item.productId) {
          await InventoryItem.findOneAndUpdate(
            { productId: item.productId },
            { $inc: { quantity: -item.qty } },
          );
        }
      }
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.pickOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
  req.params.id,
  {
    picked: true,
    status: "Processing",
  },
  {
    new: true,
    runValidators: true,
  }
);

if (!order) {
  return res.status(404).json({
    success: false,
    message: "Order not found",
  });
}

res.json({
  success: true,
  order,
});
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.bulkPick = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No orders selected",
      });
    }

    await Order.updateMany(
      { _id: { $in: ids } },
      {
        picked: true,
        status: "Processing",
      }
    );

    res.json({
      success: true,
      message: "Orders picked successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.createWave = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No orders selected",
      });
    }

    const wave = "WAVE-" + Date.now();

    await Order.updateMany(
      { _id: { $in: ids } },
      { wave }
    );

    res.json({
      success: true,
      wave,
      message: "Wave created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};