import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { products } from '../data/products';
import api from '../utils/api';
import { loadRazorpayScript } from '../utils/razorpay';
import TrustBadges from '../components/TrustBadges';
import type { PaymentMethod } from '../types/order';

const WHATSAPP_NUMBER = '917997000166';

/* ─── WhatsApp icon ──────────────────────────────────────────────────────── */
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const product = products.find((p) => p.id === id);

  const [name,          setName]          = useState(user?.name || '');
  const [phone,         setPhone]         = useState(user?.phone || '');
  const [address,       setAddress]       = useState('');
  const [quantity,      setQuantity]      = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  const total = product ? product.price * quantity : 0;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ── Validation ──────────────────────────────────────────────────────── */
  const validate = (): string | null => {
    if (!name.trim())    return 'Please enter your full name.';
    if (!phone.trim() || !/^\d{10}$/.test(phone.replace(/[\s-]/g, '')))
      return 'Please enter a valid 10-digit mobile number.';
    if (!address.trim()) return 'Please enter your delivery address.';
    return null;
  };

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  const openWhatsApp = (razorpayId?: string) => {
    const msg = encodeURIComponent(
      `New Order 🛒\n\n` +
      `Product: ${product?.name} (${product?.category})\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n` +
      `Qty: ${quantity} × ₹${product?.price}\n` +
      `Total: ₹${total.toLocaleString('en-IN')}\n` +
      `Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : `Online Paid (Ref: ${razorpayId || 'N/A'})`}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const submitOrder = (razorpay_order_id?: string) =>
    api.post('/order', {
      name,
      phone,
      address,
      product:           product?.name,
      productId:         product?.id,
      quantity,
      price:             product?.price,
      payment_method:    paymentMethod,
      razorpay_order_id: razorpay_order_id ?? null,
      payment_status:    razorpay_order_id ? 'paid' : 'pending',
      order_status:      'pending',
    });

  const goToSuccess = () =>
    navigate('/order-success', {
      state: { product, name, phone, address, quantity, total, paymentMethod },
    });

  /* ── COD flow ────────────────────────────────────────────────────────── */
  const handleCOD = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      await submitOrder();
      openWhatsApp();
      goToSuccess();
    } catch {
      setError('Failed to place order. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Razorpay flow ───────────────────────────────────────────────────── */
  const handleRazorpay = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay checkout. Please try again.');

      const { data } = await api.post('/razorpay/create-order', { amount: total * 100 });

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount:      data.amount,
        currency:    'INR',
        name:        'Phone Palace',
        description: product?.name,
        order_id:    data.id,
        prefill:     { name, contact: phone },
        theme:       { color: '#C9A84C' },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await api.post('/razorpay/verify', response);
            await submitOrder(response.razorpay_order_id);
            openWhatsApp(response.razorpay_order_id);
            goToSuccess();
          } catch {
            setError('Payment received but order failed. Please contact us on WhatsApp.');
            setLoading(false);
          }
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please retry or choose Cash on Delivery.');
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

  /* ── Not found ───────────────────────────────────────────────────────── */
  if (!product) {
    return (
      <main className="pt-40 pb-24 px-6 text-center min-h-screen flex flex-col items-center justify-center">
        <p className="font-body text-silver mb-8">Product not found.</p>
        <button onClick={() => navigate('/products')} className="btn-gold">
          View All Products
        </button>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <div className="max-w-2xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────────── */}
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

        {/* ── Product summary card ──────────────────────────────────────── */}
        <div className="glass-card p-6 mb-10 flex gap-5 items-center">
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-body text-gold text-xs uppercase tracking-widest"
              style={{ letterSpacing: '0.25em' }}
            >
              {product.category}
            </p>
            <h2
              className="font-display text-ivory text-lg mt-1 truncate"
              style={{ fontStyle: 'italic', fontWeight: 700 }}
            >
              {product.name}
            </h2>
            <p className="font-body text-gold text-sm font-semibold mt-1">
              ₹{product.price.toLocaleString('en-IN')} each
            </p>
          </div>
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors flex-shrink-0"
            style={{ letterSpacing: '0.15em' }}
          >
            Change
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mb-12">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest text-center mb-8"
            style={{ letterSpacing: '0.4em' }}
          >
            Shop with Confidence
          </p>
          <TrustBadges
            types={['ssl', 'secure', 'authentic', 'guarantee']}
            layout="grid"
          />
        </div>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Personal details */}
          <div className="space-y-8 mb-8">
            <p
              className="font-body text-silver text-xs uppercase tracking-widest"
              style={{ letterSpacing: '0.3em' }}
            >
              Your Details
            </p>

            <div>
              <label
                htmlFor="name"
                className="block font-body text-silver text-xs uppercase tracking-widest mb-3"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="input-luxury"
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block font-body text-silver text-xs uppercase tracking-widest mb-3"
              >
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
