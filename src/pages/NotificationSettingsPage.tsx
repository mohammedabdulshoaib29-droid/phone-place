import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

interface NotificationPreference {
  id: string;
  name: string;
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
  description: string;
}

interface CustomerNotifications {
  email: string;
  phone: string;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  reviewRequests: boolean;
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: 'order_confirmed',
    name: 'Order Confirmation',
    email: true,
    whatsapp: true,
    sms: false,
    description: 'Get notified when your order is confirmed and payment is received',
  },
  {
    id: 'order_shipped',
    name: 'Order Shipped',
    email: true,
    whatsapp: true,
    sms: false,
    description: 'Receive tracking info and estimated delivery date',
  },
  {
    id: 'order_delivered',
    name: 'Order Delivered',
    email: true,
    whatsapp: true,
    sms: false,
    description: 'Confirmation when your package is delivered',
  },
  {
    id: 'order_cancelled',
    name: 'Order Cancelled',
    email: true,
    whatsapp: false,
    sms: false,
    description: 'Alert if your order is cancelled or has issues',
  },
  {
    id: 'promotional',
    name: 'Promotional Offers',
    email: true,
    whatsapp: false,
    sms: false,
    description: 'Exclusive deals, seasonal sales, and special discounts',
  },
  {
    id: 'newsletter',
    name: 'Weekly Newsletter',
    email: true,
    whatsapp: false,
    sms: false,
    description: 'New products, tips, and industry news delivered weekly',
  },
  {
    id: 'reviews',
    name: 'Review Requests',
    email: true,
    whatsapp: false,
    sms: false,
    description: 'Ask for feedback after your order is delivered',
  },
  {
    id: 'restocks',
    name: 'Product Restocks',
    email: true,
    whatsapp: false,
    sms: false,
    description: 'Notify when out-of-stock items are back in stock',
  },
];

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [customerInfo, setCustomerInfo] = useState<CustomerNotifications>({
    email: 'customer@example.com',
    phone: '+91 98765 43210',
    orderUpdates: true,
    promotions: true,
    newsletter: true,
    reviewRequests: false,
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'notification' | 'contact'>('notification');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load from localStorage in production
    const stored = localStorage.getItem('notificationPreferences');
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
    const storedCustomer = localStorage.getItem('customerNotifications');
    if (storedCustomer) {
      setCustomerInfo(JSON.parse(storedCustomer));
    }
  }, []);

  const handleToggle = (id: string, channel: 'email' | 'whatsapp' | 'sms') => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [channel]: !p[channel] } : p
      )
    );
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    localStorage.setItem('customerNotifications', JSON.stringify(customerInfo));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
    setSaved(false);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-3xl mx-auto">
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
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            Notification Settings
          </h1>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gold/20">
          <button
            onClick={() => setActiveTab('notification')}
            className={`px-6 py-3 font-body text-sm uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'notification'
                ? 'text-gold border-b-2 border-gold'
                : 'text-silver hover:text-gold'
            }`}
          >
            📬 Notification Types
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-body text-sm uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'contact'
                ? 'text-gold border-b-2 border-gold'
                : 'text-silver hover:text-gold'
            }`}
          >
            📱 Contact Details
          </button>
        </div>

        {/* Notification Preferences */}
        {activeTab === 'notification' && (
          <div className="space-y-6 mb-12">
            {preferences.map((pref) => (
              <div key={pref.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="font-body text-ivory font-semibold text-sm mb-1">
                      {pref.name}
                    </p>
                    <p className="font-body text-silver text-xs">{pref.description}</p>
                  </div>
                </div>

                {/* Channel toggles */}
                <div className="flex flex-wrap gap-6 items-center">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={pref.email}
                      onChange={() => handleToggle(pref.id, 'email')}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        pref.email
                          ? 'border-gold bg-gold'
                          : 'border-gold/30 bg-transparent group-hover:border-gold/50'
                      }`}
                    >
                      {pref.email && <span className="text-carbon text-xs font-bold">✓</span>}
                    </div>
                    <span className="font-body text-silver text-xs group-hover:text-gold">
                      📧 Email
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={pref.whatsapp}
                      onChange={() => handleToggle(pref.id, 'whatsapp')}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        pref.whatsapp
                          ? 'border-gold bg-gold'
                          : 'border-gold/30 bg-transparent group-hover:border-gold/50'
                      }`}
                    >
                      {pref.whatsapp && <span className="text-carbon text-xs font-bold">✓</span>}
                    </div>
                    <span className="font-body text-silver text-xs group-hover:text-gold">
                      💬 WhatsApp
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group opacity-50 cursor-not-allowed">
                    <input
                      type="checkbox"
                      disabled
                      className="sr-only"
                    />
                    <div className="w-5 h-5 rounded border-2 border-silver/20 bg-transparent" />
                    <span className="font-body text-silver/50 text-xs">
                      📞 SMS (Coming Soon)
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Details */}
        {activeTab === 'contact' && (
          <div className="space-y-8 mb-12">
            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-widest mb-6">
                Email Address
              </p>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                className="input-luxury w-full mb-3"
                placeholder="your@email.com"
              />
              <p className="font-body text-silver/50 text-xs">
                We'll send order confirmations and promotional emails to this address
              </p>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-widest mb-6">
                WhatsApp Number
              </p>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="input-luxury w-full mb-3"
                placeholder="+91 98765 43210"
              />
              <p className="font-body text-silver/50 text-xs">
                Order updates and tracking info will be sent to this WhatsApp number
              </p>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-widest mb-6">
                Quick Toggles
              </p>
              <div className="space-y-4">
                {[
                  { key: 'orderUpdates', label: '📦 Order Updates', desc: 'Get tracking & delivery notifications' },
                  { key: 'promotions', label: '🎉 Promotional Offers', desc: 'Never miss a sale or deal' },
                  { key: 'newsletter', label: '📰 Weekly Newsletter', desc: 'New products & tips' },
                  { key: 'reviewRequests', label: '⭐ Review Requests', desc: 'Share your feedback' },
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex items-center gap-4 p-4 border border-gold/20 hover:border-gold/40 rounded transition-all cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={customerInfo[key as keyof Omit<CustomerNotifications, 'email' | 'phone'>]}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="sr-only"
                    />
                    <div className="w-6 h-6 rounded border-2 border-gold/40 group-hover:border-gold flex items-center justify-center transition-all">
                      {customerInfo[key as keyof Omit<CustomerNotifications, 'email' | 'phone'>] && (
                        <span className="text-gold font-bold text-sm">✓</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-body text-ivory text-sm font-semibold">{label}</p>
                      <p className="font-body text-silver text-xs">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button onClick={handleSave} className="btn-gold flex-1">
            💾 {saved ? '✓ Saved!' : 'Save Preferences'}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 border border-gold/40 text-gold hover:bg-gold/10 transition-colors font-body text-sm uppercase tracking-widest"
          >
            🔄 Reset to Defaults
          </button>
        </div>

        {/* Info section */}
        <div className="glass-card p-6 text-center">
          <p className="font-body text-silver text-xs mb-3">
            💡 Pro Tip: Customize your preferences to get relevant notifications without spam
          </p>
          <p className="font-body text-silver/50 text-xs">
            We respect your privacy. Your contact information is never shared with third parties.
          </p>
        </div>
      </div>
    </main>
  );
}
