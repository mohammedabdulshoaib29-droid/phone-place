const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateToken, verifyToken } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const inMemoryOtps = new Map();

// Helper: Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Generate referral code
const generateReferralCode = () => {
  return 'REF' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

const getMemoryOtp = (phone) => {
  const otpRecord = inMemoryOtps.get(phone);
  if (!otpRecord) {
    return null;
  }

  if (new Date() > otpRecord.expiresAt) {
    inMemoryOtps.delete(phone);
    return null;
  }

  return otpRecord;
};

const clearOtpForPhone = async (phone) => {
  try {
    await OTP.deleteMany({ phone });
  } catch (err) {
    console.warn('OTP cleanup fallback:', err.message);
  }

  inMemoryOtps.delete(phone);
};

const createOtpRecord = async ({ phone, code, expiresAt }) => {
  try {
    await OTP.create({ phone, code, expiresAt });
    return { storage: 'database' };
  } catch (err) {
    console.warn('OTP storage fallback:', err.message);
    inMemoryOtps.set(phone, {
      phone,
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
    });
    return { storage: 'memory' };
  }
};

const findOtpRecord = async (phone) => {
  try {
    const otpRecord = await OTP.findOne({ phone });
    if (otpRecord) {
      return { otpRecord, storage: 'database' };
    }
  } catch (err) {
    console.warn('OTP lookup fallback:', err.message);
  }

  return { otpRecord: getMemoryOtp(phone), storage: 'memory' };
};

const updateOtpAttempts = async (otpRecord, storage) => {
  otpRecord.attempts = (otpRecord.attempts || 0) + 1;

  if (storage === 'database' && typeof otpRecord.save === 'function') {
    try {
      await otpRecord.save();
      return;
    } catch (err) {
      console.warn('OTP attempt update fallback:', err.message);
    }
  }

  inMemoryOtps.set(otpRecord.phone, {
    phone: otpRecord.phone,
    code: otpRecord.code,
    expiresAt: otpRecord.expiresAt,
    attempts: otpRecord.attempts,
    maxAttempts: otpRecord.maxAttempts || 5,
  });
};

const deleteOtpRecord = async (otpRecord, storage) => {
  if (!otpRecord) {
    return;
  }

  if (storage === 'database' && otpRecord._id) {
    try {
      await OTP.deleteOne({ _id: otpRecord._id });
    } catch (err) {
      console.warn('OTP delete fallback:', err.message);
    }
  }

  inMemoryOtps.delete(otpRecord.phone);
};

const emailConfigReady = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

// Email transporter (using Gmail or your email service)
const emailTransporter = emailConfigReady
  ? nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

if (emailTransporter) {
  console.log('Email service configured');
} else {
  console.warn('Email service not configured - OTP emails are disabled');
}

// Helper: Send OTP email
const sendOTPEmail = async (email, phone, otp) => {
  try {
    if (!email) {
      return { sent: false, reason: 'Email is required' };
    }

    if (!emailTransporter) {
      console.log(`OTP for ${phone}: ${otp}`);
      return { sent: false, reason: 'Email service is not configured' };
    }
    
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
    console.log(`OTP sent to ${email}`);
    return { sent: true, reason: 'Email sent' };
  } catch (err) {
    console.error('Email sending failed:', err.message);
    console.log(`Fallback OTP for ${phone}: ${otp}`);
    return { sent: false, reason: err.message };
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

    // Keep OTP generation working even if the OTP collection is temporarily unavailable.
    await clearOtpForPhone(phone);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create OTP record
    await createOtpRecord({
      phone,
      code: otp,
      expiresAt,
    });

    const emailResult = await sendOTPEmail(email, phone, otp);

    if (!emailResult.sent && process.env.NODE_ENV === 'production') {
      await clearOtpForPhone(phone);
      return res.status(503).json({
        success: false,
        error:
          emailResult.reason === 'Email service is not configured'
            ? 'OTP email service is not set up yet. Please contact support.'
            : 'We could not send the OTP email. Please try again in a moment.',
      });
    }

    return res.json({
      success: true,
      message: `OTP sent to ${email}. Please check your inbox and spam folder.`,
      emailSent: true,
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate OTP. Please try again.',
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
    const { otpRecord, storage } = await findOtpRecord(phone);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found. Please request a new OTP.',
      });
    }

    // Check if OTP expired
    if (new Date() > otpRecord.expiresAt) {
      await deleteOtpRecord(otpRecord, storage);
      return res.status(400).json({
        success: false,
        error: 'OTP expired. Please request a new one.',
      });
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await deleteOtpRecord(otpRecord, storage);
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    // Verify OTP code
    if (otpRecord.code !== code.toString()) {
      await updateOtpAttempts(otpRecord, storage);
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
    await deleteOtpRecord(otpRecord, storage);

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
