import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { loadRazorpayScript } from '../utils/razorpay';
import type { PaymentMethod } from '../types/order';

const WHATSAPP_NUMBER = '917997000166';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const taxAmount = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + taxAmount;

  // Auto-populate user info
  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      setPhone(user.phone);
      setName(user.name || '');
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart && cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const validate = (): string | null => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/[\s-]/g, '')))
      return 'Please enter a valid 10-digit mobile number.';
    if (!address.trim()) return 'Please enter your delivery address.';
    if (cart?.items.length === 0) return 'Your cart is empty.';
    return null;
  };

  const createOrder = async (razorpay_order_id?: string) => {
    try {
      // Create individual orders for each product in cart
      const orderPromises = cart!.items.map((item) =>
        api.post(
          '/order',
          {
            name,
            phone,
            address,
            product: item.productName,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            payment_method: paymentMethod,
            razorpay_order_id: razorpay_order_id ?? null,
            payment_status: razorpay_order_id ? 'paid' : 'pending',
            order_status: 'pending',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      await Promise.all(orderPromises);
      return true;
    } catch (err) {
      throw err;
    }
  };

  const openWhatsApp = (razorpayId?: string) => {
    const itemsList = cart!.items
      .map((item) => `• ${item.productName} (${item.quantity}x ₹${item.price})`)
      .join('\n');

    const msg = encodeURIComponent(
      `New Order 🛒\n\n` +
      `Items:\n${itemsList}\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n\n` +
      `Subtotal: ₹${totalPrice.toLocaleString('en-IN')}\n` +
      `Tax (18%): ₹${taxAmount.toLocaleString('en-IN')}\n` +
      `Total: ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
      `Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : `Online Paid (Ref: ${razorpayId || 'N/A'})`}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const handleCOD = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await createOrder();
      openWhatsApp();
      await clearCart();
      navigate('/order-success', {
        state: { items: cart?.items, name, phone, address, total: grandTotal },
      });
    } catch (err: any) {
      setError('Failed to place order. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay checkout. Please try again.');

      const { data } = await api.post('/razorpay/create-order', {
        amount: grandTotal * 100,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: data.amount,
        currency: 'INR',
        name: 'Phone Palace',
        description: `${itemCount} items`,
        order_id: data.id,
        prefill: { name, contact: phone },
        theme: { color: '#C9A84C' },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment signature
            const verifyRes = await api.post('/razorpay/verify', response);
            if (!verifyRes.data.success) {
              throw new Error('Payment verification failed');
            }

            // Create orders with payment details
            await createOrder(response.razorpay_order_id);
            
            // Send confirmation via WhatsApp
            openWhatsApp(response.razorpay_order_id);
            
            // Clear cart and redirect
            await clearCart();
            navigate('/order-success', {
              state: { 
                items: cart?.items, 
                name, 
                phone, 
                address, 
                total: grandTotal,
                paymentMethod: 'online',
                razorpayOrderId: response.razorpay_order_id,
              },
            });
          } catch (err) {
            setError('Payment verification failed. Please contact our WhatsApp support for assistance.');
            console.error('Razorpay verification error:', err);
            setLoading(false);
          }
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', (failureResponse: any) => {
        const errorMsg = failureResponse?.error?.description || 'Payment failed. Please try again.';
        setError(`❌ ${errorMsg}\n\nYou can try again or choose Cash on Delivery.`);
        setLoading(false);
      });
      
      rzp.open();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cod') handleCOD();
    else handleRazorpay();
  };

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-3"
            style={{ letterSpacing: '0.4em' }}
          >
            Checkout
          </p>
          <h1
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 700 }}
          >
            Complete Your Order
          </h1>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items Summary */}
            <div className="glass-card p-6">
              <h2 className="text-gold font-semibold mb-4">Order Items ({itemCount})</h2>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center pb-3 border-b border-slate-700">
                    <div>
                      <p className="text-silver font-medium">{item.productName}</p>
                      {item.variant && (
                        <p className="text-emerald-400 text-xs">{item.variant.label}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-silver text-sm">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="text-gold font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="glass-card p-6">
              <h2 className="text-gold font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-slate-800 border border-r-0 border-emerald-500/30 rounded-l text-emerald-400 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(value);
                      }}
                      className="flex-1 px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-r text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, city, state, postal code"
                    className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-6">
              <h2 className="text-gold font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gold/30 rounded cursor-pointer hover:bg-gold/5 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4">
                    <p className="text-silver font-semibold">Cash on Delivery</p>
                    <p className="text-slate-400 text-sm">Pay when you receive the order</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gold/30 rounded cursor-pointer hover:bg-gold/5 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <div className="ml-4">
                    <p className="text-silver font-semibold">Online Payment</p>
                    <p className="text-slate-400 text-sm">Credit/Debit Card, UPI, etc.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24 space-y-6">
              <h2 className="text-gold font-semibold">Order Summary</h2>

              <div className="space-y-3 text-sm pb-4 border-b border-gold/20">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className="text-emerald-400">FREE</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Tax (18%)</span>
                  <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-ivory">Total</span>
                  <span className="text-gold">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-xs">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-carbon font-semibold py-3 px-6 rounded transition-all"
              >
                {loading
                  ? 'Processing...'
                  : paymentMethod === 'cod'
                  ? 'Place Order'
                  : 'Pay Now'}
              </button>

              {/* Trust badges */}
              <div className="space-y-2 text-xs text-slate-400 pt-4 border-t border-gold/20">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>100% Authentic Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span>30-Day Money Back</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
                placeholder="10-digit mobile number"
                className="input-luxury"
                autoComplete="tel"
                maxLength={10}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block font-body text-silver text-xs uppercase tracking-widest mb-3"
              >
                Delivery Address *
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Street, Area, City, PIN code"
                rows={3}
                className="w-full bg-transparent text-ivory font-body font-light text-sm resize-none outline-none"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 300,
                  color: '#F0EDE6',
                  borderBottom: '1px solid rgba(201, 168, 76, 0.4)',
                  padding: '0.6rem 0',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = '#C9A84C')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(201, 168, 76, 0.4)')}
                autoComplete="street-address"
              />
            </div>
          </div>

          <div className="gold-line mb-8" />

          {/* Quantity */}
          <div className="mb-8">
            <label className="block font-body text-silver text-xs uppercase tracking-widest mb-5">
              Quantity
            </label>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-carbon transition-all duration-300 flex items-center justify-center font-body text-xl leading-none"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span
                className="font-display text-ivory text-2xl w-8 text-center select-none"
                style={{ fontWeight: 700 }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-carbon transition-all duration-300 flex items-center justify-center font-body text-xl leading-none"
                aria-label="Increase quantity"
                disabled={quantity >= 10}
              >
                +
              </button>
              <span className="font-body text-silver text-xs ml-2">
                × ₹{product.price.toLocaleString('en-IN')} each
              </span>
            </div>
          </div>

          <div className="gold-line mb-8" />

          {/* Payment method */}
          <div className="mb-8">
            <p className="font-body text-silver text-xs uppercase tracking-widest mb-5">
              Payment Method
            </p>
            <div className="space-y-4">
              {([
                {
                  value: 'cod',
                  label: 'Cash on Delivery',
                  sub: 'Pay when your order arrives at your doorstep',
                },
                {
                  value: 'online',
                  label: 'Online Payment',
                  sub: 'Pay securely via Razorpay — UPI, Card, Net Banking',
                },
              ] as { value: PaymentMethod; label: string; sub: string }[]).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-all duration-300 ${
                    paymentMethod === opt.value
                      ? 'border-gold/60 bg-gold/5'
                      : 'border-gold/15 hover:border-gold/30'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-300 ${
                      paymentMethod === opt.value ? 'border-gold bg-gold' : 'border-silver/40'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="sr-only"
                    />
                    <p className="font-body text-ivory text-sm">{opt.label}</p>
                    <p className="font-body text-silver text-xs mt-1">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="glass-card p-6 mb-6 flex justify-between items-end">
            <div>
              <p
                className="font-body text-silver text-xs uppercase tracking-widest mb-2"
                style={{ letterSpacing: '0.25em' }}
              >
                Total Amount
              </p>
              <p
                className="font-display text-gold"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}
              >
                ₹{total.toLocaleString('en-IN')}
              </p>
              <p className="font-body text-silver text-xs mt-1">
                {quantity} × ₹{product.price.toLocaleString('en-IN')}
                {paymentMethod === 'cod' && ' · Pay on delivery'}
                {paymentMethod === 'online' && ' · Secure payment'}
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-body text-silver text-xs">Unit price</p>
              <p className="font-body text-ivory text-sm font-semibold mt-1">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p
              className="font-body text-red-400 text-sm text-center mb-4 px-4"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-3"
            style={{ padding: '1.1rem 2rem', opacity: loading ? 0.65 : 1 }}
          >
            {loading ? (
              <span>Processing…</span>
            ) : paymentMethod === 'cod' ? (
              <>
                <WhatsAppIcon />
                <span>Place Order &amp; Notify on WhatsApp</span>
              </>
            ) : (
              <span>Pay ₹{total.toLocaleString('en-IN')} via Razorpay</span>
            )}
          </button>

          <p className="font-body text-silver/40 text-xs text-center mt-4">
            WhatsApp will open to notify the shop owner after order confirmation.
          </p>
        </form>
      </div>
    </main>
  );
}
