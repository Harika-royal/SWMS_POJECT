const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: String,
  department: String,
  shift: String,
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  lastActive: Date,
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
