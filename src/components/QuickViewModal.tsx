import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/products';

type QuickViewProps = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
};

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-carbon/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-charcoal border border-gold/20 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gold/10 sticky top-0 bg-charcoal">
            <h2 className="font-display text-ivory text-xl" style={{ fontStyle: 'italic' }}>
              Quick View
            </h2>
            <button
              onClick={onClose}
              className="text-silver hover:text-gold transition-colors"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image */}
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Info */}
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex items-center gap-3">
                <p className="font-body text-gold text-xs uppercase tracking-widest">
                  {product.category}
                </p>
                {product.featured && (
                  <span className="px-2 py-1 bg-gold/10 border border-gold/30 text-gold text-xs rounded">
                    Featured
                  </span>
                )}
                {product.bestSeller && (
                  <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs rounded">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Name */}
              <h3
                className="font-display text-ivory text-2xl"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                {product.name}
              </h3>

              {/* Tagline */}
              <p className="font-body text-silver text-sm">{product.tagline}</p>

              {/* Rating & Stock */}
              <div className="flex items-center justify-between py-3 border-y border-gold/10">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        className={
                          i < Math.floor(product.rating) ? 'text-gold' : 'text-gold/30'
                        }
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gold text-xs">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    product.stockStatus === 'in-stock'
                      ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-300'
                      : product.stockStatus === 'low-stock'
                        ? 'bg-amber-500/10 border-amber-400/40 text-amber-300'
                        : 'bg-red-500/10 border-red-400/40 text-red-300'
                  }`}
                >
                  {product.stockStatus === 'in-stock'
                    ? 'In Stock'
                    : product.stockStatus === 'low-stock'
                      ? 'Low Stock'
                      : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <p className="font-display text-gold text-2xl font-semibold">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                {product.originalPrice && (
                  <p className="font-body text-silver/50 line-through text-sm">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Variants Preview */}
              {product.variants.length > 0 && (
                <div>
                  <p className="font-body text-silver text-xs uppercase mb-2 tracking-widest">
                    Available Options: {product.variants.length} variants
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.slice(0, 3).map((v) => (
                      <span
                        key={v.value}
                        className="px-3 py-1 bg-gold/5 border border-gold/20 text-silver text-xs rounded"
                      >
                        {v.label}
                      </span>
                    ))}
                    {product.variants.length > 3 && (
                      <span className="px-3 py-1 text-gold text-xs">
                        +{product.variants.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Compatible Devices */}
              {product.compatibleWith.length > 0 && (
                <div>
                  <p className="font-body text-silver text-xs uppercase mb-2 tracking-widest">
                    Compatible With
                  </p>
                  <p className="font-body text-silver text-sm">
                    {product.compatibleWith.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gold/10">
              <button
                onClick={() => {
                  navigate(`/product/${product.id}`);
                  onClose();
                }}
                className="btn-gold flex-1"
              >
                View Details
              </button>
              <button
                onClick={() => {
                  navigate(`/checkout/${product.id}`);
                  onClose();
                }}
                className="flex-1 border border-gold/30 text-silver hover:bg-gold/5 transition-colors px-4 py-2 rounded text-xs uppercase tracking-widest font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
