const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  phone:            { type: String, required: true, trim: true },
  address:          { type: String, required: true, trim: true },
  product:          { type: String, required: true },
  productId:        { type: String, required: true },
  quantity:         { type: Number, required: true, min: 1 },
  price:            { type: Number, required: true },
  payment_method:   { type: String, enum: ['cod', 'online'], required: true },
  razorpay_order_id:{ type: String, default: null },
  payment_status:   { type: String, enum: ['pending', 'paid'], default: 'pending' },
  order_status:     { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
  timestamp:        { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
