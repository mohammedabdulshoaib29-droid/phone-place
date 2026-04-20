const express = require('express');
const Return = require('../models/Return');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { sendNotification } = require('../services/notificationService');

const router = express.Router();

// Request a return for an order
router.post('/returns', verifyToken, async (req, res) => {
  try {
    const { orderId, productId, quantity, reason, description, images } = req.body;
    const userId = req.user.phone;

    // Validate request
    if (!orderId || !productId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: orderId, productId, reason, description',
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to request return for this order',
      });
    }

    // Check if order is eligible for return (within 30 days)
    const orderDate = new Date(order.createdAt);
    const daysDiff = Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24));

    if (daysDiff > 30) {
      return res.status(400).json({
        success: false,
        message: 'Order is not eligible for return (30-day window expired)',
      });
    }

    // Check if return already exists for this product in this order
    const existingReturn = await Return.findOne({
      orderId,
      productId,
      status: { $ne: 'rejected' },
    });

    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: 'A return request already exists for this product',
      });
    }

    // Create return record
    const newReturn = new Return({
      orderId,
      userId,
      productId,
      productName: order.product,
      quantity: quantity || 1,
      price: order.price,
      reason,
      description,
      images: images || [],
      status: 'requested',
    });

    await newReturn.save();

    // Send return request notification
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        await sendNotification(req.user.id, 'return_requested', user.email, user.phone, {
          returnId: newReturn._id,
          orderNumber: order.orderNumber,
          customerName: order.name,
          reason: reason,
          title: 'Return Request Received',
          message: 'Your return request has been submitted and is pending review',
        });
      }
    } catch (notifError) {
      console.error('Failed to send return notification:', notifError);
    }

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully',
      return: newReturn,
    });
  } catch (error) {
    console.error('Return request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit return request',
      error: error.message,
    });
  }
});

// Get all returns for authenticated user
router.get('/returns', verifyToken, async (req, res) => {
  try {
    const userId = req.user.phone;
    const { status, sort = '-requestedAt' } = req.query;

    const filter = { userId };
    if (status) {
      filter.status = status;
    }

    const returns = await Return.find(filter)
      .sort(sort)
      .populate('orderId', 'orderNumber payment_status order_status');

    res.json({
      success: true,
      count: returns.length,
      returns,
    });
  } catch (error) {
    console.error('Fetch returns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch returns',
      error: error.message,
    });
  }
});

// Get single return by ID
router.get('/returns/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.phone;
    const returnRecord = await Return.findById(req.params.id).populate(
      'orderId'
    );

    if (!returnRecord) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }

    // Verify user owns this return
    if (returnRecord.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.json({
      success: true,
      return: returnRecord,
    });
  } catch (error) {
    console.error('Fetch return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch return',
      error: error.message,
    });
  }
});

