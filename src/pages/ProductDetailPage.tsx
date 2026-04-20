import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { products } from '../data/products';
import { getProductReviews } from '../data/reviews';
import Breadcrumbs from '../components/Breadcrumbs';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import ProductCard from '../components/ProductCard';
import AddToCartButton from '../components/AddToCartButton';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [dbReviews, setDbReviews] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const product = products.find((p) => p.id === id);
  const mockReviews = product ? getProductReviews(product.id) : [];
  const relatedProducts = product
    ? products.filter((p) => product.relatedIds.includes(p.id)).slice(0, 3)
    : [];

  // Fetch database reviews
  useEffect(() => {
    if (!product) return;

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const { data } = await api.get('/reviews', {
          params: { productId: product.id, limit: 100 },
        });
        setDbReviews(data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        // Fallback to mock reviews on error
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = contentRef.current;
    if (!el) return;
    const timer = setTimeout(() => el.classList.add('visible'), 100);
    return () => clearTimeout(timer);
  }, [id]);

  if (!product) {
    return (
      <main className="pt-40 pb-24 px-6 text-center min-h-screen flex flex-col items-center justify-center">
        <Breadcrumbs />
        <p className="font-body text-silver mb-8">Product not found.</p>
        <button onClick={() => navigate('/products')} className="btn-gold">
          View All Products
        </button>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      <Breadcrumbs />

      <section className="py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div ref={contentRef} className="fade-section">
            {/* Main Image */}
            <div className="relative mb-4 h-96 md:h-[500px] overflow-hidden rounded-lg group">
              <img
                src={product.gallery[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-silver text-xs">Hover to zoom</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.gallery.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-gold' : 'border-gold/20 hover:border-gold/40'
                    }`}
                  >
                    <img src={image} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="fade-section" style={{ transitionDelay: '100ms' }}>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.featured && (
                <span className="px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs rounded font-semibold">
                  Featured
                </span>
              )}
              {product.bestSeller && (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs rounded font-semibold">
                  Best Seller
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs rounded font-semibold">
                  New
                </span>
              )}
              <span
                className={`px-3 py-1 rounded text-xs font-semibold border ${
                  product.stockStatus === 'in-stock'
                    ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300'
                    : product.stockStatus === 'low-stock'
                      ? 'bg-amber-500/10 border-amber-400/30 text-amber-300'
                      : 'bg-red-500/10 border-red-400/30 text-red-300'
                }`}
              >
                {product.stockStatus === 'in-stock'
                  ? 'In Stock'
                  : product.stockStatus === 'low-stock'
                    ? 'Low Stock'
                    : 'Out of Stock'}
              </span>
            </div>

            {/* Category */}
            <p
              className="font-body text-gold text-xs uppercase tracking-widest mb-3"
              style={{ letterSpacing: '0.35em' }}
            >
              {product.category}
            </p>

            {/* Name */}
            <h1
              className="font-display text-ivory leading-tight mb-3"
              style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontStyle: 'italic', fontWeight: 700 }}
            >
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gold/10">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      className={i < Math.floor(product.rating) ? 'text-gold' : 'text-gold/30'}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="font-display text-gold text-lg font-semibold">{product.rating}</span>
              </div>
              <span className="font-body text-silver text-sm">
                {product.reviewCount} customer reviews
              </span>
            </div>

            {/* Tagline */}
            <p
              className="font-display text-ivory/80 text-lg md:text-xl mb-6 leading-snug"
              style={{ fontStyle: 'italic' }}
            >
              "{product.tagline}"
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <p className="font-display text-gold text-3xl font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              {product.originalPrice && (
                <>
                  <p className="font-body text-silver/50 line-through text-lg">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="font-body text-emerald-400 text-sm font-semibold">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </p>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="gold-line mb-8" />

            {/* Description */}
            <p className="font-body text-silver leading-relaxed text-sm mb-8">
              {product.description}
            </p>

            {/* Compatible Devices */}
            {product.compatibleWith.length > 0 && (
              <div className="mb-8">
                <p className="font-body text-gold text-xs uppercase tracking-widest mb-2">
                  Compatible With
                </p>
                <p className="font-body text-silver text-sm">
                  {product.compatibleWith.join(', ')}
                </p>
              </div>
            )}

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gold/10">
                <p className="font-body text-gold text-xs uppercase tracking-widest mb-3">
                  Choose Option
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.variants.map((variant, i) => (
                    <button
                      key={variant.value}
                      onClick={() => setSelectedVariant(i)}
                      className={`p-3 rounded border-2 transition-all text-sm font-semibold ${
                        selectedVariant === i
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-gold/20 text-silver hover:border-gold/40'
                      } ${
                        variant.stockStatus === 'out-of-stock'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={variant.stockStatus === 'out-of-stock'}
                    >
                      <div>{variant.label}</div>
                      {variant.price && variant.price !== product.price && (
                        <div className="text-xs mt-1 opacity-75">
                          +₹{(variant.price - product.price).toLocaleString('en-IN')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specifications.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gold/10">
                <p className="font-body text-gold text-xs uppercase tracking-widest mb-4">
                  Specifications
                </p>
                <div className="space-y-3">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="flex justify-between">
                      <p className="font-body text-silver/60 text-sm">{spec.label}</p>
                      <p className="font-body text-silver text-sm font-semibold">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <d{token ? (
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  productCategory={product.category}
                  price={product.price}
                  image={product.image}
                  selectedVariant={product.variants[selectedVariant]}
                  onSuccess={() => {
                    // Optional: show success toast or navigate to cart
                  }}
                />
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn-gold flex-1"
                  style={{ padding: '1rem 2rem' }}
                >
                  Login to Order
                </button>
              )}w
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex-1 border border-gold/30 text-silver hover:bg-gold/5 transition-colors px-6 py-4 rounded text-xs uppercase tracking-widest font-semibold"
              >
                ← Back to Collection
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-6xl mx-auto border-t border-gold/10 pt-16">
          {/* Review Form */}
          {product && (
            <ReviewForm productId={product.id} />
          )}

          {/* Reviews List */}
          {product && (
            !reviewsLoading ? (
              dbReviews?.reviews?.length > 0 ? (
                <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-8">
                  <h2 className="text-2xl font-display text-ivory mb-8">Database Reviews ({dbReviews.totalReviews})</h2>
                  {/* Display database reviews */}
                  <div className="space-y-6">
                    {dbReviews.reviews.map((review: any) => (
                      <div key={review._id} className="bg-charcoal/40 border border-gold/10 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${
                                      i < review.rating ? 'text-gold' : 'text-gold/30'
                                    }`}
                                  >
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
                              By {review.userName} • {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-silver mb-4">{review.comment}</p>
                        {review.reply && (
                          <div className="bg-charcoal/60 border-l-2 border-gold/30 rounded-lg p-4 mb-4">
                            <div className="text-xs text-gold/70 mb-2">Admin Reply:</div>
                            <p className="text-sm text-silver">{review.reply.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-8 text-center">
                  <p className="text-silver/50">No reviews yet. Be the first to review this product!</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-silver">Loading reviews...</div>
            )
          )}

          {/* Fallback: Mock Reviews */}
          {mockReviews.length > 0 && (
            <div className="mt-12 pt-12 border-t border-gold/10">
              <ReviewsList
                reviews={mockReviews}
                maxDisplay={3}
                averageRating={product?.rating || 0}
                totalReviews={product?.reviewCount || 0}
              />
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-24">
            <div className="text-center mb-16">
              <p
                className="font-body text-gold text-xs uppercase tracking-widest mb-4"
                style={{ letterSpacing: '0.4em' }}
              >
                You Might Also Like
              </p>
              <h2
                className="font-display text-ivory"
                style={{
                  fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                  fontStyle: 'italic',
                  fontWeight: 700,
                }}
              >
                Related Products
              </h2>
              <div className="gold-line mt-6 mx-auto" style={{ width: '80px' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite">
              {relatedProducts.map((p, i) => (
                <div key={p.id} className="bg-carbon">
                  <ProductCard product={p} delay={i * 80} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
