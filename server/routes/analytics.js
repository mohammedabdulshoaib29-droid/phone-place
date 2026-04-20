const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Review = require('../models/Review');
const Return = require('../models/Return');
const User = require('../models/User');

const ADMIN_PIN = 'phonePalace2025';

// Verify admin
const verifyAdmin = (req, res, next) => {
  const adminPin = req.headers['x-admin-pin'];
  if (adminPin === ADMIN_PIN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Helper: Get date range based on period
const getDateRange = (period) => {
  const end = new Date();
  const start = new Date();
  
  if (period === 'week') start.setDate(end.getDate() - 7);
  else if (period === 'month') start.setMonth(end.getMonth() - 1);
  else if (period === 'quarter') start.setMonth(end.getMonth() - 3);
  else if (period === 'year') start.setFullYear(end.getFullYear() - 1);
  
  return { start, end };
};

// GET - Summary metrics
router.get('/admin/analytics/summary', verifyAdmin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    // Total revenue from paid orders
    const revenuePipeline = [
      {
        $match: {
          payment_status: 'paid',
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total_price' },
          count: { $sum: 1 },
        },
      },
    ];

    const revenueData = await Order.aggregate(revenuePipeline);
    const revenue = revenueData[0]?.total || 0;
    const orderCount = revenueData[0]?.count || 0;

    // New customers (by user creation)
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    // Total unique customers
    const totalCustomers = await User.countDocuments();

    // Average order value
    const avgOrderValue = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    // Pending orders
    const pendingOrders = await Order.countDocuments({ payment_status: 'pending' });

    // Completed orders
    const completedOrders = await Order.countDocuments({
      payment_status: 'paid',
      order_status: 'delivered',
    });

    // Return rate
    const totalReturnsRequested = await Return.countDocuments();
    const returnRate = orderCount > 0 ? ((totalReturnsRequested / orderCount) * 100).toFixed(2) : 0;

    // Average review rating
    const ratingData = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const avgRating = ratingData[0]?.avg || 0;

    res.json({
      revenue,
      orderCount,
      newCustomers,
      totalCustomers,
      avgOrderValue,
      pendingOrders,
      completedOrders,
      returnRate: parseFloat(returnRate),
      avgRating: parseFloat(avgRating.toFixed(1)),
      period,
    });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

// GET - Revenue by date
router.get('/admin/analytics/revenue-by-date', verifyAdmin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    const pipeline = [
      {
        $match: {
          payment_status: 'paid',
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$total_price' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const data = await Order.aggregate(pipeline);

    // Fill missing dates with 0
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    const revenueByDate = dates.map((date) => {
      const found = data.find((d) => d._id === date);
      return {
        date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        revenue: found?.revenue || 0,
        orders: found?.orders || 0,
      };
    });

    res.json(revenueByDate);
  } catch (err) {
    console.error('Error fetching revenue by date:', err);
    res.status(500).json({ error: 'Failed to fetch revenue by date' });
  }
});

// GET - Top products
router.get('/admin/analytics/top-products', verifyAdmin, async (req, res) => {
  try {
    const { limit = 10, period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    const pipeline = [
      {
        $match: {
          payment_status: 'paid',
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$productId',
          name: { $first: '$product' },
          sales: { $sum: 1 },
          revenue: { $sum: '$total_price' },
          quantity: { $sum: '$quantity' },
        },
      },
      {
        $sort: { revenue: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ];

    const topProducts = await Order.aggregate(pipeline);

    res.json(topProducts);
  } catch (err) {
    console.error('Error fetching top products:', err);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// GET - Order status distribution
router.get('/admin/analytics/order-status', verifyAdmin, async (req, res) => {
  try {
    const pipeline = [
      {
        $match: { payment_status: 'paid' },
      },
      {
        $group: {
          _id: '$order_status',
          count: { $sum: 1 },
          revenue: { $sum: '$total_price' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    const statusDistribution = await Order.aggregate(pipeline);

    const result = {
      pending: 0,
      confirmed: 0,
      delivered: 0,
    };

    statusDistribution.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching order status:', err);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
});

// GET - Payment method breakdown
router.get('/admin/analytics/payment-methods', verifyAdmin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$payment_method',
          count: { $sum: 1 },
          revenue: { $sum: '$total_price' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    const paymentMethods = await Order.aggregate(pipeline);

    res.json(paymentMethods);
  } catch (err) {
    console.error('Error fetching payment methods:', err);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// GET - Customer metrics
router.get('/admin/analytics/customer-metrics', verifyAdmin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    // New customers
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    // Total customers
    const totalCustomers = await User.countDocuments();

    // Repeat customers (customers with multiple orders)
    const pipeline = [
      {
        $match: { payment_status: 'paid' },
      },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
        },
      },
      {
        $match: {
          orderCount: { $gte: 2 },
        },
      },
      {
        $count: 'total',
      },
    ];

    const repeatCustomerData = await Order.aggregate(pipeline);
    const repeatCustomers = repeatCustomerData[0]?.total || 0;

    // Repeat rate
    const totalCustomersWithOrders = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
        },
      },
      {
        $count: 'total',
      },
    ]);

    const customersWithOrders = totalCustomersWithOrders[0]?.total || 1;
    const repeatRate = ((repeatCustomers / customersWithOrders) * 100).toFixed(2);

    res.json({
      newCustomers,
      totalCustomers,
      repeatCustomers,
      repeatRate: parseFloat(repeatRate),
    });
  } catch (err) {
    console.error('Error fetching customer metrics:', err);
    res.status(500).json({ error: 'Failed to fetch customer metrics' });
  }
});

// GET - Review statistics
router.get('/admin/analytics/review-stats', verifyAdmin, async (req, res) => {
  try {
    // Rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Average rating
    const avgRatingData = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);

    // Total reviews
    const totalReviews = await Review.countDocuments({ status: 'approved' });
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    const rejectedReviews = await Review.countDocuments({ status: 'rejected' });

    // Top reviewed products
    const topReviewedProducts = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$productId', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      ratingDistribution: ratingDistribution.reduce(
        (acc, r) => ({ ...acc, [r._id]: r.count }),
        {}
      ),
      averageRating: parseFloat((avgRatingData[0]?.avg || 0).toFixed(2)),
      totalReviews,
      pendingReviews,
      rejectedReviews,
      topReviewedProducts,
    });
  } catch (err) {
    console.error('Error fetching review stats:', err);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
});

// GET - Returns and refunds
router.get('/admin/analytics/returns', verifyAdmin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    // Total returns in period
    const periodReturns = await Return.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    // Return reasons distribution
    const reasonDistribution = await Return.aggregate([
      {
        $group: {
          _id: '$reason',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Return status distribution
    const statusDistribution = await Return.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total refunded amount
    const refundedData = await Return.aggregate([
      {
        $match: { status: 'refunded' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$refundAmount' },
        },
      },
    ]);

    const totalRefunded = refundedData[0]?.total || 0;

    res.json({
      periodReturns,
      reasonDistribution,
      statusDistribution,
      totalRefunded,
    });
  } catch (err) {
    console.error('Error fetching returns data:', err);
    res.status(500).json({ error: 'Failed to fetch returns data' });
  }
});

// GET - Export data (CSV format)
router.get('/admin/analytics/export', verifyAdmin, async (req, res) => {
  try {
    const { type = 'orders', period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    let data;
    let filename;

    if (type === 'orders') {
      data = await Order.find({
        createdAt: { $gte: start, $lte: end },
      }).lean();
      filename = 'orders.json';
    } else if (type === 'reviews') {
      data = await Review.find({
        createdAt: { $gte: start, $lte: end },
      }).lean();
      filename = 'reviews.json';
    } else if (type === 'returns') {
      data = await Return.find({
        createdAt: { $gte: start, $lte: end },
      }).lean();
      filename = 'returns.json';
    }

    res.json({
      data,
      filename,
      exportedAt: new Date(),
      count: data.length,
    });
  } catch (err) {
    console.error('Error exporting data:', err);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

module.exports = router;
