const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { getSupportReply } = require('../services/aiSupportService');

const router = express.Router();

function validateMessage(req, res, next) {
  const message = req.body?.message;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: 'A support message is required.',
    });
  }

  next();
}

router.post('/support', validateMessage, async (req, res) => {
  try {
    console.info('AI support request', {
      scope: 'guest',
      page: req.body?.context?.page || 'general',
    });

    const result = await getSupportReply({
      message: req.body.message.trim(),
      context: req.body.context || {},
      userPhone: null,
    });

    return res.json({
      success: true,
      reply: result.reply,
      intent: result.intent,
      usedModel: result.usedModel,
    });
  } catch (error) {
    console.error('AI support error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate support reply.',
    });
  }
});

router.post('/support/account', verifyToken, validateMessage, async (req, res) => {
  try {
    console.info('AI support request', {
      scope: 'account',
      phone: req.user.phone,
      page: req.body?.context?.page || 'general',
    });

    const result = await getSupportReply({
      message: req.body.message.trim(),
      context: req.body.context || {},
      userPhone: req.user.phone,
    });

    return res.json({
      success: true,
      reply: result.reply,
      intent: result.intent,
      usedModel: result.usedModel,
    });
  } catch (error) {
    console.error('AI account support error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate account support reply.',
    });
  }
});

module.exports = router;
