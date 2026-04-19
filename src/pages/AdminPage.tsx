import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import type { Order, OrderStatus } from '../types/order';

const ADMIN_PIN = 'phonePalace2025';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   'text-yellow-400',
  confirmed: 'text-blue-400',
  delivered: 'text-green-400',
};

export default function AdminPage() {
  const [pin,        setPin]        = useState('');
  const [authed,     setAuthed]     = useState(false);
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pinError,   setPinError]   = useState(false);

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
    <main className="pt-28 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="font-body text-gold text-xs uppercase tracking-widest mb-2" style={{ letterSpacing: '0.4em' }}>
              Admin Dashboard
            </p>
            <h1 className="font-display text-ivory text-3xl md:text-4xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              All Orders
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body text-silver text-xs">{orders.length} total</span>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="btn-gold"
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.65rem' }}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button
              onClick={() => setAuthed(false)}
              className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors"
              style={{ letterSpacing: '0.15em' }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="gold-line mb-8" />

        {/* Stats row */}
        {orders.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {([
              { label: 'Pending',   count: pendingCount,   color: 'text-yellow-400' },
              { label: 'Confirmed', count: confirmedCount, color: 'text-blue-400' },
              { label: 'Delivered', count: deliveredCount, color: 'text-green-400' },
            ] as { label: string; count: number; color: string }[]).map(({ label, count, color }) => (
              <div key={label} className="glass-card p-4 text-center">
                <p className={`font-display text-2xl font-bold ${color}`}>{count}</p>
                <p className="font-body text-silver text-xs uppercase mt-1" style={{ letterSpacing: '0.2em' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* States */}
        {loading && <p className="font-body text-silver text-sm text-center py-20">Loading orders…</p>}
        {!loading && error && <p className="font-body text-red-400 text-sm text-center py-20">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="font-body text-silver text-sm text-center py-20">
            No orders yet. Orders will appear here once customers place them.
          </p>
        )}

        {/* Orders table */}
        {!loading && orders.length > 0 && (
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
                {orders.map((order) => (
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
