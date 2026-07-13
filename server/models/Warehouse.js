const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  usedCapacity: { type: Number, default: 0 },
  zones: [String],
  status: { type: String, enum: ['Active', 'Full', 'Maintenance'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', WarehouseSchema);
