const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { verifyToken } = require('../middleware/auth');

const ADMIN_PIN = 'phonePalace2025';

// Verify admin (pin-based for now)
const verifyAdmin = (req, res, next) => {
  const adminPin = req.headers['x-admin-pin'];
  if (adminPin === ADMIN_PIN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// GET - Review moderation queue (pending reviews)
router.get('/admin/reviews/queue', verifyAdmin, async (req, res) => {
  try {
    const { sort = 'newest', search = '' } = req.query;

    let query = { status: 'pending' };

    // Search by product ID, user name, or comment excerpt
    if (search) {
      query = {
        $and: [
          { status: 'pending' },
          {
            $or: [
              { productId: new RegExp(search, 'i') },
              { userName: new RegExp(search, 'i') },
              { title: new RegExp(search, 'i') },
              { comment: new RegExp(search, 'i') },
            ],
          },
        ],
      };
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'lowestRating') sortObj = { rating: 1, createdAt: -1 };
    if (sort === 'highestRating') sortObj = { rating: -1, createdAt: -1 };

    const reviews = await Review.find(query)
      .sort(sortObj)
      .limit(100)
      .lean();

    const totalPending = await Review.countDocuments({ status: 'pending' });

    res.json({
      reviews,
      totalPending,
      message: 'Review queue fetched successfully',
    });
  } catch (err) {
    console.error('Error fetching review queue:', err);
    res.status(500).json({ error: 'Failed to fetch review queue' });
  }
});

// GET - All reviews (with filters)
router.get('/admin/reviews/all', verifyAdmin, async (req, res) => {
  try {
    const { status, rating, productId, skip = 0, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (rating) query.rating = parseInt(rating);
    if (productId) query.productId = productId;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(query);

    const stats = {
      totalReviews: total,
      pending: await Review.countDocuments({ status: 'pending' }),
      approved: await Review.countDocuments({ status: 'approved' }),
      rejected: await Review.countDocuments({ status: 'rejected' }),
      averageRating: await Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
    };

    res.json({
      reviews,
      total,
      stats: stats.averageRating[0] || { avg: 0 },
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// PUT - Approve review
router.put('/admin/reviews/:reviewId/approve', verifyAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        status: 'approved',
        ...(reply && {
          reply: {
            text: reply,
            postedBy: 'admin',
            postedAt: new Date(),
          },
        }),
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Review approved successfully',
      review,
    });
  } catch (err) {
    console.error('Error approving review:', err);
    res.status(500).json({ error: 'Failed to approve review' });
  }
});

// PUT - Reject review
router.put('/admin/reviews/:reviewId/reject', verifyAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        status: 'rejected',
        rejectionReason: reason || 'Violates community guidelines',
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Review rejected successfully',
      review,
    });
  } catch (err) {
    console.error('Error rejecting review:', err);
    res.status(500).json({ error: 'Failed to reject review' });
  }
});

// PUT - Reply to review (as admin)
router.put('/admin/reviews/:reviewId/reply', verifyAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({ error: 'Reply cannot be empty' });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        reply: {
          text: reply,
          postedBy: 'admin',
          postedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Reply posted successfully',
      review,
    });
  } catch (err) {
    console.error('Error replying to review:', err);
    res.status(500).json({ error: 'Failed to post reply' });
  }
});

// DELETE - Delete review (admin removal)
router.delete('/admin/reviews/:reviewId', verifyAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Review deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// GET - Review statistics
router.get('/admin/reviews/stats', verifyAdmin, async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    const approvedReviews = await Review.countDocuments({ status: 'approved' });
    const rejectedReviews = await Review.countDocuments({ status: 'rejected' });

    const ratingDistribution = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const averageRating = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);

    const topProducts = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$productId', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      summary: {
        totalReviews,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        averageRating: averageRating[0]?.avg || 0,
      },
      ratingDistribution: ratingDistribution.reduce(
        (acc, r) => ({ ...acc, [r._id]: r.count }),
        {}
      ),
      topProducts,
      recentReviews,
    });
  } catch (err) {
    console.error('Error fetching review stats:', err);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
});

module.exports = router;
