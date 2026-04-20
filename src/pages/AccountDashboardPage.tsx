import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { getRepairBookingsForPhone, REPAIR_ISSUE_LABELS, REPAIR_STATUS_LABELS } from '../utils/repairs';
import type { RepairBooking } from '../types/repair';
import type { Order } from '../types/order';

type AccountTab = 'overview' | 'repairs' | 'orders' | 'notifications' | 'profile';

export default function AccountDashboardPage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        return;
      }

      try {
        setOrdersLoading(true);
        const { data } = await api.get<Order[]>('/user/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const repairs = getRepairBookingsForPhone(user?.phone);
  const recentNotifications = repairs.flatMap((repair) =>
    repair.timeline.slice(-2).map((item) => ({
      id: `${repair.id}-${item.status}`,
      title: item.title,
      message: `${repair.brand} ${repair.model}: ${item.note}`,
      timestamp: item.timestamp,
    }))
  ).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6);

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">My Account</p>
            <h1 className="font-display text-ivory text-4xl md:text-5xl mb-3" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              One place for orders, repairs, updates, and profile details
            </h1>
            <p className="font-body text-silver text-sm md:text-base leading-7 max-w-3xl">
              This dashboard turns the account area into a service hub. Customers can check recent repairs,
              view order activity, review notifications, and jump to profile, invoices, and saved address settings.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 min-w-[240px]">
            <div className="rounded-2xl border border-gold/15 bg-charcoal/50 p-4">
              <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">My Repairs</p>
              <p className="font-display text-gold text-2xl" style={{ fontWeight: 700 }}>{repairs.length}</p>
            </div>
            <div className="rounded-2xl border border-gold/15 bg-charcoal/50 p-4">
              <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">My Orders</p>
              <p className="font-display text-gold text-2xl" style={{ fontWeight: 700 }}>
                {ordersLoading ? '...' : orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {([
            ['overview', 'Overview'],
            ['repairs', 'My Repairs'],
            ['orders', 'My Orders'],
            ['notifications', 'Notifications'],
            ['profile', 'Profile'],
          ] as [AccountTab, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-5 py-3 text-xs uppercase tracking-[0.22em] transition-all ${
                activeTab === value
                  ? 'bg-gold text-carbon'
                  : 'border border-gold/30 text-gold hover:bg-gold/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Book Repair', description: 'Create a new repair ticket with pickup or doorstep options.', href: '/book-repair' },
              { title: 'Track Repair', description: 'Track any repair using repair ID and phone number.', href: '/track-repair' },
              { title: 'Notification Settings', description: 'Manage order and repair communication preferences.', href: '/notifications' },
              { title: 'Profile & Addresses', description: 'Update profile details, saved addresses, and preferences.', href: '/profile' },
            ].map((card) => (
              <Link key={card.title} to={card.href} className="glass-card p-6 hover:border-gold/50 transition-colors">
                <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-3">{card.title}</p>
                <p className="font-body text-silver text-sm leading-7">{card.description}</p>
              </Link>
            ))}
          </section>
        )}

        {activeTab === 'repairs' && (
          <section className="space-y-4">
            {repairs.length === 0 ? (
              <div className="glass-card p-8">
                <p className="font-body text-silver text-sm mb-4">No repairs found for this account yet.</p>
                <Link to="/book-repair" className="btn-gold inline-block">Book Your First Repair</Link>
              </div>
            ) : (
              repairs.map((repair: RepairBooking) => (
                <div key={repair.id} className="glass-card p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-2">{repair.id}</p>
                      <h2 className="font-body text-ivory text-lg">{repair.brand} {repair.model}</h2>
                      <p className="font-body text-silver text-sm mt-2">{REPAIR_ISSUE_LABELS[repair.problemType]}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Current Status</p>
                      <p className="font-body text-ivory text-sm">{REPAIR_STATUS_LABELS[repair.status]}</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-gold/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <p className="font-body text-silver text-xs">
                      Estimated completion: {new Date(repair.estimatedCompletionDate).toLocaleDateString('en-IN')}
                    </p>
                    <Link
                      to={`/track-repair?repairId=${encodeURIComponent(repair.id)}&phone=${encodeURIComponent(repair.phone)}`}
                      className="text-gold text-xs uppercase tracking-[0.22em]"
                    >
                      Open Tracking
                    </Link>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="space-y-4">
            {ordersLoading ? (
              <div className="glass-card p-8">
                <p className="font-body text-silver text-sm">Loading recent orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="glass-card p-8">
                <p className="font-body text-silver text-sm mb-4">
                  No API-backed orders were found for this account in the current environment.
                </p>
                <Link to="/products" className="btn-gold inline-block">Shop Accessories</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id ?? `${order.productId}-${order.timestamp}`} className="glass-card p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-2">{order.product}</p>
                      <p className="font-body text-silver text-sm">
                        Qty {order.quantity} | {order.payment_method.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-body text-ivory text-lg">Rs. {(order.price * order.quantity).toLocaleString('en-IN')}</p>
                      <p className="font-body text-silver text-xs mt-2 capitalize">{order.order_status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === 'notifications' && (
          <section className="space-y-4">
            {recentNotifications.length === 0 ? (
              <div className="glass-card p-8">
                <p className="font-body text-silver text-sm mb-4">No recent notifications yet.</p>
                <Link to="/notifications" className="btn-gold inline-block">Manage Preferences</Link>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div key={notification.id} className="glass-card p-6">
                  <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-2">{notification.title}</p>
                  <p className="font-body text-silver text-sm leading-7">{notification.message}</p>
                  <p className="font-body text-silver/60 text-xs mt-3">
                    {new Date(notification.timestamp).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="grid gap-6 md:grid-cols-2">
            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Customer Profile</p>
              <div className="space-y-3 text-sm">
                <p className="text-silver">Name: <span className="text-ivory">{user?.name || 'Not set'}</span></p>
                <p className="text-silver">Phone: <span className="text-ivory">{user?.phone || 'Not set'}</span></p>
                <p className="text-silver">Email: <span className="text-ivory">{user?.email || 'Not set'}</span></p>
                <p className="text-silver">Referral Code: <span className="text-ivory">{user?.referralCode || 'Unavailable'}</span></p>
              </div>
            </div>
            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Quick Links</p>
              <div className="space-y-3">
                <Link to="/profile" className="block text-sm text-silver hover:text-gold transition-colors">Open detailed profile and addresses</Link>
                <Link to="/notifications" className="block text-sm text-silver hover:text-gold transition-colors">Update notifications</Link>
                <Link to="/my-orders" className="block text-sm text-silver hover:text-gold transition-colors">Open order history</Link>
                <Link to="/contact" className="block text-sm text-silver hover:text-gold transition-colors">Contact support</Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
