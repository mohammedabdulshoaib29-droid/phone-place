# Phase 5B: Developer Quick Reference

## New Payment-Related Fields in Order Model

```javascript
// Payment Tracking Fields
total_price: Number                    // Total order amount
razorpay_order_id: String             // Razorpay order ID
razorpay_payment_id: String           // Razorpay payment transaction ID
razorpay_signature: String            // Payment signature for verification
payment_status: 'pending'|'paid'|'failed'|'refunded'
paidAt: Date                          // When payment was processed

// Shipping Tracking Fields
order_status: 'pending'|'confirmed'|'shipped'|'delivered'|'cancelled'
tracking_id: String                   // Shipment tracking ID
shippedAt: Date
deliveredAt: Date

// Auto-Generated Fields
orderNumber: String                   // Unique order ID (e.g., ORD-1234567890-ABC12)
```

## Notification Types Available

### payment_success
**When:** User completes payment successfully
**Data Required:**
```javascript
{
  email: "user@email.com",
  phone: "+91...",
  customerName: "John Doe",
  orderNumber: "ORD-...",
  totalAmount: 49999,
  transactionId: "pay_...",
  paidDate: "15/01/2024",
  orderId: ObjectId
}
```

### payment_failed
**When:** User's payment fails
**Data Required:**
```javascript
{
  email: "user@email.com",
  phone: "+91...",
  customerName: "John Doe",
  orderNumber: "ORD-...",
  errorMessage: "Card declined by bank"
}
```

## API Usage Examples

### Create Razorpay Order
```javascript
POST /razorpay/create-order
Content-Type: application/json

{
  "amount": 4999900  // Amount in paise (₹49,999)
}

Response:
{
  "id": "order_xyz123",
  "entity": "order",
  "amount": 4999900,
  "currency": "INR"
}
```

### Verify Payment & Store Details
```javascript
POST /razorpay/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "sig_hash_value"
}

Response:
{ "success": true }

// Automatically:
// - Validates signature
// - Stores payment details in Order
// - Sets payment_status to 'paid'
// - Sends payment_success notification
```

### Record Payment Failure
```javascript
POST /razorpay/payment-failure
Content-Type: application/json

{
  "razorpay_order_id": "order_xyz123",
  "error_description": "Card declined by bank"
}

Response:
{ "success": true, "message": "Payment failure recorded" }

// Automatically:
// - Updates payment_status to 'failed'
// - Sends payment_failed notification
```

### Check Payment Status
```javascript
GET /razorpay/payment-status/:orderId
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "paymentStatus": "paid",
  "paymentMethod": "online",
  "razorpayOrderId": "order_xyz123"
}
```

## Sending Notifications Manually

```javascript
const { sendNotification } = require('./services/notificationService');

// Send payment success
await sendNotification(userId, 'payment_success', {
  email: "user@example.com",
  phone: "+911234567890",
  customerName: "John Doe",
  orderNumber: "ORD-1234567890-ABC12",
  totalAmount: 49999,
  transactionId: "pay_xyz123",
  paidDate: new Date().toLocaleDateString('en-IN'),
  orderId: order._id
});

// Send payment failure
await sendNotification(userId, 'payment_failed', {
  email: "user@example.com",
  phone: "+911234567890",
  customerName: "John Doe",
  orderNumber: "ORD-1234567890-ABC12",
  errorMessage: "Insufficient funds"
});
```

## Frontend - CheckoutPage Integration

### Payment Handler
```typescript
const handleRazorpay = async () => {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Failed to load Razorpay');

  const { data } = await api.post('/razorpay/create-order', {
    amount: grandTotal * 100  // Convert to paise
  });

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: data.amount,
    currency: 'INR',
    name: 'Phone Palace',
    order_id: data.id,
    handler: async (response) => {
      // Verify payment
      await api.post('/razorpay/verify', response);
      // Create order with payment details
      await createOrder(response.razorpay_order_id);
      // Redirect to success
      navigate('/order-success');
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
```

