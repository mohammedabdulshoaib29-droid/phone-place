const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema(
  {
    // Links
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    userId: {
      type: String, // phone number
      required: true,
      index: true,
    },

    // Product info
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },

    // Return request details
    reason: {
      type: String,
      enum: [
        'damaged',
        'defective',
        'wrong-item',
        'not-as-described',
        'changed-mind',
        'expired',
        'other',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // URL
        required: false,
      },
    ],

    // Status tracking
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'received', 'refunded'],
      default: 'requested',
      index: true,
    },

    // Admin notes
    adminNotes: {
      type: String,
      default: '',
    },

    // Refund details
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundMethod: {
      type: String,
      enum: ['original-payment', 'wallet', 'bank-transfer', 'none'],
      default: 'original-payment',
    },
    refundDate: {
      type: Date,
      default: null,
    },

    // Dates
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    receivedAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },

    // Return shipping
    returnTrackingId: {
      type: String,
      default: null,
    },
    returnShippingLabel: {
      type: String, // URL to label
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
returnSchema.index({ userId: 1, status: 1 });
returnSchema.index({ orderId: 1 });
returnSchema.index({ requestedAt: -1 });

module.exports = mongoose.model('Return', returnSchema);
