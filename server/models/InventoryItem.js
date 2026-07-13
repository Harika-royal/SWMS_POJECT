const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
  location: String,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
