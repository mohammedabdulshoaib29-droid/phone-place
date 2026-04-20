import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ReturnRequestModal from '../components/ReturnRequestModal';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

interface Order {
  _id: string;
  orderNumber: string;
  name: string;
  product: string;
  quantity: number;
  price: number;
  payment_status: string;
  order_status: string;
  createdAt: string;
}

const mockOrderHistory: any[] = [
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
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returnModal, setReturnModal] = useState({
    isOpen: false,
    orderId: '',
    productId: '',
    productName: '',
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/user/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to load orders. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturnClick = (order: Order) => {
    const daysDiff = Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 30) {
      alert('This order is not eligible for return (30-day window expired)');
      return;
    }

    setReturnModal({
      isOpen: true,
      orderId: order._id,
      productId: order.product,
      productName: order.product,
      quantity: order.quantity,
      price: order.price,
    });
  };

  const filteredOrders = orders;

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      {/* Return Modal */}
      <ReturnRequestModal
        isOpen={returnModal.isOpen}
        onClose={() => setReturnModal({ ...returnModal, isOpen: false })}
        orderId={returnModal.orderId}
        productId={returnModal.productId}
        productName={returnModal.productName}
        quantity={returnModal.quantity}
        price={returnModal.price}
        onSuccess={() => {
          alert('Return request submitted! Check My Returns for status.');
          fetchOrders();
        }}
      />

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

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gold/20 justify-center">
          <button
            onClick={() => navigate('/returns')}
            className="px-4 py-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/5 rounded font-semibold text-sm transition-colors"
          >
            📋 My Returns
          </button>
          <button
            onClick={() => navigate('/policies')}
            className="px-4 py-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/5 rounded font-semibold text-sm transition-colors"
          >
            📘 Return Policy
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300">
            {error}
          </div>
        )}

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
            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const daysDiff = Math.floor(
                  (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                );
                const isReturnable = daysDiff <= 30;

                return (
                  <div key={order._id} className="glass-card p-6 hover:border-gold/60 transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      {/* Order ID */}
                      <div>
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Order ID
                        </p>
                        <p className="font-display text-gold font-semibold text-sm">
                          {order.orderNumber}
                        </p>
                      </div>

                      {/* Product */}
                      <div>
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-600/20 text-emerald-400 border-emerald-600/40">
                          <span>📦</span>
                          <span>{order.order_status}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Total
                        </p>
                        <p className="font-display text-gold font-bold text-lg">
                          ₹{(order.price * order.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Date and Actions */}
                    <div className="mt-4 pt-4 border-t border-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-body text-silver/50 text-xs">
                          Ordered on{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        {isReturnable && (
                          <p className="text-emerald-400 text-xs mt-1">
                            ✓ Returnable ({30 - daysDiff} days left)
                          </p>
                        )}
                      </div>
                      {isReturnable && (
                        <button
                          onClick={() => handleReturnClick(order)}
                          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 rounded text-xs font-semibold transition-colors whitespace-nowrap"
                        >
                          Request Return
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="text-center mt-12">
              <p className="font-body text-silver text-sm">
                Total orders: {orders.length}
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
              onClick={() => navigate('/policies')}
              className="glass-card p-6 text-center hover:border-gold/60 transition-all"
            >
              <span className="text-2xl mb-3 block">❓</span>
              <p className="font-body text-ivory font-semibold text-sm mb-2">Policies</p>
              <p className="font-body text-silver text-xs">View our return & refund policy</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

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

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gold/20 justify-center">
          <button
            onClick={() => navigate('/returns')}
            className="px-4 py-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/5 rounded font-semibold text-sm transition-colors"
          >
            📋 My Returns
          </button>
          <button
            onClick={() => navigate('/policies')}
            className="px-4 py-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/5 rounded font-semibold text-sm transition-colors"
          >
            📘 Return Policy
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300">
            {error}
          </div>
        )}

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
            {/* Orders list */}
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const daysDiff = Math.floor(
                  (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                );
                const isReturnable = daysDiff <= 30;

                return (
                  <div key={order._id} className="glass-card p-6 hover:border-gold/60 transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                      {/* Order ID */}
                      <div>
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Order ID
                        </p>
                        <p className="font-display text-gold font-semibold text-sm">
                          {order.orderNumber}
                        </p>
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
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                            statusBadges[order.order_status]?.color ||
                            statusBadges['pending'].color
                          }`}
                        >
                          <span>
                            {statusBadges[order.order_status]?.icon ||
                              statusBadges['pending'].icon}
                          </span>
                          <span>
                            {statusBadges[order.order_status]?.label ||
                              order.order_status}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="font-body text-silver text-xs uppercase tracking-widest mb-2">
                          Total
                        </p>
                        <p className="font-display text-gold font-bold text-lg">
                          ₹{(order.price * order.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Date and Actions */}
                    <div className="mt-4 pt-4 border-t border-gold/20 flex items-center justify-between">
                      <p className="font-body text-silver/50 text-xs">
                        Ordered on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {daysDiff <= 30 && (
                          <span className="text-emerald-400 ml-3">
                            ({30 - daysDiff} days left for return)
                          </span>
                        )}
                      </p>
                      {isReturnable && (
                        <button
                          onClick={() => handleReturnClick(order)}
                          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 rounded text-xs font-semibold transition-colors"
                        >
                          Request Return
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="text-center mt-12">
              <p className="font-body text-silver text-sm">
                Total orders: {orders.length}
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
              onClick={() => navigate('/policies')}
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
