import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

interface TrackingEvent {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered';
  timestamp: string;
  location: string;
  message: string;
}

interface ShippingPartner {
  name: string;
  logo: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  currentLocation: string;
}

interface Order {
  id: string;
  product: string;
  quantity: number;
  price: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: TrackingEvent['status'];
  orderDate: string;
  shippingPartner: ShippingPartner;
  trackingEvents: TrackingEvent[];
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
}

// Mock data - in production, fetch from API
const mockOrders: Record<string, Order> = {
  'ORD-2025-001': {
    id: 'ORD-2025-001',
    product: 'Premium Tempered Glass',
    quantity: 2,
    price: 599,
    subtotal: 1198,
    tax: 215,
    shipping: 99,
    total: 1512,
    status: 'shipped',
    orderDate: '2025-04-18',
    shippingPartner: {
      name: 'DHL Express',
      logo: '📦',
      trackingNumber: 'DHL-1234567890',
      estimatedDelivery: '2025-04-22',
      currentLocation: 'Chennai Distribution Center',
    },
    trackingEvents: [
      {
        status: 'confirmed',
        timestamp: '2025-04-18 10:30',
        location: 'Phone Palace, Amberpet',
        message: 'Order confirmed and payment received',
      },
      {
        status: 'processing',
        timestamp: '2025-04-18 14:45',
        location: 'Phone Palace Warehouse',
        message: 'Order packed and ready for shipment',
      },
      {
        status: 'shipped',
        timestamp: '2025-04-19 08:00',
        location: 'DHL Hyderabad Hub',
        message: 'Handed over to DHL Express',
      },
      {
        status: 'in-transit',
        timestamp: '2025-04-20 09:15',
        location: 'Chennai Distribution Center',
        message: 'In transit to delivery location',
      },
    ],
    customerName: 'Raj Kumar',
    customerPhone: '+91 98765 43210',
    deliveryAddress: '123 Main Street, Hyderabad, 500001',
  },
  'ORD-2025-002': {
    id: 'ORD-2025-002',
    product: 'Premium Fast Charger',
    quantity: 1,
    price: 1299,
    subtotal: 1299,
    tax: 233,
    shipping: 0,
    total: 1532,
    status: 'delivered',
    orderDate: '2025-04-15',
    shippingPartner: {
      name: 'Fedex International',
      logo: '🚚',
      trackingNumber: 'FDX-0987654321',
      estimatedDelivery: '2025-04-18',
      currentLocation: 'Delivered to recipient',
    },
    trackingEvents: [
      {
        status: 'confirmed',
        timestamp: '2025-04-15 09:00',
        location: 'Phone Palace, Amberpet',
        message: 'Order confirmed',
      },
      {
        status: 'processing',
        timestamp: '2025-04-15 12:30',
        location: 'Phone Palace Warehouse',
        message: 'Order packed',
      },
      {
        status: 'shipped',
        timestamp: '2025-04-16 06:00',
        location: 'Fedex Hyderabad Hub',
        message: 'Handed over to Fedex',
      },
      {
        status: 'in-transit',
        timestamp: '2025-04-16 15:30',
        location: 'Fedex Regional Hub',
        message: 'In transit',
      },
      {
        status: 'out-for-delivery',
        timestamp: '2025-04-17 09:00',
        location: 'Local Delivery Hub',
        message: 'Out for delivery',
      },
      {
        status: 'delivered',
        timestamp: '2025-04-18 14:45',
        location: 'Hyderabad',
        message: 'Delivered to recipient',
      },
    ],
    customerName: 'Priya Singh',
    customerPhone: '+91 87654 32109',
    deliveryAddress: '456 Park Avenue, Hyderabad, 500002',
  },
};

const statusColors: Record<TrackingEvent['status'], string> = {
  pending: 'bg-gray-600 text-white',
  confirmed: 'bg-blue-600 text-white',
  processing: 'bg-purple-600 text-white',
  shipped: 'bg-indigo-600 text-white',
  'in-transit': 'bg-yellow-600 text-white',
  'out-for-delivery': 'bg-orange-600 text-white',
  delivered: 'bg-green-600 text-white',
};

const statusEmojis: Record<TrackingEvent['status'], string> = {
  pending: '⏳',
  confirmed: '✅',
  processing: '📦',
  shipped: '🚚',
  'in-transit': '🚛',
  'out-for-delivery': '🏃',
  delivered: '🎉',
};

