import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Please login to submit a review');
      return;
    }

    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (comment.length < 10) {
      setError('Comment must be at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data } = await api.post('/reviews', {
        productId,
        rating,
        title,
        comment,
        userName: user?.name || 'Anonymous Customer',
      });

      setSuccess(data.message);
      setTitle('');
      setComment('');
      setRating(5);
      setExpanded(false);

      setTimeout(() => {
        setSuccess('');
        onReviewSubmitted?.();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-6 mb-8">
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-left flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold text-ivory mb-1">Share Your Experience</h3>
            <p className="text-sm text-silver/70">
              {token ? 'Have you used this product? Leave a review!' : 'Login to share your review'}
            </p>
          </div>
          <span className="text-2xl text-gold">✎</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display text-ivory">Submit Your Review</h3>
        <button
          onClick={() => setExpanded(false)}
          className="text-silver/50 hover:text-silver text-2xl"
        >
          ✕
        </button>
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

      {!token ? (
        <div className="text-center py-8 bg-charcoal/40 border border-gold/10 rounded-lg">
          <p className="text-silver mb-4">Please login to submit a review</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded-lg transition-all"
          >
            Login
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-ivory mb-3">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-colors ${
                    star <= rating ? 'text-gold' : 'text-gold/20'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-xs text-silver/70 mt-2">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-ivory mb-2">
              Review Title * ({title.length}/100)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              placeholder="Summarize your experience in a few words"
              maxLength={100}
              className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-3 text-ivory placeholder-silver/50 focus:outline-none focus:border-gold"
              required
            />
            <p className="text-xs text-silver/70 mt-1">Minimum 5 characters</p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-ivory mb-2">
              Your Review * ({comment.length}/1000)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 1000))}
              placeholder="Share your detailed experience with this product..."
              maxLength={1000}
              rows={5}
              className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-3 text-ivory placeholder-silver/50 focus:outline-none focus:border-gold resize-none"
              required
            />
            <p className="text-xs text-silver/70 mt-1">Minimum 10 characters, maximum 1000</p>
          </div>

          {/* Info */}
          <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-4">
            <p className="text-xs text-silver/70">
              💡 <strong>Tips for helpful reviews:</strong> Be specific about what you liked or disliked,
              mention how you use the product, and share relevant details.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gold/20 text-gold hover:bg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-all font-semibold"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                setTitle('');
                setComment('');
                setRating(5);
                setError('');
              }}
              className="flex-1 bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 px-6 py-3 rounded-lg transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
