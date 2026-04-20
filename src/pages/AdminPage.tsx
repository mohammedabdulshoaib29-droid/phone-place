import { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import api from '../utils/api';
import { getRepairBookings, REPAIR_ISSUE_LABELS, REPAIR_STATUS_LABELS } from '../utils/repairs';
import type { Order } from '../types/order';

const ENV_ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN?.trim() ?? '';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(ENV_ADMIN_PIN === '');
  const [pinError, setPinError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data } = await api.get<Order[]>('/orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (authed) {
      fetchOrders();
    }
  }, [authed]);

  const repairs = useMemo(() => getRepairBookings(), [authed]);
  const pendingApprovalCount = repairs.filter((repair) => repair.approvalStatus === 'pending').length;
  const activeRepairCount = repairs.filter((repair) =>
    ['under-inspection', 'quote-sent', 'waiting-for-approval', 'repair-in-progress', 'quality-check'].includes(repair.status)
  ).length;
  const readyCount = repairs.filter((repair) => repair.status === 'ready-for-pickup').length;
  const orderRevenue = orders.reduce((sum, order) => sum + order.price * order.quantity, 0);

  const handlePinCheck = () => {
    if (ENV_ADMIN_PIN && pin === ENV_ADMIN_PIN) {
      setAuthed(true);
      setPinError(false);
      return;
    }

    setPinError(true);
  };

  if (!authed) {
    return (
      <main className="pt-32 pb-20 min-h-screen px-6 flex items-center justify-center">
        <div className="glass-card w-full max-w-md p-8">
          <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Admin Access</p>
          <h1 className="font-display text-ivory text-4xl mb-4" style={{ fontStyle: 'italic', fontWeight: 700 }}>
            Operations Dashboard
          </h1>
          <p className="font-body text-silver text-sm leading-7 mb-8">
            This screen no longer keeps a hardcoded admin secret in the codebase. Use the configured
            `VITE_ADMIN_PIN` environment variable for the front-end gate while backend role checks are added.
          </p>
          <label className="block">
            <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Admin PIN</span>
            <input
              type="password"
              value={pin}
              onChange={(event) => {
                setPin(event.target.value);
                setPinError(false);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handlePinCheck();
                }
              }}
              className="input-luxury"
            />
          </label>
          {pinError && <p className="mt-4 text-sm text-red-400">Incorrect PIN.</p>}
          <button onClick={handlePinCheck} className="btn-gold mt-8">Open Dashboard</button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto mt-8">
        <div className="mb-10">
          <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Admin Dashboard</p>
          <h1 className="font-display text-ivory text-4xl md:text-5xl mb-4" style={{ fontStyle: 'italic', fontWeight: 700 }}>
            Repairs, orders, and customer operations in one view
          </h1>
          <p className="font-body text-silver text-sm md:text-base leading-7 max-w-4xl">
            This dashboard now reflects the business plan more closely: repair intake, approval bottlenecks,
            service progress, and commerce activity appear together. The repair data is currently local for demo flow,
            while orders continue to load from the existing API when available.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-10">
          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">Repair Bookings</p>
            <p className="font-display text-gold text-3xl" style={{ fontWeight: 700 }}>{repairs.length}</p>
          </div>
          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">Approval Pending</p>
            <p className="font-display text-gold text-3xl" style={{ fontWeight: 700 }}>{pendingApprovalCount}</p>
          </div>
          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">Active Repairs</p>
            <p className="font-display text-gold text-3xl" style={{ fontWeight: 700 }}>{activeRepairCount}</p>
          </div>
          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">Ready For Pickup</p>
            <p className="font-display text-gold text-3xl" style={{ fontWeight: 700 }}>{readyCount}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-card p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-2">Repair Queue</p>
                <h2 className="font-display text-ivory text-3xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
                  Recent bookings
                </h2>
              </div>
              <p className="font-body text-silver text-xs uppercase tracking-[0.2em]">Live demo data</p>
            </div>

            <div className="space-y-4">
              {repairs.map((repair) => (
                <div key={repair.id} className="rounded-3xl border border-gold/10 bg-charcoal/50 p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="font-body text-gold text-xs uppercase tracking-[0.2em] mb-2">{repair.id}</p>
                      <h3 className="font-body text-ivory text-lg">{repair.customerName}</h3>
                      <p className="font-body text-silver text-sm mt-2">
                        {repair.brand} {repair.model} · {REPAIR_ISSUE_LABELS[repair.problemType]}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Status</p>
                      <p className="font-body text-ivory text-sm">{REPAIR_STATUS_LABELS[repair.status]}</p>
                      <p className="font-body text-silver/70 text-xs mt-2 capitalize">
                        Approval {repair.approvalStatus.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gold/10 grid gap-3 md:grid-cols-3 text-xs text-silver">
                    <p>Service: <span className="text-ivory">{repair.serviceType}</span></p>
                    <p>Estimate: <span className="text-ivory">Rs. {repair.costEstimate.toLocaleString('en-IN')}</span></p>
                    <p>ETA: <span className="text-ivory">{new Date(repair.estimatedCompletionDate).toLocaleDateString('en-IN')}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-2">Order Snapshot</p>
              <h2 className="font-display text-ivory text-3xl mb-4" style={{ fontStyle: 'italic', fontWeight: 700 }}>
                Commerce view
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gold/10 p-4">
                  <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Orders</p>
                  <p className="font-display text-gold text-2xl" style={{ fontWeight: 700 }}>
                    {loadingOrders ? '...' : orders.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-gold/10 p-4">
                  <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Revenue</p>
                  <p className="font-display text-gold text-2xl" style={{ fontWeight: 700 }}>
                    Rs. {orderRevenue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-2">Operations Notes</p>
              <div className="space-y-4 text-sm text-silver leading-7">
                <p>Repair booking and repair tracking are now mapped to the customer-facing site flow.</p>
                <p>Approval state, payment state, and technician notes are surfaced directly in repair tracking.</p>
                <p>For production security, move admin authentication and role checks fully to the backend.</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Latest Orders</p>
              {orders.length === 0 ? (
                <p className="font-body text-silver text-sm">
                  No order data is available from the API in the current environment.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order._id ?? `${order.productId}-${order.timestamp}`} className="rounded-2xl border border-gold/10 p-4">
                      <p className="font-body text-ivory text-sm">{order.product}</p>
                      <p className="font-body text-silver text-xs mt-2">
                        {order.name} · {order.order_status} · Rs. {(order.price * order.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
