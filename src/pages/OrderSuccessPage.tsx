import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { Product } from '../data/products';
import type { PaymentMethod } from '../types/order';

interface SuccessState {
  product: Product;
  name: string;
  phone: string;
  address: string;
  quantity: number;
  total: number;
  paymentMethod: PaymentMethod;
}

const WHATSAPP_NUMBER = '917997000166';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const state     = location.state as SuccessState | null;

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
    window.scrollTo(0, 0);
  }, [state, navigate]);

  if (!state) return null;

  const { product, name, phone, address, quantity, total, paymentMethod } = state;

  const waMessage = encodeURIComponent(
    `Hello Phone Palace! Just placed an order.\n\n` +
    `Product: ${product.name}\nName: ${name}\nPhone: ${phone}\n` +
    `Total: ₹${total.toLocaleString('en-IN')}\n` +
    `Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Paid)'}`
  );

  const summaryRows: [string, string | number][] = [
    ['Product',  product.name],
    ['Quantity', `${quantity} unit${quantity > 1 ? 's' : ''}`],
    ['Total',    `₹${total.toLocaleString('en-IN')}`],
    ['Payment',  paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Paid)'],
    ['Delivery', address],
  ];

  return (
    <main className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
      <div className="glass-card max-w-lg w-full px-8 py-12 md:px-12 md:py-16 text-center animate-scale-in">

        {/* Gold checkmark */}
        <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Heading */}
        <p
          className="font-body text-gold text-xs uppercase tracking-widest mb-3"
          style={{ letterSpacing: '0.4em' }}
        >
          Order Confirmed
        </p>
        <h1
          className="font-display text-ivory text-3xl md:text-4xl mb-4"
          style={{ fontStyle: 'italic', fontWeight: 700 }}
        >
          Thank You, {name.split(' ')[0]}!
        </h1>

        <div className="gold-line my-6 mx-auto" style={{ width: '80px' }} />

        <p className="font-body text-silver text-sm leading-relaxed mb-8">
          Your order for{' '}
          <span className="text-ivory font-medium">{product.name}</span> has been
          placed successfully.{' '}
          {paymentMethod === 'cod'
            ? 'Our team will confirm and deliver to your address.'
            : 'Your payment is received. We will process your order shortly.'}
        </p>

        {/* Order summary */}
        <div className="text-left space-y-3 mb-8 p-5 bg-graphite/60">
          {summaryRows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 items-start">
              <span
                className="font-body text-silver text-xs uppercase flex-shrink-0"
                style={{ letterSpacing: '0.15em' }}
              >
                {label}
              </span>
              <span className="font-body text-ivory text-xs text-right">{value}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold flex items-center justify-center gap-3 w-full"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat with Us on WhatsApp
          </a>

          <Link
            to="/products"
            className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300 py-3"
            style={{ letterSpacing: '0.2em' }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
