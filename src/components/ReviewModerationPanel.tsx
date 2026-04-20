import { useState, useEffect } from 'react';
import api from '../utils/api';

interface AdminReviewStats {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  averageRating: number;
}

interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  reply?: { text: string; postedBy: string; postedAt: string };
}

interface ReviewModerationPanelProps {
  adminPin: string;
}

export default function ReviewModerationPanel({ adminPin }: ReviewModerationPanelProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'stats' | 'all'>('queue');
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<AdminReviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const headers = { 'x-admin-pin': adminPin };

  // Fetch pending reviews queue
  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/admin/reviews/queue', {
        params: { sort: sortBy, search: searchTerm },
        headers,
      });
      setPendingReviews(data.reviews);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch pending reviews');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/admin/reviews/stats', { headers });
      setStats(data.summary);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  // Approve review
  const handleApprove = async (reviewId: string, reply?: string) => {
    try {
      setSubmittingId(reviewId);
      await api.put(`/admin/reviews/${reviewId}/approve`, { reply: reply || null }, { headers });
      setPendingReviews(pendingReviews.filter((r) => r._id !== reviewId));
      setSuccess('Review approved successfully');
      setTimeout(() => setSuccess(''), 3000);
      if (stats) setStats({ ...stats, pendingReviews: stats.pendingReviews - 1 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve review');
    } finally {
      setSubmittingId(null);
    }
  };

  // Reject review
  const handleReject = async (reviewId: string, reason: string) => {
    try {
      setSubmittingId(reviewId);
      await api.put(`/admin/reviews/${reviewId}/reject`, { reason }, { headers });
      setPendingReviews(pendingReviews.filter((r) => r._id !== reviewId));
      setSuccess('Review rejected successfully');
      setTimeout(() => setSuccess(''), 3000);
      if (stats) setStats({ ...stats, pendingReviews: stats.pendingReviews - 1 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject review');
    } finally {
      setSubmittingId(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'queue') fetchQueue();
    else if (activeTab === 'stats') fetchStats();
  }, [activeTab, sortBy]);

  return (
    <div className="mt-12 pt-12 border-t border-gold/10">
      <h2 className="text-2xl font-display text-ivory mb-8">Review Moderation</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gold/10">
        {['queue', 'stats', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'queue' | 'stats' | 'all')}
            className={`px-4 py-3 font-semibold uppercase text-xs transition-all ${
              activeTab === tab
                ? 'text-gold border-b-2 border-gold'
                : 'text-silver/50 hover:text-silver'
            }`}
          >
            {tab === 'queue' && `Pending (${pendingReviews.length})`}
            {tab === 'stats' && 'Statistics'}
            {tab === 'all' && 'All Reviews'}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {/* Queue Tab */}
      {activeTab === 'queue' && (
        <div>
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search by product, user, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory placeholder-silver/50 focus:outline-none focus:border-gold"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="lowestRating">Lowest Rating</option>
              <option value="highestRating">Highest Rating</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-silver">Loading pending reviews...</div>
          ) : pendingReviews.length === 0 ? (
            <div className="text-center py-8 text-silver/50">
              No pending reviews! All reviews have been moderated.
            </div>
          ) : (
            <div className="space-y-6">
              {pendingReviews.map((review) => (
                <div key={review._id} className="bg-charcoal/40 border border-gold/20 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? 'text-gold' : 'text-gold/30'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-ivory">{review.title}</span>
                        {review.verified && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-silver/70">
                        By {review.userName} • Product: {review.productId} • {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-silver mb-6 line-clamp-3">{review.comment}</p>

                  <button
                    onClick={() =>
                      setExpandedReview(expandedReview === review._id ? null : review._id)
                    }
                    className="text-xs text-gold/70 hover:text-gold mb-4"
                  >
                    {expandedReview === review._id ? '▼ Hide Full Review' : '▶ Show Full Review'}
                  </button>

                  {expandedReview === review._id && (
                    <div className="mb-6 p-4 bg-charcoal/60 rounded-lg border border-gold/10">
                      <p className="text-sm text-silver whitespace-pre-wrap">{review.comment}</p>
                    </div>
                  )}

                  {/* Reply Section */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gold/70 mb-2">Admin Reply (Optional):</label>
                    <textarea
                      value={replyText[review._id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                      placeholder="Send a reply to the reviewer..."
                      rows={2}
                      className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-3 text-ivory placeholder-silver/50 focus:outline-none focus:border-gold resize-none"
                      maxLength={500}
                    />
                    <div className="text-xs text-silver/50 mt-1">
                      {(replyText[review._id] || '').length}/500
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(review._id, replyText[review._id])}
                      disabled={submittingId === review._id}
                      className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50 px-4 py-3 rounded-lg transition-all font-semibold text-xs uppercase"
                    >
                      {submittingId === review._id ? '...' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(review._id, 'Violates community guidelines')}
                      disabled={submittingId === review._id}
                      className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 px-4 py-3 rounded-lg transition-all font-semibold text-xs uppercase"
                    >
                      {submittingId === review._id ? '...' : '✕ Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div>
          {loading ? (
            <div className="text-center py-8 text-silver">Loading statistics...</div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-charcoal/40 border border-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gold mb-2">{stats.totalReviews}</div>
                <div className="text-xs text-silver/70 uppercase tracking-wider">Total Reviews</div>
              </div>
              <div className="bg-charcoal/40 border border-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.pendingReviews}</div>
                <div className="text-xs text-silver/70 uppercase tracking-wider">Pending</div>
              </div>
              <div className="bg-charcoal/40 border border-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.approvedReviews}</div>
                <div className="text-xs text-silver/70 uppercase tracking-wider">Approved</div>
              </div>
              <div className="bg-charcoal/40 border border-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{stats.rejectedReviews}</div>
                <div className="text-xs text-silver/70 uppercase tracking-wider">Rejected</div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
