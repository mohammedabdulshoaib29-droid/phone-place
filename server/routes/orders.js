const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();
const Order    = require('../models/Order');
const User     = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { sendNotification } = require('../services/notificationService');

const fallbackOrders = [];

// POST /order — create new order (requires auth)
router.post('/order', verifyToken, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.user.phone, // Automatically set userId from token
    });
    const validationError = order.validateSync();

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError.message,
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const fallbackOrder = {
        ...order.toObject(),
        _id: `offline-${Date.now()}`,
      };

      fallbackOrders.unshift(fallbackOrder);

      return res.status(202).json({
        success: true,
        persisted: false,
        order: fallbackOrder,
        warning: 'Database is unavailable, but the order was accepted in fallback mode.',
      });
    }

    await order.save();

    // Send order confirmation notification
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        await sendNotification(req.user.id, 'order_placed', user.email, user.phone, {
          orderNumber: order.orderNumber,
          totalAmount: order.total_price,
          customerName: order.name,
          address: order.address,
          orderId: order._id,
          title: 'Order Confirmed',
          message: `Your order #${order.orderNumber} has been placed successfully`,
        });
      }
    } catch (notifError) {
      console.error('Failed to send order notification:', notifError);
    }

    res.status(201).json({ success: true, persisted: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /user/orders — get user's orders (requires auth)
router.get('/user/orders', verifyToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const userOrders = fallbackOrders.filter(
        (order) => order.userId === req.user.phone
      );
      return res.json(userOrders);
    }

    const orders = await Order.find({ userId: req.user.phone }).sort({
      timestamp: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders — list all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(fallbackOrders);
    }

    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /orders/:id/status — update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { order_status } = req.body;
    const valid = ['pending', 'confirmed', 'shipped', 'delivered'];
    if (!valid.includes(order_status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (mongoose.connection.readyState !== 1) {
      const index = fallbackOrders.findIndex((order) => order._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }

      fallbackOrders[index] = {
        ...fallbackOrders[index],
        order_status,
      };

      return res.json({ success: true, order: fallbackOrders[index] });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Send status update notification
    try {
      const user = await User.findById(order.userId);
      if (user) {
        let notificationType = 'order_placed';
        let trackingData = {
          orderNumber: order.orderNumber,
          totalAmount: order.total_price,
          customerName: order.name,
          orderId: order._id,
        };

        if (order_status === 'shipped') {
          notificationType = 'order_shipped';
          trackingData.estimatedDelivery = '5-7 business days';
          trackingData.trackingId = order.tracking_id;
        } else if (order_status === 'delivered') {
          notificationType = 'order_delivered';
          trackingData.deliveredDate = new Date().toLocaleDateString('en-IN');
        }

        await sendNotification(user._id, notificationType, user.email, user.phone, trackingData);
      }
    } catch (notifError) {
      console.error('Failed to send status notification:', notifError);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
