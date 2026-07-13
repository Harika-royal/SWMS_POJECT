const Warehouse = require('../models/Warehouse');
const InventoryItem = require('../models/InventoryItem');

exports.getWarehouses = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { $or: [
      { name: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ]} : {};

    const warehouses = await Warehouse.find(query).sort({ name: 1 });

    // Enrich with utilization
    const enriched = await Promise.all(warehouses.map(async (w) => {
      const items = await InventoryItem.find({ warehouseId: w._id });
      const usedCapacity = items.reduce((sum, i) => sum + i.quantity, 0);
      const utilization = w.capacity ? Math.min(100, Math.round((usedCapacity / w.capacity) * 100)) : 0;
      return { ...w.toObject(), usedCapacity, utilization };
    }));

    res.json({ success: true, warehouses: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWarehouse = async (req, res) => {
  try {
    const w = await Warehouse.findById(req.params.id);
    if (!w) return res.status(404).json({ success: false, message: 'Warehouse not found' });
    const items = await InventoryItem.find({ warehouseId: w._id }).populate('productId', 'name sku');
    const usedCapacity = items.reduce((sum, i) => sum + i.quantity, 0);
    const utilization = w.capacity ? Math.min(100, Math.round((usedCapacity / w.capacity) * 100)) : 0;
    res.json({ success: true, warehouse: { ...w.toObject(), usedCapacity, utilization }, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createWarehouse = async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    res.status(201).json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });
    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });
    res.json({ success: true, message: 'Warehouse deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
