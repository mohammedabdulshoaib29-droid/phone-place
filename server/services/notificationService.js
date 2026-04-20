const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Notification = require('../models/Notification');

// Setup Email Service
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Setup SMS Service (Twilio) - Only initialize if credentials are provided
let smsClient = null;
function getTwilioClient() {
  if (!smsClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    smsClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return smsClient;
}

// Email templates
const emailTemplates = {
  order_placed: (data) => ({
    subject: `Order Confirmed #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmed!</h2>
        <p>Thank you for your order, ${data.customerName}!</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${data.orderNumber}</p>
          <p><strong>Amount:</strong> ₹${data.totalAmount.toLocaleString('en-IN')}</p>
          <p><strong>Delivery Address:</strong> ${data.address}</p>
          <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
        </div>
        <p>You'll receive a confirmation SMS shortly with tracking details.</p>
        <p>Thank you for shopping with Phone Palace!</p>
      </div>
    `,
  }),
  order_shipped: (data) => ({
    subject: `Your Order is On the Way #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order is Shipped!</h2>
        <p>Good news, ${data.customerName}!</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipment Details</h3>
          <p><strong>Order ID:</strong> ${data.orderNumber}</p>
          <p><strong>Tracking ID:</strong> ${data.trackingId || 'Coming soon'}</p>
          <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
        </div>
        <p>Track your order at: <a href="${process.env.APP_URL}/track/${data.orderId}">View Tracking</a></p>
      </div>
    `,
  }),
  order_delivered: (data) => ({
    subject: `Order Delivered #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Delivered!</h2>
        <p>Your order has been delivered, ${data.customerName}!</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Delivery Confirmation</h3>
          <p><strong>Order ID:</strong> ${data.orderNumber}</p>
          <p><strong>Delivered on:</strong> ${data.deliveredDate}</p>
        </div>
        <p>Have any issues? <a href="${process.env.APP_URL}/returns">Request a return</a> within 30 days.</p>
      </div>
    `,
  }),
  return_requested: (data) => ({
    subject: `Return Request Received #${data.returnId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Return Request Received</h2>
        <p>Thank you for submitting your return request, ${data.customerName}!</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Return Details</h3>
          <p><strong>Request ID:</strong> ${data.returnId}</p>
          <p><strong>Order ID:</strong> ${data.orderNumber}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p><strong>Status:</strong> <span style="color: #ff9800;">Pending Review</span></p>
        </div>
        <p>We'll review your request and notify you within 24 hours.</p>
        <p>Track your return: <a href="${process.env.APP_URL}/returns">View Returns</a></p>
      </div>
    `,
  }),
  return_approved: (data) => ({
    subject: `Return Approved #${data.returnId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Return Approved!</h2>
        <p>Great news, ${data.customerName}! Your return has been approved.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Next Steps</h3>
          <ol>
            <li>Pack the item securely in its original packaging</li>
            <li>Contact our support for a prepaid shipping label</li>
            <li>Ship the item within 7 days</li>
            <li>Your refund will be processed within 5-7 days of receipt</li>
          </ol>
          <p><strong>Refund Amount:</strong> ₹${data.refundAmount.toLocaleString('en-IN')}</p>
        </div>
        <p>Questions? Contact us: <a href="https://wa.me/917997000166">WhatsApp Support</a></p>
      </div>
    `,
  }),
  return_refunded: (data) => ({
    subject: `Refund Processed #${data.returnId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Refund Processed!</h2>
        <p>Your refund has been processed, ${data.customerName}!</p>
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Refund Confirmation</h3>
          <p><strong>Refund ID:</strong> ${data.returnId}</p>
          <p><strong>Amount:</strong> ₹${data.refundAmount.toLocaleString('en-IN')}</p>
          <p><strong>Refund Date:</strong> ${data.refundDate}</p>
          <p><strong>Refund Method:</strong> Original payment method</p>
        </div>
        <p>The amount will reflect in your account within 3-5 business days.</p>
        <p>Thank you for your patience!</p>
      </div>
    `,
  }),
  payment_success: (data) => ({
    subject: `Payment Received ✓ Order #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>✓ Payment Received!</h2>
        <p>Thank you for your payment, ${data.customerName}!</p>
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Payment Confirmation</h3>
          <p><strong>Order ID:</strong> ${data.orderNumber}</p>
          <p><strong>Amount Paid:</strong> ₹${data.totalAmount.toLocaleString('en-IN')}</p>
          <p><strong>Payment Method:</strong> Online (Razorpay)</p>
          <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
          <p><strong>Paid on:</strong> ${data.paidDate}</p>
        </div>
        <p>Your order will be processed shortly. You'll receive a shipping confirmation within 24 hours.</p>
        <p>Track your order: <a href="${process.env.APP_URL}/track/${data.orderId}">View Order Status</a></p>
      </div>
    `,
  }),
  payment_failed: (data) => ({
    subject: `Payment Failed - Retry Required #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>⚠️ Payment Failed</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your payment for order #${data.orderNumber} failed. This could be due to:</p>
        <ul style="color: #666;">
          <li>Insufficient funds</li>
          <li>Incorrect card details</li>
          <li>Transaction limit exceeded</li>
          <li>Bank declined the transaction</li>
        </ul>
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p><strong>What to do next:</strong></p>
          <p><a href="${process.env.APP_URL}/checkout" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Retry Payment</a></p>
          <p>Or choose Cash on Delivery to complete your order.</p>
        </div>
        <p><strong>Error Details:</strong> ${data.errorMessage}</p>
        <p>Need help? <a href="https://wa.me/917997000166">Contact us on WhatsApp</a></p>
      </div>
    `,
  }),
};

// SMS templates
const smsTemplates = {
  order_placed: (data) =>
    `Hi ${data.customerName}, your order #${data.orderNumber} for ₹${data.totalAmount} is confirmed! Delivery in 5-7 days. Track: ${process.env.APP_URL}/track/${data.orderId}`,
  order_shipped: (data) =>
    `Your order #${data.orderNumber} is on the way! Tracking: ${data.trackingId || 'coming soon'}. ETA: ${data.estimatedDelivery}`,
  order_delivered: (data) =>
    `Your order #${data.orderNumber} has been delivered! Return it within 30 days if needed: ${process.env.APP_URL}/returns`,
  return_requested: (data) =>
    `Return request #${data.returnId} received for order #${data.orderNumber}. We'll review it within 24 hours.`,
  return_approved: (data) =>
    `Good news! Your return #${data.returnId} is approved. Refund: ₹${data.refundAmount}. Ship it back within 7 days.`,
  return_refunded: (data) =>
    `Refund of ₹${data.refundAmount} for order #${data.orderNumber} has been processed. You'll receive it in 3-5 days.`,
  payment_success: (data) =>
    `✓ Payment received! Order #${data.orderNumber} for ₹${data.totalAmount} confirmed. Txn: ${data.transactionId}. You'll receive shipping details soon.`,
  payment_failed: (data) =>
    `⚠ Payment failed for order #${data.orderNumber}. Retry: ${process.env.APP_URL}/checkout or use Cash on Delivery.`,
};

/**
 * Send notification via email
 */
const sendEmail = async (email, templateKey, data) => {
  try {
    if (!emailTransporter || !process.env.EMAIL_USER) {
      console.log('Email service not configured. Skipping email.');
      return { success: false, reason: 'Email service not configured' };
    }

    const template = emailTemplates[templateKey];
    if (!template) {
      throw new Error(`Email template not found: ${templateKey}`);
    }

    const { subject, html } = template(data);

    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });

    console.log(`Email sent: ${templateKey} to ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`Email send failed (${templateKey}):`, error);
    return { success: false, reason: error.message };
  }
};

/**
 * Send notification via SMS
 */
const sendSMS = async (phone, templateKey, data) => {
  try {
    const client = getTwilioClient();
    if (!client || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('SMS service not configured. Skipping SMS.');
      return { success: false, reason: 'SMS service not configured' };
    }

    const template = smsTemplates[templateKey];
    if (!template) {
      throw new Error(`SMS template not found: ${templateKey}`);
    }

    const message = template(data);

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`, // Assuming Indian phone numbers
    });

    console.log(`SMS sent: ${templateKey} to ${phone}`);
    return { success: true };
  } catch (error) {
    console.error(`SMS send failed (${templateKey}):`, error);
    return { success: false, reason: error.message };
  }
};

/**
 * Send notification (wrapper function)
 */
const sendNotification = async (userId, type, email, phone, data) => {
  try {
    // Send email
    const emailResult = await sendEmail(email, type, data);

    // Send SMS
    const smsResult = await sendSMS(phone, type, data);

    // Log notification record
    await Notification.create({
      userId,
      type,
      channel: emailResult.success ? 'email' : smsResult.success ? 'sms' : 'in-app',
      status: emailResult.success || smsResult.success ? 'sent' : 'failed',
      title: data.title || type.replace(/_/g, ' ').toUpperCase(),
      message: data.message || `Notification for ${type}`,
      metadata: data,
    });

    return {
      success: emailResult.success || smsResult.success,
      email: emailResult,
      sms: smsResult,
    };
  } catch (error) {
    console.error('Notification send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNotification,
  sendEmail,
  sendSMS,
};
