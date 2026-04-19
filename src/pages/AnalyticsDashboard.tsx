import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

interface AnalyticsData {
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
  conversionRate: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  revenueByDay: { date: string; revenue: number }[];
  customerSource: { source: string; count: number }[];
}

const mockAnalytics: AnalyticsData = {
  revenue: 45320,
  orders: 28,
  customers: 24,
  avgOrderValue: 1618,
  conversionRate: 3.2,
  topProducts: [
    { name: 'Premium Tempered Glass', sales: 12, revenue: 7188 },
    { name: 'Premium Fast Charger', sales: 8, revenue: 10392 },
    { name: 'Wireless Charging Pad Pro', sales: 5, revenue: 12495 },
    { name: 'USB-C Cable 3-pack', sales: 3, revenue: 1497 },
  ],
  revenueByDay: [
    { date: 'Apr 14', revenue: 3200 },
    { date: 'Apr 15', revenue: 5400 },
    { date: 'Apr 16', revenue: 2800 },
    { date: 'Apr 17', revenue: 6100 },
    { date: 'Apr 18', revenue: 8900 },
    { date: 'Apr 19', revenue: 12000 },
    { date: 'Apr 20', revenue: 6920 },
  ],
  customerSource: [
    { source: 'Direct', count: 12 },
    { source: 'Google Search', count: 8 },
    { source: 'Instagram', count: 3 },
    { source: 'Referral', count: 1 },
  ],
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const maxRevenue = Math.max(...analytics.revenueByDay.map((d) => d.revenue));

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 mt-8">
          <div>
            <p
              className="font-body text-gold text-xs uppercase tracking-widest mb-3"
              style={{ letterSpacing: '0.4em' }}
            >
              Admin Analytics
            </p>
            <h1
              className="font-display text-ivory"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontStyle: 'italic',
                fontWeight: 700,
              }}
            >
              Business Metrics
            </h1>
          </div>

          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 font-body text-xs uppercase tracking-widest transition-all ${
                  timeRange === range
                    ? 'bg-gold text-carbon'
                    : 'border border-gold/40 text-gold hover:border-gold/60'
                }`}
              >
                {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'This Year'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="font-body text-silver text-center py-20">Loading analytics...</p>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Total Revenue
                </p>
                <p className="font-display text-green-500 text-3xl font-bold">
                  ₹{(analytics.revenue / 1000).toFixed(1)}K
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  +8.2% vs last {timeRange}
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Total Orders
                </p>
                <p className="font-display text-blue-500 text-3xl font-bold">{analytics.orders}</p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  +5 new orders
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Customers
                </p>
                <p className="font-display text-purple-500 text-3xl font-bold">
                  {analytics.customers}
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  +3 new customers
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Avg Order Value
                </p>
                <p className="font-display text-gold text-3xl font-bold">
                  ₹{analytics.avgOrderValue.toLocaleString('en-IN')}
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  Per transaction
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Conversion Rate
                </p>
                <p className="font-display text-yellow-500 text-3xl font-bold">
                  {analytics.conversionRate}%
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  Store visitors
                </p>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="glass-card p-8 mb-12">
              <p
                className="font-body text-gold text-xs uppercase tracking-widest mb-8"
                style={{ letterSpacing: '0.4em' }}
              >
                Revenue Trend
              </p>

              <div className="space-y-6">
                {analytics.revenueByDay.map(({ date, revenue }) => (
                  <div key={date}>
                    <div className="flex justify-between mb-2">
                      <span className="font-body text-silver text-xs">{date}</span>
                      <span className="font-display text-gold font-bold">
                        ₹{revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gold/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-gold-pale rounded-full transition-all duration-500"
                        style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Top Products */}
              <div className="glass-card p-8">
                <p
                  className="font-body text-gold text-xs uppercase tracking-widest mb-6"
                  style={{ letterSpacing: '0.4em' }}
                >
                  Top Products
                </p>

                <div className="space-y-4">
                  {analytics.topProducts.map((product, idx) => (
                    <div key={idx} className="border-b border-gold/10 pb-4 last:border-0">
                      <div className="flex justify-between mb-2">
                        <p className="font-body text-ivory font-semibold text-sm">
                          {idx + 1}. {product.name}
                        </p>
                        <span className="font-display text-gold font-bold">
                          {product.sales} sales
                        </span>
                      </div>
                      <p className="font-body text-silver text-xs">
                        Revenue: ₹{product.revenue.toLocaleString('en-IN')}
                      </p>
                      <div className="w-full h-1.5 bg-gold/10 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full"
                          style={{ width: `${(product.sales / analytics.topProducts[0].sales) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Source */}
              <div className="glass-card p-8">
                <p
                  className="font-body text-gold text-xs uppercase tracking-widest mb-6"
                  style={{ letterSpacing: '0.4em' }}
                >
                  Customer Source
                </p>

                <div className="space-y-5">
                  {analytics.customerSource.map(({ source, count }, idx) => {
                    const total = analytics.customerSource.reduce((sum, s) => sum + s.count, 0);
                    const percentage = ((count / total) * 100).toFixed(0);

                    return (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <p className="font-body text-ivory text-sm">{source}</p>
                          <span className="font-display text-gold font-bold">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gold/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="text-center pt-8">
              <button className="px-6 py-3 border border-gold/40 text-gold hover:bg-gold/10 transition-colors font-body text-xs uppercase tracking-widest">
                📊 Export Report
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
