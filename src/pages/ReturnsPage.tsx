import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

interface Return {
  _id: string;
  orderId: string;
  productName: string;
  quantity: number;
  price: number;
  reason: string;
  description: string;
  status: 'requested' | 'approved' | 'rejected' | 'received' | 'refunded';
  refundAmount: number;
  refundedAt?: string;
  requestedAt: string;
  approvedAt?: string;
}

export default function ReturnsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchReturns();
  }, [token, navigate]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/returns', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setReturns(response.data.returns || []);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to fetch returns. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReturn = async (returnId: string) => {
    if (!window.confirm('Are you sure you want to cancel this return request?')) {
      return;
    }

    try {
      const response = await api.patch(
        `/returns/${returnId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReturns((prev) =>
          prev.map((r) =>
            r._id === returnId ? { ...r, status: 'rejected' } : r
          )
        );
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        'Failed to cancel return request'
      );
    }
  };

  const filteredReturns =
    filterStatus === 'all'
      ? returns
      : returns.filter((r) => r.status === filterStatus);

  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    requested: { bg: 'bg-blue-500/10', text: 'text-blue-300', icon: '📋' },
    approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', icon: '✅' },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-300', icon: '❌' },
    received: { bg: 'bg-purple-500/10', text: 'text-purple-300', icon: '📦' },
    refunded: { bg: 'bg-gold/10', text: 'text-gold', icon: '💰' },
  };

  const statusLabels: Record<string, string> = {
    requested: 'Requested',
    approved: 'Approved',
    rejected: 'Rejected',
    received: 'Received',
    refunded: 'Refunded',
  };

  return (
    <main className="pt-20 pb-24 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-3"
            style={{ letterSpacing: '0.4em' }}
          >
            Track & Manage
          </p>
          <h1
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 700 }}
          >
            My Returns
          </h1>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gold/20">
          {['all', 'requested', 'approved', 'received', 'refunded'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-gold text-carbon'
                  : 'bg-slate-800 text-silver hover:bg-slate-700'
              }`}
            >
              {status === 'all'
                ? `All (${returns.length})`
                : `${statusLabels[status]} (${
                    returns.filter((r) => r.status === status).length
                  })`}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded p-4 mb-8 text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-silver text-lg">Loading your returns...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredReturns.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-silver text-lg mb-2">
              {filterStatus === 'all'
                ? 'No return requests yet'
                : `No ${statusLabels[filterStatus].toLowerCase()} returns`}
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {filterStatus === 'all'
                ? 'Visit your orders to request a return if needed.'
                : 'Try a different filter to see your returns.'}
            </p>
            <button
              onClick={() => navigate('/my-orders')}
              className="px-6 py-2 bg-gold/20 border border-gold/40 text-gold hover:bg-gold/10 rounded font-semibold transition-colors"
            >
              View My Orders
            </button>
          </div>
        )}

        {/* Returns List */}
        <div className="space-y-4">
          {filteredReturns.map((returnItem) => {
            const colors = statusColors[returnItem.status];
            return (
              <div
                key={returnItem._id}
                className="glass-card p-6 hover:border-gold/40 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Product Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-ivory font-semibold text-lg mb-1">
                          {returnItem.productName}
                        </h3>
                        <p className="text-silver text-sm mb-3">
                          Qty: {returnItem.quantity} × ₹{returnItem.price.toLocaleString(
                            'en-IN'
                          )}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded text-sm font-semibold flex items-center gap-2 ${colors.bg} ${colors.text}`}
                      >
                        <span>{colors.icon}</span>
                        <span>{statusLabels[returnItem.status]}</span>
                      </div>
                    </div>

                    {/* Return Details */}
                    <div className="bg-slate-800/50 rounded p-4 mb-4">
                      <p className="text-slate-400 text-xs mb-2">REASON FOR RETURN</p>
                      <p className="text-silver capitalize">
                        {returnItem.reason.replace(/-/g, ' ')}
                      </p>
                      <p className="text-slate-400 text-xs mt-3 mb-2">DESCRIPTION</p>
                      <p className="text-silver text-sm line-clamp-2">
                        {returnItem.description}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        📅 Requested:{' '}
                        {new Date(returnItem.requestedAt).toLocaleDateString('en-IN')}
                      </span>
                      {returnItem.approvedAt && (
                        <>
                          <span>•</span>
                          <span>
                            ✅ Approved:{' '}
                            {new Date(returnItem.approvedAt).toLocaleDateString('en-IN')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions & Refund Info */}
                  <div>
                    {/* Refund Amount */}
                    {returnItem.refundAmount > 0 && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-4 mb-4">
                        <p className="text-emerald-400 text-xs font-semibold mb-1">
                          REFUND AMOUNT
                        </p>
                        <p className="text-emerald-300 text-2xl font-bold">
                          ₹{returnItem.refundAmount.toLocaleString('en-IN')}
                        </p>
                        {returnItem.refundedAt && (
                          <p className="text-emerald-400 text-xs mt-2">
                            Refunded on{' '}
                            {new Date(returnItem.refundedAt).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status-Specific Info */}
                    {returnItem.status === 'requested' && (
                      <p className="text-blue-300 text-xs mb-3">
                        ⏳ We'll review your request within 24 hours.
                      </p>
                    )}
                    {returnItem.status === 'approved' && (
                      <p className="text-emerald-300 text-xs mb-3">
                        📦 Return approved. Prepare your item for shipment.
                      </p>
                    )}
                    {returnItem.status === 'received' && (
                      <p className="text-purple-300 text-xs mb-3">
                        ✓ We received your return. Processing refund...
                      </p>
                    )}
                    {returnItem.status === 'refunded' && (
                      <p className="text-gold text-xs mb-3">
                        💰 Refund completed! Check your account.
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {returnItem.status === 'requested' && (
                        <button
                          onClick={() => handleCancelReturn(returnItem._id)}
                          className="w-full px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 rounded text-xs font-semibold transition-colors"
                        >
                          Cancel Request
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/my-orders`)}
                        className="w-full px-3 py-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/5 rounded text-xs font-semibold transition-colors"
                      >
                        View Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        {!loading && returns.length > 0 && (
          <div className="mt-12 bg-gold/5 border border-gold/20 rounded-lg p-6 text-center">
            <p className="text-silver mb-3">Need help with your return?</p>
            <a
              href="https://wa.me/917997000166"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors"
            >
              Contact Support
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
