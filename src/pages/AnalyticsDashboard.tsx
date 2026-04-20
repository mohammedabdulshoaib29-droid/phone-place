import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import api from '../utils/api';

interface SummaryMetrics {
  revenue: number;
  orderCount: number;
  newCustomers: number;
  totalCustomers: number;
  avgOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  returnRate: number;
  avgRating: number;
  period: string;
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [revenueByDay, setRevenueByDay] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [customerMetrics, setCustomerMetrics] = useState<any>(null);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = { 'x-admin-pin': 'phonePalace2025' };

  // Fetch all analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');

        const [summaryRes, revenueRes, productsRes, paymentRes, customerRes, reviewRes] =
          await Promise.all([
            api.get('/admin/analytics/summary', { params: { period: timeRange }, headers }),
            api.get('/admin/analytics/revenue-by-date', { params: { period: timeRange }, headers }),
            api.get('/admin/analytics/top-products', { params: { period: timeRange }, headers }),
            api.get('/admin/analytics/payment-methods', { params: { period: timeRange }, headers }),
            api.get('/admin/analytics/customer-metrics', { params: { period: timeRange }, headers }),
            api.get('/admin/analytics/review-stats', { headers }),
          ]);

        setSummary(summaryRes.data);
        setRevenueByDay(revenueRes.data);
        setTopProducts(productsRes.data);
        setPaymentMethods(paymentRes.data);
        setCustomerMetrics(customerRes.data);
        setReviewStats(reviewRes.data);
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchAnalytics();
  }, [timeRange]);

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
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center text-red-400">
            {error}
          </div>
        ) : summary ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Total Revenue
                </p>
                <p className="font-display text-green-500 text-3xl font-bold">
                  ₹{(summary.revenue / 1000).toFixed(1)}K
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  {summary.orderCount} orders
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Total Orders
                </p>
                <p className="font-display text-blue-500 text-3xl font-bold">{summary.orderCount}</p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  +{summary.newCustomers} new customers
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Customers
                </p>
                <p className="font-display text-purple-500 text-3xl font-bold">
                  {summary.totalCustomers}
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  Total unique
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Avg Order Value
                </p>
                <p className="font-display text-gold text-3xl font-bold">
                  ₹{summary.avgOrderValue.toLocaleString('en-IN')}
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  Per transaction
                </p>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">
                  Avg Rating
                </p>
                <p className="font-display text-yellow-500 text-3xl font-bold">
                  {summary.avgRating.toFixed(1)}★
                </p>
                <p className="font-body text-silver/50 text-xs mt-2">
                  From reviews
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
                {revenueByDay.length > 0 ? (
                  <>
                    {(() => {
                      const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1);
                      return revenueByDay.map(({ date, revenue, orders }) => (
                        <div key={date}>
                          <div className="flex justify-between mb-2">
                            <span className="font-body text-silver text-xs">{date}</span>
                            <span className="font-display text-gold font-bold text-sm">
                              ₹{revenue.toLocaleString('en-IN')} ({orders} orders)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gold/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-all duration-500"
                              style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                            />
                          </div>
                        </div>
                      ));
                    })()}
                  </>
                ) : (
                  <p className="text-silver/50 text-sm">No revenue data for this period</p>
                )}
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
                  {topProducts.length > 0 ? (
                    <>
                      {(() => {
                        const maxSales = Math.max(...topProducts.map((p) => p.sales), 1);
                        return topProducts.map((product, idx) => (
                          <div key={idx} className="border-b border-gold/10 pb-4 last:border-0">
                            <div className="flex justify-between mb-2">
                              <p className="font-body text-ivory font-semibold text-sm">
                                {idx + 1}. {product.name}
                              </p>
                              <span className="font-display text-gold font-bold text-sm">
                                {product.sales} sales
                              </span>
                            </div>
                            <p className="font-body text-silver text-xs">
                              Revenue: ₹{product.revenue.toLocaleString('en-IN')} | Qty: {product.quantity}
                            </p>
                            <div className="w-full h-1.5 bg-gold/10 rounded-full mt-2 overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full"
                                style={{ width: `${(product.sales / maxSales) * 100}%` }}
                              />
                            </div>
                          </div>
                        ));
                      })()}
                    </>
                  ) : (
                    <p className="text-silver/50 text-sm">No product data available</p>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="glass-card p-8">
                <p
                  className="font-body text-gold text-xs uppercase tracking-widest mb-6"
                  style={{ letterSpacing: '0.4em' }}
                >
                  Payment Methods
                </p>

                <div className="space-y-5">
                  {paymentMethods.length > 0 ? (
                    <>
                      {(() => {
                        const total = paymentMethods.reduce((sum, p) => sum + p.count, 0);
                        return paymentMethods.map(({ _id, count, revenue }, idx) => {
                          const percentage = ((count / total) * 100).toFixed(0);
                          return (
                            <div key={idx}>
                              <div className="flex justify-between mb-2">
                                <p className="font-body text-ivory text-sm capitalize">
                                  {_id === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                </p>
                                <span className="font-display text-gold font-bold text-sm">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <p className="font-body text-silver text-xs mb-2">
                                Revenue: ₹{revenue.toLocaleString('en-IN')}
                              </p>
                              <div className="w-full h-2 bg-gold/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </>
                  ) : (
                    <p className="text-silver/50 text-sm">No payment data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer & Review Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Customer Metrics */}
              {customerMetrics && (
                <div className="glass-card p-8">
                  <p
                    className="font-body text-gold text-xs uppercase tracking-widest mb-6"
                    style={{ letterSpacing: '0.4em' }}
                  >
                    Customer Metrics
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-silver text-xs uppercase mb-1">New Customers</p>
                      <p className="font-display text-3xl text-gold font-bold">
                        {customerMetrics.newCustomers}
                      </p>
                    </div>
                    <div className="border-t border-gold/10 pt-4">
                      <p className="font-body text-silver text-xs uppercase mb-1">Repeat Customers</p>
                      <p className="font-display text-3xl text-green-500 font-bold">
                        {customerMetrics.repeatCustomers}
                      </p>
                      <p className="font-body text-silver text-xs mt-1">
                        Repeat Rate: {customerMetrics.repeatRate}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Stats */}
              {reviewStats && (
                <div className="glass-card p-8">
                  <p
                    className="font-body text-gold text-xs uppercase tracking-widest mb-6"
                    style={{ letterSpacing: '0.4em' }}
                  >
                    Review Statistics
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-silver text-xs uppercase mb-1">Avg Rating</p>
                      <p className="font-display text-3xl text-yellow-500 font-bold">
                        {reviewStats.averageRating}★
                      </p>
                    </div>
                    <div className="border-t border-gold/10 pt-4 space-y-2">
                      <div className="flex justify-between text-xs font-body">
                        <span className="text-silver">Approved:</span>
                        <span className="text-emerald-400 font-semibold">{reviewStats.totalReviews}</span>
                      </div>
                      <div className="flex justify-between text-xs font-body">
                        <span className="text-silver">Pending:</span>
                        <span className="text-yellow-400 font-semibold">{reviewStats.pendingReviews}</span>
                      </div>
                      <div className="flex justify-between text-xs font-body">
                        <span className="text-silver">Rejected:</span>
                        <span className="text-red-400 font-semibold">{reviewStats.rejectedReviews}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              {summary && (
                <div className="glass-card p-8">
                  <p
                    className="font-body text-gold text-xs uppercase tracking-widest mb-6"
                    style={{ letterSpacing: '0.4em' }}
                  >
                    Quick Stats
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-silver text-xs uppercase mb-1">Completed Orders</p>
                      <p className="font-display text-3xl text-green-500 font-bold">
                        {summary.completedOrders}
                      </p>
                    </div>
                    <div className="border-t border-gold/10 pt-4">
                      <p className="font-body text-silver text-xs uppercase mb-1">Return Rate</p>
                      <p className="font-display text-2xl text-red-400 font-bold">
                        {summary.returnRate}%
                      </p>
                      <p className="font-body text-silver text-xs mt-1">
                        Pending: {summary.pendingOrders}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
