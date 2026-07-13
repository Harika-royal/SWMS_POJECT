const InventoryItem = require('../models/InventoryItem');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const { notifyLowStock } = require('../services/notificationService');

exports.getInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, warehouseId, sort = 'updatedAt', order = 'desc' } = req.query;
    const query = {};
    if (warehouseId) query.warehouseId = warehouseId;

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    let items = await InventoryItem.find(query)
      .populate('productId', 'name sku category price minStock')
      .populate('warehouseId', 'name location')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    if (search) {
      items = items.filter((i) => {
        const s = search.toLowerCase();
        return (
          i.productId?.name?.toLowerCase().includes(s) ||
          i.productId?.sku?.toLowerCase().includes(s) ||
          i.location?.toLowerCase().includes(s)
        );
      });
    }

    const total = await InventoryItem.countDocuments(query);

    res.json({ success: true, items, total, pages: Math.ceil(total / Number(limit)), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createInventoryItem = async (req, res) => {
  try {
    const existing = await InventoryItem.findOne({ productId: req.body.productId, warehouseId: req.body.warehouseId });
    if (existing) {
      existing.quantity += Number(req.body.quantity || 0);
      existing.location = req.body.location || existing.location;
      await existing.save();
      return res.json({ success: true, item: existing, message: 'Stock updated' });
    }
    const item = new InventoryItem(req.body);
    await item.save();
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('productId', 'name sku minStock')
      .populate('warehouseId', 'name');
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });

    // Low stock check
    const minStock = item.productId?.minStock || 10;
    if (item.quantity <= minStock) {
      await notifyLowStock(item.productId?.name || 'Unknown Product', item.quantity);
    }

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment, reason } = req.body; // adjustment can be +/- number
    const item = await InventoryItem.findById(id).populate('productId', 'name minStock');
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });

    item.quantity = Math.max(0, item.quantity + Number(adjustment));
    await item.save();

    if (item.quantity <= (item.productId?.minStock || 10)) {
      await notifyLowStock(item.productId?.name || 'Product', item.quantity);
    }

    res.json({ success: true, item, message: `Stock adjusted by ${adjustment > 0 ? '+' : ''}${adjustment}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inventory item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
