const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['order_placed', 'order_shipped', 'order_delivered', 'return_requested', 'return_approved', 'return_rejected', 'return_refunded'],
    required: true,
  },
  title: String,
  message: String,
  orderId: mongoose.Schema.Types.ObjectId,
  returnId: mongoose.Schema.Types.ObjectId,
  channel: {
    type: String,
    enum: ['email', 'sms', 'in-app'],
    default: 'in-app',
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sentAt: Date,
  failureReason: String,
});

module.exports = mongoose.model('Notification', NotificationSchema);
