const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/auth');

/* ─────────────────────────────────────────────────────────────────────────
   GET /reviews?productId=xyz&sort=recent&rating=5
   Get reviews for a product (public, no auth required)
   ───────────────────────────────────────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const { productId, sort = 'recent', rating, limit = 10, skip = 0 } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    // Build filter
    const filter = {
      productId,
      status: 'approved',
    };

    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Determine sort order
    let sortObj = { createdAt: -1 }; // Default: recent
    if (sort === 'helpful') {
      sortObj = { helpful: -1, createdAt: -1 };
    } else if (sort === 'highRating') {
      sortObj = { rating: -1 };
    } else if (sort === 'lowRating') {
      sortObj = { rating: 1 };
    }

    const reviews = await Review.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-__v');

    // Get total count
    const totalReviews = await Review.countDocuments(filter);

    // Calculate stats
    const allReviews = await Review.find({ productId, status: 'approved' });
    const avgRating =
      allReviews.length > 0
        ? (
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          ).toFixed(1)
        : 0;

    const ratingDistribution = {
      5: allReviews.filter((r) => r.rating === 5).length,
      4: allReviews.filter((r) => r.rating === 4).length,
      3: allReviews.filter((r) => r.rating === 3).length,
      2: allReviews.filter((r) => r.rating === 2).length,
      1: allReviews.filter((r) => r.rating === 1).length,
    };

    return res.json({
      success: true,
      reviews,
      totalReviews,
      stats: {
        avgRating: parseFloat(avgRating),
        totalCount: allReviews.length,
        ratingDistribution,
      },
    });
  } catch (err) {
    console.error('Get reviews error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   POST /reviews
   Submit a new review (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, rating, title, comment, orderId } = req.body;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: productId, rating, title, comment',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
    }

    if (title.length < 5 || title.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Title must be between 5 and 100 characters',
      });
    }

    if (comment.length < 10 || comment.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Comment must be between 10 and 1000 characters',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: req.user.phone,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this product',
      });
    }

    // Check if verified purchase
    let verified = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        userId: req.user.phone,
        productId: productId,
        payment_status: 'paid',
      });
      verified = !!order;
    }

    // Create review
    const review = new Review({
      productId,
      userId: req.user.phone,
      userName: req.body.userName || 'Anonymous',
      userPhone: req.user.phone,
      rating: parseInt(rating),
      title,
      comment,
      verified,
      orderId: orderId || null,
      status: 'pending', // Reviews need approval
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be visible after approval.',
      review,
    });
  } catch (err) {
    console.error('Create review error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create review',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   PUT /reviews/:reviewId
   Update own review (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.put('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    // Check ownership
    if (review.userId !== req.user.phone) {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own reviews',
      });
    }

    // Update fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Rating must be between 1 and 5',
        });
      }
      review.rating = rating;
    }

    if (title !== undefined) {
      if (title.length < 5 || title.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Title must be between 5 and 100 characters',
        });
      }
      review.title = title;
    }

    if (comment !== undefined) {
      if (comment.length < 10 || comment.length > 1000) {
        return res.status(400).json({
          success: false,
          error: 'Comment must be between 10 and 1000 characters',
        });
      }
      review.comment = comment;
    }

    review.updatedAt = new Date();
    review.status = 'pending'; // Re-flag for approval

    await review.save();

    return res.json({
      success: true,
      message: 'Review updated successfully!',
      review,
    });
  } catch (err) {
    console.error('Update review error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update review',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   DELETE /reviews/:reviewId
   Delete own review (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    // Check ownership
    if (review.userId !== req.user.phone) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own reviews',
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    console.error('Delete review error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete review',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   POST /reviews/:reviewId/helpful
   Mark review as helpful (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.post('/:reviewId/helpful', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    return res.json({
      success: true,
      message: 'Marked as helpful',
      helpful: review.helpful,
    });
  } catch (err) {
    console.error('Mark helpful error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to mark as helpful',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   GET /reviews/user/my-reviews
   Get current user's reviews (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.get('/user/my-reviews', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.phone })
      .sort({ createdAt: -1 })
      .select('-__v');

    return res.json({
      success: true,
      reviews,
      totalReviews: reviews.length,
    });
  } catch (err) {
    console.error('Get user reviews error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch your reviews',
    });
  }
});

module.exports = router;