// Cancel return request (user can cancel before approval)
router.patch('/returns/:id/cancel', verifyToken, async (req, res) => {
  try {
    const userId = req.user.phone;
    const returnRecord = await Return.findById(req.params.id);

    if (!returnRecord) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }

    if (returnRecord.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Can only cancel if still requested
    if (returnRecord.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel return with status: ${returnRecord.status}`,
      });
    }

    returnRecord.status = 'rejected';
    returnRecord.rejectedAt = new Date();
    returnRecord.adminNotes = 'Cancelled by user';
    await returnRecord.save();

    res.json({
      success: true,
      message: 'Return request cancelled',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Cancel return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel return',
      error: error.message,
    });
  }
});

// ─── ADMIN ONLY ENDPOINTS ───────────────────────────────────────────────

// Get all return requests (admin)
router.get('/admin/returns', verifyToken, async (req, res) => {
  try {
    // In production, verify admin role here
    // if (!req.user.isAdmin) return res.status(403).json({ success: false, message: 'Admin only' });

    const { status, sort = '-requestedAt' } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const returns = await Return.find(filter)
      .sort(sort)
      .populate('orderId', 'orderNumber userId');

    res.json({
      success: true,
      count: returns.length,
      returns,
    });
  } catch (error) {
    console.error('Admin fetch returns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch returns',
      error: error.message,
    });
  }
});

// Approve return request (admin)
router.patch('/admin/returns/:id/approve', verifyToken, async (req, res) => {
  try {
    // In production, verify admin role here
    const { adminNotes, refundAmount, refundMethod, returnTrackingId } = req.body;

    const returnRecord = await Return.findById(req.params.id);
    if (!returnRecord) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }

    returnRecord.status = 'approved';
    returnRecord.approvedAt = new Date();
    returnRecord.adminNotes = adminNotes || '';
    returnRecord.refundAmount = refundAmount || returnRecord.price;
    returnRecord.refundMethod = refundMethod || 'original-payment';
    returnRecord.returnTrackingId = returnTrackingId || null;

    await returnRecord.save();

    // Send return approved notification
    try {
      const user = await User.findById(returnRecord.userId);
      if (user) {
        const order = await Order.findById(returnRecord.orderId);
        await sendNotification(returnRecord.userId, 'return_approved', user.email, user.phone, {
          returnId: returnRecord._id,
          orderNumber: order?.orderNumber || 'N/A',
          customerName: user.name,
          refundAmount: returnRecord.refundAmount,
          title: 'Return Approved',
          message: 'Your return has been approved. Please ship it back within 7 days.',
        });
      }
    } catch (notifError) {
      console.error('Failed to send approval notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Return approved',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Approve return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve return',
      error: error.message,
    });
  }
});

// Reject return request (admin)
router.patch('/admin/returns/:id/reject', verifyToken, async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const returnRecord = await Return.findById(req.params.id);
    if (!returnRecord) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }

    returnRecord.status = 'rejected';
    returnRecord.rejectedAt = new Date();
    returnRecord.adminNotes = adminNotes || 'Rejected by admin';

    await returnRecord.save();

    // Send return rejected notification
    try {
      const user = await User.findById(returnRecord.userId);
      if (user) {
        await sendNotification(returnRecord.userId, 'return_rejected', user.email, user.phone, {
          returnId: returnRecord._id,
          customerName: user.name,
          reason: adminNotes || 'Return request does not meet our return policy criteria',
          title: 'Return Request Declined',
          message: 'Unfortunately, your return request could not be approved.',
        });
      }
    } catch (notifError) {
      console.error('Failed to send rejection notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Return rejected',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Reject return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject return',
      error: error.message,
    });
  }
});

// Mark return as received (admin)
router.patch('/admin/returns/:id/received', verifyToken, async (req, res) => {
  try {
    const returnRecord = await Return.findById(req.params.id);
    if (!returnRecord) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }

    if (returnRecord.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Return must be approved before marking as received',
      });
    }

    returnRecord.status = 'received';
    returnRecord.receivedAt = new Date();
    await returnRecord.save();

    res.json({
      success: true,
      message: 'Return marked as received',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Received return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update return',
      error: error.message,
    });
  }
});

// Process refund (admin)
router.patch('/admin/returns/:id/refund', verifyToken, async (req, res) => {
  try {
    const returnRecord = await Return.findById(req.params.id);
    if (!returnRecord) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }

    if (returnRecord.status !== 'received') {
      return res.status(400).json({
        success: false,
        message: 'Return must be marked as received before refunding',
      });
    }

    returnRecord.status = 'refunded';
    returnRecord.refundedAt = new Date();
    await returnRecord.save();

    // Send refund processed notification
    try {
      const user = await User.findById(returnRecord.userId);
      if (user) {
        const order = await Order.findById(returnRecord.orderId);
        await sendNotification(returnRecord.userId, 'return_refunded', user.email, user.phone, {
          returnId: returnRecord._id,
          orderNumber: order?.orderNumber || 'N/A',
          customerName: user.name,
          refundAmount: returnRecord.refundAmount,
          refundDate: new Date().toLocaleDateString('en-IN'),
          title: 'Refund Processed',
          message: `Your refund of ₹${returnRecord.refundAmount} has been processed.`,
        });
      }
    } catch (notifError) {
      console.error('Failed to send refund notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Refund return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message,
    });
  }
});

module.exports = router;
