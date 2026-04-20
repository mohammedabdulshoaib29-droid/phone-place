import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

interface HistoryOrder {
  id: string;
  date: string;
  product: string;
  quantity: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

// Mock data - in production, fetch from localStorage or API
const mockOrderHistory: HistoryOrder[] = [
  {
    id: 'ORD-2025-002',
    date: '2025-04-15',
    product: 'Premium Fast Charger',
    quantity: 1,
    total: 1532,
    status: 'delivered',
  },
  {
    id: 'ORD-2025-001',
    date: '2025-04-18',
    product: 'Premium Tempered Glass',
    quantity: 2,
    total: 1512,
    status: 'shipped',
  },
  {
    id: 'ORD-2024-156',
    date: '2025-03-22',
    product: 'Wireless Charging Pad Pro',
    quantity: 1,
    total: 2499,
    status: 'delivered',
  },
  {
    id: 'ORD-2024-155',
    date: '2025-03-10',
    product: 'USB-C Cable (3-pack)',
    quantity: 1,
    total: 499,
    status: 'delivered',
  },
  {
    id: 'ORD-2024-154',
    date: '2025-02-28',
    product: 'Phone Stand',
    quantity: 2,
    total: 798,
    status: 'delivered',
  },
];

const statusBadges: Record<string, { icon: string; color: string; label: string }> = {
  pending: { icon: '⏳', color: 'bg-gray-600/20 text-gray-400 border-gray-600/40', label: 'Pending' },
  confirmed: {
    icon: '✅',
    color: 'bg-blue-600/20 text-blue-400 border-blue-600/40',
    label: 'Confirmed',
  },
  shipped: {
    icon: '🚚',
    color: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/40',
    label: 'Shipped',
  },
  delivered: { icon: '🎉', color: 'bg-green-600/20 text-green-400 border-green-600/40', label: 'Delivered' },
  cancelled: { icon: '❌', color: 'bg-red-600/20 text-red-400 border-red-600/40', label: 'Cancelled' },
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrderHistory);
      setLoading(false);
    }, 300);
  }, []);

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-3"
            style={{ letterSpacing: '0.4em' }}
          >
            My Account
          </p>
          <h1
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 700 }}
          >
            Order History
          </h1>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="font-body text-silver">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 glass-card p-12">
            <p className="font-body text-silver text-lg mb-6">No orders yet</p>
            <button onClick={() => navigate('/products')} className="btn-gold">
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-10 flex flex-wrap gap-3">
              {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 font-body text-xs uppercase tracking-widest transition-all duration-300 ${
                    filter === status
                      ? 'bg-gold text-carbon border-gold'
                      : 'border border-gold/40 text-gold hover:border-gold/60'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const badge = statusBadges[order.status];
                return (
                  <div
                    key={order.id}
                    className="glass-card p-6 hover:border-gold/60 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/track/${order.id}`)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      {/* Order ID */}
                      <div>
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Order ID
                        </p>
                        <p className="font-display text-gold font-semibold text-sm">{order.id}</p>
                      </div>

                      {/* Product */}
                      <div className="md:col-span-2">
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Product
                        </p>
                        <p className="font-body text-ivory font-semibold text-sm">
                          {order.product}
                        </p>
                        <p className="font-body text-silver text-xs mt-1">
                          Qty: {order.quantity}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Status
                        </p>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
                        >
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Total
                        </p>
                        <p className="font-display text-gold font-bold text-lg">
                          ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Date info */}
                    <div className="mt-4 pt-4 border-t border-gold/20">
                      <p className="font-body text-silver/50 text-xs">
                        Ordered on{' '}
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination info */}
            <div className="text-center mt-12">
              <p className="font-body text-silver text-sm">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </>
        )}

        {/* Help section */}
        <div className="mt-16 pt-12 border-t border-gold/20">
          <p className="font-body text-gold text-xs uppercase tracking-widest text-center mb-8">
            Need Help?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://wa.me/917997000166"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 text-center hover:border-gold/60 transition-all"
            >
              <span className="text-2xl mb-3 block">💬</span>
              <p className="font-body text-ivory font-semibold text-sm mb-2">WhatsApp Support</p>
              <p className="font-body text-silver text-xs">Chat with our team anytime</p>
            </a>
            <a
              href="mailto:support@phonepalace.com"
              className="glass-card p-6 text-center hover:border-gold/60 transition-all"
            >
              <span className="text-2xl mb-3 block">📧</span>
              <p className="font-body text-ivory font-semibold text-sm mb-2">Email Support</p>
              <p className="font-body text-silver text-xs">Get a response within 24 hours</p>
            </a>
            <button
              onClick={() => navigate('/faq')}
              className="glass-card p-6 text-center hover:border-gold/60 transition-all"
            >
              <span className="text-2xl mb-3 block">❓</span>
              <p className="font-body text-ivory font-semibold text-sm mb-2">FAQ</p>
              <p className="font-body text-silver text-xs">Find answers to common questions</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