function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <div className="space-y-6">
      {events.map((event, idx) => (
        <div key={idx} className="flex gap-4">
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${statusColors[event.status]}`}
            >
              {statusEmojis[event.status]}
            </div>
            {idx < events.length - 1 && <div className="w-1 h-12 bg-gold/30 mt-2" />}
          </div>

          {/* Event details */}
          <div className="flex-1 pb-4">
            <p className="font-body text-ivory font-semibold text-sm capitalize">
              {event.status.replace('-', ' ')}
            </p>
            <p className="font-body text-silver text-xs mt-1">{event.message}</p>
            <p className="font-body text-silver/50 text-xs mt-2">
              📍 {event.location} · {event.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShippingInfo({ partner }: { partner: ShippingPartner }) {
  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{partner.logo}</span>
          <div>
            <p className="font-body text-ivory font-semibold text-sm">{partner.name}</p>
            {partner.trackingNumber && (
              <p className="font-body text-gold text-xs font-mono mt-1">
                Tracking: {partner.trackingNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="gold-line" />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
            Current Location
          </p>
          <p className="font-body text-ivory font-semibold text-sm">{partner.currentLocation}</p>
        </div>
        <div>
          <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
            Est. Delivery
          </p>
          <p className="font-body text-gold font-semibold text-sm">
            {new Date(partner.estimatedDelivery).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full h-1 bg-gold/20 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gold rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate API call
    setTimeout(() => {
      if (orderId && mockOrders[orderId]) {
        setOrder(mockOrders[orderId]);
      }
      setLoading(false);
    }, 300);
  }, [orderId]);

  if (loading) {
    return (
      <main className="pt-24 pb-20 min-h-screen px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-silver">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="pt-24 pb-20 min-h-screen px-6">
        <Breadcrumbs />
        <div className="max-w-4xl mx-auto text-center mt-12">
          <p className="font-body text-silver text-lg mb-6">Order not found</p>
          <button onClick={() => navigate('/products')} className="btn-gold">
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-3"
            style={{ letterSpacing: '0.4em' }}
          >
            Order Tracking
          </p>
          <h1
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 700 }}
          >
            {order.id}
          </h1>
          <p className="font-body text-silver text-sm mt-3">
            {new Date(order.orderDate).toLocaleDateString('en-IN', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main tracking */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status badge */}
            <div
              className={`px-4 py-3 rounded-full inline-flex items-center gap-2 text-sm font-semibold ${
                statusColors[order.status]
              }`}
            >
              <span>{statusEmojis[order.status]}</span>
              <span className="capitalize">{order.status.replace('-', ' ')}</span>
            </div>

            {/* Shipping info */}
            <ShippingInfo partner={order.shippingPartner} />

            {/* Timeline */}
            <div>
              <p
                className="font-body text-gold text-xs uppercase tracking-widest mb-6"
                style={{ letterSpacing: '0.4em' }}
              >
                Tracking History
              </p>
              <TrackingTimeline events={order.trackingEvents} />
            </div>
          </div>

          {/* Sidebar - Order summary */}
          <div className="space-y-6">
            {/* Order details */}
            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-widest mb-5">
                Order Summary
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-body text-silver">{order.quantity}× {order.product}</span>
                  <span className="font-body text-ivory font-semibold">
                    ₹{(order.price * order.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="gold-line" />

                <div className="flex justify-between font-body text-silver">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body text-silver">
                  <span>Tax (GST)</span>
                  <span>₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body text-silver">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>

                <div className="gold-line" />

                <div className="flex justify-between">
                  <span className="font-display text-ivory font-bold">Total</span>
                  <span className="font-display text-gold font-bold text-lg">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer details */}
            <div className="glass-card p-6 space-y-4">
              <p className="font-body text-gold text-xs uppercase tracking-widest">
                Delivery Address
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-body text-silver text-xs uppercase tracking-widest mb-1">
                    Name
                  </p>
                  <p className="font-body text-ivory text-sm">{order.customerName}</p>
                </div>
                <div>
                  <p className="font-body text-silver text-xs uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <a href={`tel:${order.customerPhone}`} className="font-body text-gold text-sm hover:text-gold-pale">
                    {order.customerPhone}
                  </a>
                </div>
                <div>
                  <p className="font-body text-silver text-xs uppercase tracking-widest mb-1">
                    Address
                  </p>
                  <p className="font-body text-ivory text-sm">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="btn-gold w-full">Print Receipt</button>
              <button
                onClick={() => navigate('/products')}
                className="w-full px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 transition-colors font-body text-sm uppercase tracking-widest"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
