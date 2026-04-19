const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

// POST /order — create new order
router.post('/order', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /orders — list all orders (admin, newest first)
router.get('/orders', async (req, res) => {
  try {
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