### Error Handling
```typescript
rzp.on('payment.failed', (failureResponse: any) => {
  const errorMsg = failureResponse?.error?.description || 'Payment failed';
  setError(`❌ ${errorMsg}\n\nTry again or use Cash on Delivery.`);
  setLoading(false);
});
```

## Database Queries

### Find Order by Order Number
```javascript
const order = await Order.findOne({ orderNumber: 'ORD-1234567890-ABC12' });
```

### Find Orders by Payment Status
```javascript
// Paid orders
const paidOrders = await Order.find({ payment_status: 'paid' });

// Failed payments
const failedOrders = await Order.find({ payment_status: 'failed' });

// Pending payments (COD)
const pendingOrders = await Order.find({ 
  payment_status: 'pending',
  payment_method: 'cod'
});
```

### Get Orders by Status Timeline
```javascript
// Orders paid today
const today = new Date();
today.setHours(0, 0, 0, 0);

const paidToday = await Order.find({
  payment_status: 'paid',
  paidAt: { $gte: today }
});

// Orders shipped but not delivered
const inTransit = await Order.find({
  order_status: 'shipped',
  shippedAt: { $ne: null },
  deliveredAt: null
});
```

## Admin Operations

### Mark Order as Shipped
```javascript
const order = await Order.findById(orderId);
order.order_status = 'shipped';
order.shippedAt = new Date();
order.tracking_id = 'TRK123456789';  // Add tracking
await order.save();

// Send notification
await sendNotification(order.userId, 'order_shipped', {
  customerName: order.name,
  orderNumber: order.orderNumber,
  trackingId: order.tracking_id,
  estimatedDelivery: '18/01/2024'
});
```

### Process Refund
```javascript
const order = await Order.findById(orderId);
order.payment_status = 'refunded';
await order.save();

// Send refund notification
await sendNotification(order.userId, 'return_refunded', {
  customerName: order.name,
  returnId: returnRecord._id,
  refundAmount: order.total_price,
  refundDate: new Date().toLocaleDateString('en-IN')
});
```

## Debugging Tips

### Check Payment Logs
```bash
# View recent payment transactions
tail -f logs/payment.log

# Or query the Order collection
db.orders.find({ payment_status: { $in: ['paid', 'failed'] } }).sort({ paidAt: -1 }).limit(10)
```

### Verify Signature Manually
```javascript
const crypto = require('crypto');

const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
const expectedSign = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(sign)
  .digest('hex');

console.log('Expected:', expectedSign);
console.log('Received:', razorpay_signature);
console.log('Match:', expectedSign === razorpay_signature);
```

### Test Notifications
```javascript
const { sendNotification } = require('./services/notificationService');

// Send test payment success
await sendNotification('test-user-id', 'payment_success', {
  email: 'test@example.com',
  phone: '+911234567890',
  customerName: 'Test User',
  orderNumber: 'ORD-TEST-123',
  totalAmount: 10000,
  transactionId: 'pay_test_123',
  paidDate: new Date().toLocaleDateString('en-IN'),
  orderId: 'test-order-id'
});
```

## Environment Variables Checklist

```bash
# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx

# Email (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_SERVICE=gmail

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# App
APP_URL=https://phonepalace.com
```

## Performance Optimization Tips

1. **Add Indexes:**
   ```javascript
   // In Order model
   orderSchema.index({ razorpay_order_id: 1 });
   orderSchema.index({ orderNumber: 1 });
   orderSchema.index({ payment_status: 1 });
   orderSchema.index({ paidAt: -1 });
   ```

2. **Batch Notifications:**
   - Don't wait for notifications to complete
   - Send them asynchronously
   - Log failures for manual retry

3. **Cache Payment Status:**
   - Cache status checks for 30 seconds
   - Reduce database queries during peak traffic

## Common Gotchas

❌ **Don't:**
- Store Razorpay signature verification code inline
- Calculate amounts on frontend (always from backend)
- Skip signature verification for "performance"
- Modify razorpay_payment_id after it's stored

✅ **Do:**
- Always verify signatures before accepting payment
- Store amount in paise (× 100)
- Handle notification failures gracefully
- Log all payment transactions
- Use HTTPS for payment endpoints

