const express  = require('express');
const router   = express.Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');

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
router.post('/verify', (req, res) => {
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
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
