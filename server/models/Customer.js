const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  company: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  totalSpent: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  lastOrder: Date
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
