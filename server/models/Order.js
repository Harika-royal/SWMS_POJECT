const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name: String,
    email: String,
    company: String
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    qty: Number,
    price: Number
  }],
  total: Number,
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  payment: {
  status: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
  method: String
},

priority: {
  type: String,
  enum: ["Low", "Medium", "High"],
  default: "Medium",
},

carrier: {
  type: String,
  default: "TBD",
},

wave: {
  type: String,
  default: null,
},

picked: {
  type: Boolean,
  default: false,
},
  
}, { timestamps: true });

OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});
module.exports = mongoose.model('Order', OrderSchema);
