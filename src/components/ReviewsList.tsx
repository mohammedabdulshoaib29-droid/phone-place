import type { Review } from '../data/reviews';

type ReviewsListProps = {
  reviews: Review[];
  maxDisplay?: number;
  averageRating: number;
  totalReviews: number;
};

export default function ReviewsList({
  reviews,
  maxDisplay = 3,
  averageRating,
  totalReviews,
}: ReviewsListProps) {
  const displayedReviews = reviews.slice(0, maxDisplay);

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <section className="py-12 border-t border-gold/10">
      <h2 className="font-display text-ivory text-2xl mb-8" style={{ fontStyle: 'italic' }}>
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Rating Summary */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-6 border border-gold/10 rounded-lg p-6">
          <div className="text-center mb-4">
            <p className="font-display text-4xl text-gold font-bold">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex justify-center my-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={i < Math.floor(averageRating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  className={i < Math.floor(averageRating) ? 'text-gold' : 'text-gold/30'}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="font-body text-silver text-sm">
              Based on {totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="w-full space-y-2 mt-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-silver text-xs w-6">{rating}★</span>
                <div className="flex-1 h-1 bg-gold/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold"
                    style={{
                      width: `${(distribution[rating as keyof typeof distribution] / totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-silver/70 text-xs w-6 text-right">
                  {distribution[rating as keyof typeof distribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-6">
          {displayedReviews.length === 0 ? (
            <p className="text-silver text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            displayedReviews.map((review) => (
              <div
                key={review.id}
                className="border border-gold/10 rounded-lg p-6 hover:border-gold/30 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="font-display text-gold text-sm font-bold">
                        {review.avatar || review.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-ivory font-semibold">{review.author}</p>
                      <p className="font-body text-silver/60 text-xs">
                        {new Date(review.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs rounded flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        className={i < review.rating ? 'text-gold' : 'text-gold/30'}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-body text-silver text-sm font-semibold">
                    {review.title}
                  </span>
                </div>

                {/* Content */}
                <p className="font-body text-silver text-sm leading-relaxed mb-4">
                  {review.content}
                </p>

                {/* Helpful */}
                {review.helpful && (
                  <button className="font-body text-gold text-xs hover:text-gold-pale transition-colors">
                    👍 Helpful ({review.helpful})
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* View All Reviews Button */}
      {reviews.length > maxDisplay && (
        <div className="text-center">
          <button className="btn-gold">View All {reviews.length} Reviews</button>
        </div>
      )}
    </section>
  );
}
