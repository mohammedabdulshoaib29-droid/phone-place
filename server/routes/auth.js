const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateToken, verifyToken } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Helper: Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Generate referral code
const generateReferralCode = () => {
  return 'REF' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Email transporter (using Gmail or your email service)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'phonepalace.noreply@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password-here',
  },
});

// Helper: Send OTP email
const sendOTPEmail = async (email, phone, otp) => {
  try {
    if (!email) return true; // Skip if no email available
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'phonepalace.noreply@gmail.com',
      to: email,
      subject: '🔐 Your Phone Palace OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Your OTP for Phone Palace</h2>
          <p>Hi there!</p>
          <p>Your One-Time Password (OTP) for phone number <strong>${phone}</strong> is:</p>
          <h1 style="background: linear-gradient(135deg, #d4af37, #ffd700); color: #000; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 3px; font-size: 36px;">
            ${otp}
          </h1>
          <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong> only.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Phone Palace • Premium Mobile Accessories • Hyderabad</p>
        </div>
      `,
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Email sending error:', err.message);
    return false;
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   POST /auth/send-otp
   Send OTP to email
   ───────────────────────────────────────────────────────────────────────── */
router.post('/send-otp', async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Please enter a valid 10-digit number.',
      });
    }

    // Delete any existing OTPs for this phone
    await OTP.deleteMany({ phone });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create OTP record
    await OTP.create({
      phone,
      code: otp,
      expiresAt,
    });

    // Try to send email if provided
    if (email) {
      const emailSent = await sendOTPEmail(email, phone, otp);
      if (!emailSent) {
        console.warn(`Email not sent, but OTP saved: ${otp}`);
      }
    }

    // Log OTP for debugging
    console.log(`📱 OTP for ${phone}: ${otp}`);

    return res.json({
      success: true,
      message: email 
        ? `OTP sent to ${email}. Check your email (including spam folder).`
        : 'OTP generated. Check your email or contact support.',
      // Dev mode only:
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to send OTP. Please try again.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   POST /auth/verify-otp
   Verify OTP and create/login user
   ───────────────────────────────────────────────────────────────────────── */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number.',
      });
    }

    if (!code || code.toString().length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP format.',
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found. Please request a new OTP.',
      });
    }

    // Check if OTP expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        error: 'OTP expired. Please request a new one.',
      });
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    // Verify OTP code
    if (otpRecord.code !== code.toString()) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        error: `Invalid OTP. ${otpRecord.maxAttempts - otpRecord.attempts} attempts remaining.`,
      });
    }

    // OTP verified - find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      // New user - create with referral code
      const referralCode = generateReferralCode();
      user = new User({
        phone,
        referralCode,
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate token
    const token = generateToken(phone);

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        phone: user.phone,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify OTP. Please try again.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   GET /auth/me
   Get current user profile (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.user.phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   PUT /auth/profile
   Update user profile (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { email, name, preferences } = req.body;

    const user = await User.findOneAndUpdate(
      { phone: req.user.phone },
      {
        ...(email && { email }),
        ...(name && { name }),
        ...(preferences && { preferences }),
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   POST /auth/address
   Add new address (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.post('/address', verifyToken, async (req, res) => {
  try {
    const { label, street, city, state, postalCode, phone, isDefault } =
      req.body;

    const user = await User.findOne({ phone: req.user.phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    // If marking as default, unmark others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      street,
      city,
      state,
      postalCode,
      phone,
      isDefault: isDefault || user.addresses.length === 0, // First address is default
    });

    await user.save();

    return res.json({
      success: true,
      message: 'Address added successfully.',
      user,
    });
  } catch (err) {
    console.error('Add address error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to add address.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   DELETE /auth/address/:addressId
   Delete address (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.delete('/address/:addressId', verifyToken, async (req, res) => {
  try {
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address ID.',
      });
    }

    const user = await User.findOneAndUpdate(
      { phone: req.user.phone },
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    return res.json({
      success: true,
      message: 'Address deleted successfully.',
      user,
    });
  } catch (err) {
    console.error('Delete address error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete address.',
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   PUT /auth/address/:addressId
   Update address (requires auth)
   ───────────────────────────────────────────────────────────────────────── */
router.put('/address/:addressId', verifyToken, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, state, postalCode, phone, isDefault } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address ID.',
      });
    }

    const user = await User.findOne({ phone: req.user.phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found.',
      });
    }

    // Update address fields
    if (label) address.label = label;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (phone) address.phone = phone;

    // If marking as default, unmark others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
      address.isDefault = true;
    }

    await user.save();

    return res.json({
      success: true,
      message: 'Address updated successfully.',
      user,
    });
  } catch (err) {
    console.error('Update address error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update address.',
    });
  }
});

module.exports = router;
