require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const orderRoutes    = require('./routes/orders');
const razorpayRoutes = require('./routes/razorpay');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL, // set this on Render to your static site URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', orderRoutes);
app.use('/api/razorpay', razorpayRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', message: 'Phone Palace API is running' })
);

// ── MongoDB + Start ──────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/phone-palace')
  .then(() => {
    console.log('✅  Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀  Phone Palace API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
