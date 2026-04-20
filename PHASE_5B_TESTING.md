# Phase 5B Testing Checklist

## Pre-Deployment Verification

### Database & Schema
- [ ] MongoDB collections upgraded with new Order schema
- [ ] `orderNumber` index created for faster lookups
- [ ] `razorpay_order_id` index created for verification lookups
- [ ] `payment_status` enum includes all 4 values: ['pending', 'paid', 'failed', 'refunded']
- [ ] `order_status` enum includes 'shipped' value

### Environment Configuration
- [ ] `RAZORPAY_KEY_ID` is set in .env
- [ ] `RAZORPAY_KEY_SECRET` is set in .env
- [ ] `EMAIL_USER` and `EMAIL_PASSWORD` configured for notifications
- [ ] `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` configured
- [ ] `APP_URL` set correctly for redirect links in emails

### Backend Routes
- [ ] POST /razorpay/create-order working
- [ ] POST /razorpay/verify signature verification working
- [ ] POST /razorpay/payment-failure handling failures
- [ ] GET /razorpay/payment-status/:orderId requires authentication
- [ ] All routes return proper JSON responses

### Notification Service
- [ ] `payment_success` email template renders correctly
- [ ] `payment_success` SMS template is concise
- [ ] `payment_failed` email template shows retry options
- [ ] `payment_failed` SMS shows retry link
- [ ] Notification service gracefully handles failures

### Frontend Integration
- [ ] CheckoutPage shows payment method selection
- [ ] "Pay Online" button triggers Razorpay modal
- [ ] Razorpay script loads successfully
- [ ] Payment handler captures response correctly
- [ ] Error messages display clearly to users
- [ ] Loading states work during payment processing

## Manual Testing Scenarios

### Test 1: Successful Online Payment
**Steps:**
1. Add 2-3 products to cart
2. Go to checkout page
3. Fill all details (name, phone, address)
4. Select "Pay Online" button
5. Razorpay modal should open
6. Use test card: `4111111111111111`
7. Expiry: Any future date (e.g., 12/25)
8. CVV: Any 3 digits (e.g., 123)
9. Name: Any name (e.g., TEST USER)

**Verification:**
- [ ] Modal opens without errors
- [ ] Payment processes and completes
- [ ] Order created in MongoDB with:
  - [ ] `payment_status = 'paid'`
  - [ ] `razorpay_payment_id` stored
  - [ ] `razorpay_signature` stored
  - [ ] `orderNumber` auto-generated
  - [ ] `paidAt` timestamp set
- [ ] Redirect to /order-success page
- [ ] Payment success notification sent:
  - [ ] Email received with order details
  - [ ] SMS received with transaction ID
- [ ] Order visible in order history with `orderNumber`

**Expected Email Subject:** "✓ Payment Received Order #ORD-..."

### Test 2: Failed Online Payment
**Steps:**
1. Add products to cart
2. Go to checkout
3. Select "Pay Online"
4. Use test card: `4000000000000002` (fails)
5. Complete payment attempt

**Verification:**
- [ ] Payment fails with clear error message
- [ ] Error message shows reason (e.g., "Card declined")
- [ ] Option to retry payment appears
- [ ] Option to switch to COD appears
- [ ] Order record NOT created (or created with `payment_status = 'failed'`)
- [ ] Failure notification sent:
  - [ ] Email with retry link
  - [ ] SMS with COD option
- [ ] User can retry payment
- [ ] User can switch to COD without errors

### Test 3: Payment Signature Verification
**Steps:**
1. Attempt to manipulate signature in response
2. Send verify request with invalid signature

**Verification:**
- [ ] Request rejected with 400 status
- [ ] Error message: "Invalid payment signature"
- [ ] Order NOT updated in database
- [ ] No notification sent

### Test 4: COD Fallback
**Steps:**
1. Add products to cart
2. Go to checkout
3. Select "Pay Online"
4. Cancel Razorpay modal
5. Select "Cash on Delivery"
6. Complete order

**Verification:**
- [ ] COD option selectable after payment cancel
- [ ] Order created with:
  - [ ] `payment_method = 'cod'`
  - [ ] `payment_status = 'pending'`
- [ ] COD confirmation sent via WhatsApp
- [ ] No Razorpay payment fields in order

### Test 5: Order History - Payment Details
**Steps:**
1. Complete online payment (Test 1)
2. Go to Order History page

**Verification:**
- [ ] Order displays with `orderNumber`
- [ ] Payment method shown: "Online"
- [ ] Order status shown correctly
- [ ] Total price matches payment amount
- [ ] Can view order details with tracking info

### Test 6: Payment Status API
**Steps:**
1. After successful payment, query:
   ```
   GET /razorpay/payment-status/:orderId
   Authorization: Bearer <token>
   ```

**Verification:**
- [ ] Returns 200 status
- [ ] Response includes:
  - [ ] `paymentStatus: "paid"`
  - [ ] `paymentMethod: "online"`
  - [ ] `razorpayOrderId: "order_..."`
- [ ] Unauthenticated request returns 401

### Test 7: Multiple Orders - Payment Isolation
**Steps:**
1. Complete 3 online payments in sequence
2. Verify each has unique `orderNumber` and `razorpay_payment_id`

**Verification:**
- [ ] Each order has unique `orderNumber`
- [ ] Payment IDs don't overlap
- [ ] Notifications sent individually to each user
- [ ] Status queries return correct info per order

## Automated Testing

### Unit Tests
```javascript
// Test orderNumber generation
describe('Order Model', () => {
  it('should auto-generate orderNumber on save', async () => {
    const order = new Order({ ...orderData });
    await order.save();
    expect(order.orderNumber).toMatch(/^ORD-\d+-[A-Z0-9]{5}$/);
  });
});

// Test Razorpay verification
describe('Razorpay Routes', () => {
  it('should reject invalid signature', async () => {
    const res = await request(app)
      .post('/razorpay/verify')
      .send({
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_123',
        razorpay_signature: 'invalid'
      });
    expect(res.status).toBe(400);
  });
});
```

## Performance Testing

- [ ] Verify endpoint response time < 500ms
- [ ] Payment failure endpoint response time < 500ms
- [ ] Payment status query response time < 200ms
- [ ] Database query with `razorpay_order_id` index < 50ms

## Security Testing

- [ ] Signature verification cannot be bypassed
- [ ] Payment amount cannot be modified in response
- [ ] User cannot access other users' payment status
- [ ] No sensitive data exposed in error messages
- [ ] Rate limiting on /verify endpoint (consider adding)

## Deployment Checklist

- [ ] All code changes committed to git
- [ ] No console.logs left in production code
- [ ] Error handling complete for all paths
- [ ] No sensitive environment variables in code
- [ ] Razorpay test keys verified before going live
- [ ] Database backups created before deployment
- [ ] Notification service tested end-to-end
- [ ] Log rotation configured for payment logs

## Rollback Plan

If critical issues found:
1. Revert Order.js to previous schema version
2. Disable payment notifications in notificationService
3. Run database migration to remove new fields if needed
4. Keep only COD payment option active
5. Notify users about payment gateway maintenance

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Razorpay not configured" | ENV vars missing | Check .env file, restart server |
| Signature mismatch | Wrong secret key | Verify RAZORPAY_KEY_SECRET |
| Notification not sent | Email/SMS config issue | Check Nodemailer/Twilio credentials |
| orderNumber not generated | Model not saving | Check pre-save hook, try explicit save |
| Payment status stuck on pending | Verify endpoint not called | Check frontend handler in CheckoutPage |

