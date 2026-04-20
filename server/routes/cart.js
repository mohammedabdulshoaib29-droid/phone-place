const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/auth');

/* ─────────────────────────────────────────────────────────────────────────
   GET /cart
   Get user's cart (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.get('/cart', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.phone });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ userId: req.user.phone, items: [] });
      await cart.save();
    }

    return res.json({
      success: true,
      cart,
    });
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch cart.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   POST /cart/add
   Add product to cart (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.post('/cart/add', verifyToken, async (req, res) => {
  try {
    const { productId, productName, productCategory, price, quantity, variant, image } =
      req.body;

    // Validation
    if (!productId || !productName || !price || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: productId, productName, price, quantity.',
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1.',
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.phone });

    if (!cart) {
      cart = new Cart({ userId: req.user.phone, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId && 
               JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItem) {
      // Increase quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        productName,
        productCategory,
        price,
        quantity,
        variant,
        image,
      });
    }

    await cart.save();

    return res.json({
      success: true,
      message: 'Product added to cart.',
      cart,
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to add product to cart.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   PATCH /cart/item/:itemId
   Update cart item quantity (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.patch('/cart/item/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid item ID.',
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1.',
      });
    }

    const cart = await Cart.findOne({ userId: req.user.phone });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.',
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart.',
      });
    }

    item.quantity = quantity;
    await cart.save();

    return res.json({
      success: true,
      message: 'Item quantity updated.',
      cart,
    });
  } catch (err) {
    console.error('Update cart item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update cart item.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   DELETE /cart/item/:itemId
   Remove item from cart (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.delete('/cart/item/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid item ID.',
      });
    }

    const cart = await Cart.findOne({ userId: req.user.phone });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.',
      });
    }

    cart.items.id(itemId).deleteOne();
    await cart.save();

    return res.json({
      success: true,
      message: 'Item removed from cart.',
      cart,
    });
  } catch (err) {
    console.error('Delete cart item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   DELETE /cart/clear
   Clear entire cart (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.delete('/cart/clear', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.phone });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.',
      });
    }

    cart.items = [];
    await cart.save();

    return res.json({
      success: true,
      message: 'Cart cleared.',
      cart,
    });
  } catch (err) {
    console.error('Clear cart error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear cart.',
    });
  }
});

module.exports = router;
