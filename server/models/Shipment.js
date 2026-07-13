const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  origin: String,
  destination: String,
  carrier: String,
  status: { type: String, enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  eta: Date,
  weight: Number
}, { timestamps: true });

ShipmentSchema.pre('save', async function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
