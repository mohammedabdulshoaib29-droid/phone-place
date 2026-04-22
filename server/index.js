require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const path      = require('path');
const fs        = require('fs');
const orderRoutes    = require('./routes/orders');
const razorpayRoutes = require('./routes/razorpay');
const authRoutes     = require('./routes/auth');
const cartRoutes     = require('./routes/cart');
const returnsRoutes  = require('./routes/returns');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes   = require('./routes/reviews');
const adminRoutes    = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://phone-place.onrender.com',
  'https://phone-place-api.onrender.com',
  process.env.FRONTEND_URL, // set this on Render to your static site URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', orderRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', cartRoutes);
app.use('/api', returnsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', adminRoutes);
app.use('/api', analyticsRoutes);

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');
const hasFrontendBuild = () => fs.existsSync(indexPath);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

function serveFrontendOrFallback(res) {
  if (hasFrontendBuild()) {
    return res.sendFile(indexPath);
  }

  if (process.env.FRONTEND_URL) {
    return res.redirect(process.env.FRONTEND_URL);
  }

  return res.status(200).json({
    status: 'ok',
    message: 'Phone Palace API is running',
    health: '/health',
  });
}

// ── Root + Health check ──────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  return serveFrontendOrFallback(res);
});

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', message: 'Phone Palace API is running' })
);

app.get(/^\/(?!api(?:\/|$)|health$).*/, (_req, res) => {
  return serveFrontendOrFallback(res);
});

// ── MongoDB + Start ──────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`🚀  Phone Palace API running on http://localhost:${PORT}`)
);

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/phone-palace')
  .then(() => {
    console.log('✅  Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    console.error('⚠️  Server will continue running, but database-backed routes may fail until MONGODB_URI is fixed.');
  });
