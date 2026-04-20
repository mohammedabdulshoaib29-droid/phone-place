import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import api from '../utils/api';
import type { Order, OrderStatus } from '../types/order';

const ADMIN_PIN = 'phonePalace2025';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   'text-yellow-400',
  confirmed: 'text-blue-400',
  delivered: 'text-green-400',
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [pin,        setPin]        = useState('');
  const [authed,     setAuthed]     = useState(false);
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pinError,   setPinError]   = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get<Order[]>('/orders');
      setOrders(data);
    } catch {
      setError('Failed to fetch orders. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed, fetchOrders]);

  const updateStatus = async (id: string, order_status: OrderStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/orders/${id}/status`, { order_status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, order_status } : o))
      );
    } catch {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount   = orders.filter((o) => o.order_status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.order_status === 'confirmed').length;
  const deliveredCount = orders.filter((o) => o.order_status === 'delivered').length;
  const totalRevenue   = orders.reduce((sum, o) => sum + ((o.price ?? 0) * o.quantity), 0);
  const todayOrders    = orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString()).length;
  const pendingPayment = orders.filter(o => o.payment_method === 'cod' && o.order_status === 'pending').length;

  // Suppress unused warnings - values used in JSX
  void pendingCount, confirmedCount, deliveredCount;

  const filteredOrders = orders
    .filter(o => filterStatus === 'all' ? true : o.order_status === filterStatus)
    .filter(o => 
      searchTerm ? 
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        o.product.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    );

  /* ── PIN Gate ──────────────────────────────────────────────────────── */
  if (!authed) {
    const tryLogin = () => {
      if (pin === ADMIN_PIN) { setAuthed(true); setPinError(false); }
      else setPinError(true);
    };
    return (
      <main className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="glass-card max-w-sm w-full px-8 py-12 text-center animate-scale-in">
          <p className="font-body text-gold text-xs uppercase tracking-widest mb-3" style={{ letterSpacing: '0.35em' }}>
            Admin Access
          </p>
          <h1 className="font-display text-ivory text-3xl mb-2" style={{ fontStyle: 'italic', fontWeight: 700 }}>
            Phone Palace
          </h1>
          <p className="font-body text-silver text-xs mb-8">Order Management Dashboard</p>
          <div className="gold-line mb-8 mx-auto" style={{ width: '60px' }} />

          <div className="mb-6">
            <label htmlFor="pin" className="block font-body text-silver text-xs uppercase tracking-widest mb-3">
              Admin PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
              placeholder="Enter PIN"
              className="input-luxury text-center"
              style={{ letterSpacing: '0.4em', fontSize: '1.1rem' }}
              autoComplete="current-password"
            />
            {pinError && (
              <p className="font-body text-red-400 text-xs mt-3">Incorrect PIN. Please try again.</p>
            )}
          </div>
          <button onClick={tryLogin} className="btn-gold w-full">Access Dashboard</button>
        </div>
      </main>
    );
  }

  /* ── Dashboard ─────────────────────────────────────────────────────── */
  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <p className="font-body text-gold text-xs uppercase tracking-widest mb-3" style={{ letterSpacing: '0.4em' }}>
            Admin Dashboard
          </p>
          <h1 className="font-display text-ivory" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 700 }}>
            Order Management
          </h1>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        {/* Logout button */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/analytics')}
            className="font-body text-gold text-xs uppercase tracking-widest hover:text-ivory transition-colors"
            style={{ letterSpacing: '0.15em' }}
          >
            📊 Analytics Dashboard
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors"
            style={{ letterSpacing: '0.15em' }}
          >
            🔒 Logout
          </button>
        </div>

        {/* Enhanced Stats Grid */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="glass-card p-6">
              <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Total Orders</p>
              <p className="font-display text-gold text-3xl font-bold">{orders.length}</p>
              <p className="font-body text-silver/50 text-xs mt-2">All time</p>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Total Revenue</p>
              <p className="font-display text-green-500 text-3xl font-bold">₹{(totalRevenue / 1000).toFixed(1)}K</p>
              <p className="font-body text-silver/50 text-xs mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Today's Orders</p>
              <p className="font-display text-blue-500 text-3xl font-bold">{todayOrders}</p>
              <p className="font-body text-silver/50 text-xs mt-2">New orders</p>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Pending Payment</p>
              <p className="font-display text-yellow-500 text-3xl font-bold">{pendingPayment}</p>
              <p className="font-body text-silver/50 text-xs mt-2">COD awaiting</p>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-body text-silver text-xs uppercase tracking-widest mb-3">
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Name, phone, or product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-luxury w-full"
              />
            </div>

            <div>
              <label className="block font-body text-silver text-xs uppercase tracking-widest mb-3">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
                className="input-luxury w-full"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="btn-gold w-full"
                style={{ padding: '0.7rem 1.5rem' }}
              >
                {loading ? 'Loading…' : '🔄 Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* States */}
        {loading && <p className="font-body text-silver text-sm text-center py-20">Loading orders…</p>}
        {!loading && error && <p className="font-body text-red-400 text-sm text-center py-20">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="font-body text-silver text-sm text-center py-20">
            No orders yet. Orders will appear here once customers place them.
          </p>
        )}

        {/* Orders table */}
        {!loading && filteredOrders.length > 0 && (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gold/15">
                  {['Date', 'Customer', 'Product', 'Qty', 'Total', 'Payment', 'Status', 'Update'].map((h) => (
                    <th
                      key={h}
                      className="font-body text-silver text-xs uppercase pb-4 pr-6 text-left"
                      style={{ letterSpacing: '0.18em' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-graphite hover:bg-graphite/40 transition-colors duration-200">

                    <td className="font-body text-silver text-xs py-5 pr-6 whitespace-nowrap">
                      {new Date(order.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: '2-digit',
                      })}
                      <br />
                      <span className="text-silver/50">
                        {new Date(order.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="py-5 pr-6">
                      <p className="font-body text-ivory text-xs font-medium">{order.name}</p>
                      <p className="font-body text-silver text-xs mt-0.5">{order.phone}</p>
                      <p className="font-body text-silver/50 text-xs mt-0.5 max-w-[140px] truncate">{order.address}</p>
                    </td>

                    <td className="py-5 pr-6">
                      <p className="font-body text-ivory text-xs">{order.product}</p>
                    </td>

                    <td className="font-body text-ivory text-xs py-5 pr-6 text-center">{order.quantity}</td>

                    <td className="font-body text-gold text-xs font-semibold py-5 pr-6 whitespace-nowrap">
                      ₹{((order.price ?? 0) * order.quantity).toLocaleString('en-IN')}
                    </td>

                    <td className="py-5 pr-6">
                      <span className={`font-body text-xs uppercase ${order.payment_method === 'cod' ? 'text-silver' : 'text-green-400'}`}>
                        {order.payment_method === 'cod' ? 'COD' : 'Online'}
                      </span>
                    </td>

                    <td className="py-5 pr-6">
                      <span className={`font-body text-xs uppercase ${STATUS_COLORS[order.order_status] ?? 'text-silver'}`}>
                        {order.order_status}
                      </span>
                    </td>

                    <td className="py-5 pr-6">
                      <select
                        value={order.order_status}
                        onChange={(e) => updateStatus(order._id!, e.target.value as OrderStatus)}
                        disabled={updatingId === order._id}
                        className="bg-charcoal border border-gold/20 text-silver font-body text-xs px-2 py-1.5 outline-none cursor-pointer hover:border-gold/40 transition-colors"
                        style={{ letterSpacing: '0.1em' }}
                        aria-label={`Update status for order ${order._id}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
