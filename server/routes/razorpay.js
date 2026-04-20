const express  = require('express');
const router   = express.Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');
const Order    = require('../models/Order');
const User     = require('../models/User');
const { sendNotification } = require('../services/notificationService');
const { verifyToken } = require('../middleware/auth');

function getRazorpayClient() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

// POST /razorpay/create-order
router.post('/create-order', async (req, res) => {
  try {
    const razorpay = getRazorpayClient();

    if (!razorpay) {
      return res.status(503).json({
        error: 'Razorpay is not configured on the server',
      });
    }

    const { amount } = req.body; // amount in paise
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt:  `pp_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /razorpay/verify — verify payment signature
router.post('/verify', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        error: 'Razorpay is not configured on the server',
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    // Find and update order with payment details
    const order = await Order.findOne({ razorpay_order_id });
    if (order) {
      order.razorpay_payment_id = razorpay_payment_id;
      order.razorpay_signature = razorpay_signature;
      order.payment_status = 'paid';
      order.paidAt = new Date();
      await order.save();

      // Send payment success notification
      try {
        const user = await User.findById(order.userId);
        if (user && user.email) {
          await sendNotification(order.userId, 'payment_success', {
            email: user.email,
            phone: order.phone,
            customerName: order.name,
            orderNumber: order.orderNumber,
            totalAmount: order.total_price,
            transactionId: razorpay_payment_id,
            paidDate: new Date().toLocaleDateString('en-IN'),
            orderId: order._id,
          });
        }
      } catch (notifErr) {
        console.error('Notification sending failed:', notifErr);
        // Don't fail the payment just because notification failed
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /razorpay/payment-failure — handle payment failures
router.post('/payment-failure', async (req, res) => {
  try {
    const { razorpay_order_id, error_description } = req.body;

    // Find and update order status
    const order = await Order.findOne({ razorpay_order_id });
    if (order) {
      order.payment_status = 'failed';
      await order.save();

      // Send payment failure notification
      try {
        const user = await User.findById(order.userId);
        if (user && user.email) {
          await sendNotification(order.userId, 'payment_failed', {
            email: user.email,
            phone: order.phone,
            customerName: order.name,
            orderNumber: order.orderNumber,
            errorMessage: error_description || 'Payment could not be processed',
          });
        }
      } catch (notifErr) {
        console.error('Failure notification sending failed:', notifErr);
      }
    }

    res.json({ success: true, message: 'Payment failure recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /razorpay/payment-status/:orderId — check payment status
router.get('/payment-status/:orderId', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      razorpayOrderId: order.razorpay_order_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
