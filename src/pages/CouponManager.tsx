import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  description: string;
  status: 'active' | 'expired' | 'disabled';
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    discountType: 'percentage',
    minPurchase: 999,
    maxUses: 100,
    usedCount: 45,
    expiryDate: '2025-05-31',
    description: 'Welcome new customers - 20% off your first order',
    status: 'active',
  },
  {
    id: '2',
    code: 'SUMMER500',
    discount: 500,
    discountType: 'fixed',
    minPurchase: 2000,
    maxUses: 50,
    usedCount: 38,
    expiryDate: '2025-06-30',
    description: 'Summer sale - Flat ₹500 off on orders above ₹2000',
    status: 'active',
  },
  {
    id: '3',
    code: 'REFERRAL300',
    discount: 300,
    discountType: 'fixed',
    minPurchase: 1000,
    maxUses: 200,
    usedCount: 89,
    expiryDate: '2025-12-31',
    description: 'Referral program - ₹300 off for referred friends',
    status: 'active',
  },
  {
    id: '4',
    code: 'SPRINGFEST15',
    discount: 15,
    discountType: 'percentage',
    minPurchase: 500,
    maxUses: 30,
    usedCount: 30,
    expiryDate: '2025-04-19',
    description: 'Spring festival special - 15% off (expired)',
    status: 'expired',
  },
];

export default function CouponManager() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredCoupons =
    filter === 'all' ? coupons : coupons.filter((c) => c.status === filter);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getDiscountLabel = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discount}% OFF`;
    }
    return `₹${coupon.discount} OFF`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600/20 text-green-400 border-green-600/40';
      case 'expired':
        return 'bg-red-600/20 text-red-400 border-red-600/40';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/40';
    }
  };

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-3"
            style={{ letterSpacing: '0.4em' }}
          >
            Exclusive Offers
          </p>
          <h1
            className="font-display text-ivory"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            Coupon Codes
          </h1>
          <p className="font-body text-silver text-sm mt-4">
            Use these exclusive codes to save on your purchases
          </p>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-body text-xs uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-gold text-carbon'
                  : 'border border-gold/40 text-gold hover:border-gold/60'
              }`}
            >
              {f === 'all' ? 'All Coupons' : f === 'active' ? 'Active' : 'Expired'}
              {f === 'all' && ` (${coupons.length})`}
              {f === 'active' && ` (${coupons.filter((c) => c.status === 'active').length})`}
              {f === 'expired' && ` (${coupons.filter((c) => c.status === 'expired').length})`}
            </button>
          ))}
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`glass-card p-6 transition-all duration-300 relative overflow-hidden ${
                coupon.status === 'expired' ? 'opacity-75' : ''
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    coupon.status
                  )}`}
                >
                  {coupon.status === 'active' ? '✓ Active' : coupon.status === 'expired' ? '❌ Expired' : '🚫 Disabled'}
                </span>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <p className="font-body text-gold text-xs uppercase tracking-widest mb-3">
                  Coupon Code
                </p>
                <div className="flex gap-3 items-center">
                  <code className="flex-1 bg-carbon/50 px-4 py-3 rounded border border-gold/20 font-mono text-ivory text-lg font-bold">
                    {coupon.code}
                  </code>
                  <button
                    onClick={() => copyCoupon(coupon.code)}
                    disabled={coupon.status !== 'active'}
                    className={`px-3 py-3 transition-colors font-body text-xs uppercase tracking-widest font-semibold ${
                      coupon.status === 'active'
                        ? 'bg-gold text-carbon hover:bg-gold-pale'
                        : 'bg-silver/20 text-silver/50 cursor-not-allowed'
                    }`}
                  >
                    {copied === coupon.code ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              {/* Discount & Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-body text-gold text-xs uppercase tracking-widest mb-1">Discount</p>
                    <p className="font-display text-2xl font-bold text-green-500">
                      {getDiscountLabel(coupon)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-silver text-xs uppercase tracking-widest mb-1">Min Purchase</p>
                    <p className="font-display text-lg text-gold font-bold">
                      ₹{coupon.minPurchase.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <p className="font-body text-ivory text-sm">{coupon.description}</p>

                {/* Usage Info */}
                <div className="pt-4 border-t border-gold/20">
                  <div className="flex justify-between mb-2">
                    <p className="font-body text-silver text-xs">Uses: {coupon.usedCount}/{coupon.maxUses}</p>
                    <p className="font-body text-silver text-xs">
                      Expires:{' '}
                      {new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="w-full h-1 bg-gold/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              {coupon.status === 'active' && (
                <button className="w-full px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 transition-colors font-body text-xs uppercase tracking-widest">
                  Apply Coupon
                </button>
              )}
            </div>
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="font-body text-silver text-lg">
              {filter === 'active' ? 'No active coupons at the moment' : 'No expired coupons'}
            </p>
            <p className="font-body text-silver/50 text-sm mt-2">
              Check back soon for more exclusive deals!
            </p>
          </div>
        )}

        {/* Terms */}
        <div className="glass-card p-6 text-center">
          <p className="font-body text-silver text-xs mb-2">
            💡 Terms: Coupons are non-transferable and cannot be combined with other offers
          </p>
          <p className="font-body text-silver/50 text-xs">
            Discounts are applied at checkout. Limited time offers subject to availability.
          </p>
        </div>
      </div>
    </main>
  );
}
