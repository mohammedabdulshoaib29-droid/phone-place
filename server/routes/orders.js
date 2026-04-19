const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();
const Order    = require('../models/Order');

const fallbackOrders = [];

// POST /order — create new order
router.post('/order', async (req, res) => {
  try {
    const order = new Order(req.body);
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
    res.status(201).json({ success: true, persisted: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /orders — list all orders (admin, newest first)
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
    const valid = ['pending', 'confirmed', 'delivered'];
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
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
