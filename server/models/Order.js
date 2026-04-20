const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId:           { type: String, required: true },
  name:             { type: String, required: true, trim: true },
  phone:            { type: String, required: true, trim: true },
  address:          { type: String, required: true, trim: true },
  product:          { type: String, required: true },
  productId:        { type: String, required: true },
  quantity:         { type: Number, required: true, min: 1 },
  price:            { type: Number, required: true },
  total_price:      { type: Number, required: true },
  payment_method:   { type: String, enum: ['cod', 'online'], required: true },
  razorpay_order_id:{ type: String, default: null },
  razorpay_payment_id: { type: String, default: null },
  razorpay_signature: { type: String, default: null },
  payment_status:   { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  order_status:     { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  tracking_id:      { type: String, default: null },
  returnStatus:     { type: String, enum: ['none', 'requested', 'approved', 'rejected', 'processed'], default: 'none' },
  orderNumber:      { type: String, unique: true },
  createdAt:        { type: Date, default: Date.now },
  paidAt:           { type: Date, default: null },
  shippedAt:        { type: Date, default: null },
  deliveredAt:      { type: Date, default: null },
});

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
