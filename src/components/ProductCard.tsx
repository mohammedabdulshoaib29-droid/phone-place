import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/products';
import QuickViewModal from './QuickViewModal';
import AddToCartButton from './AddToCartButton';
import { useAuth } from '../hooks/useAuth';

type Props = {
  product: Product;
  delay?: number;
  onQuickView?: (product: Product) => void;
};

export default function ProductCard({ product, delay = 0 }: Props) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [showQuickView, setShowQuickView] = useState(false);

  return (
    <>
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />

      <div
        className="relative group overflow-hidden cursor-pointer fade-section"
        style={{ transitionDelay: `${delay}ms` }}
      >
        {/* Product Image */}
        <div className="relative h-[480px] md:h-[580px] overflow-hidden">
          <img
            src={product.image}
            alt={`${product.name} — ${product.attribution}`}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/50 to-transparent" />
          {/* Gold border reveal on hover */}
          <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-700" />

          {/* Badges - Top Left */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.featured && (
              <span className="px-3 py-1 bg-gold/20 border border-gold/40 text-gold text-xs rounded font-semibold">
                Featured
              </span>
            )}
            {product.bestSeller && (
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs rounded font-semibold">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs rounded font-semibold">
                New
              </span>
            )}
          </div>

          {/* Stock Status Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`text-xs px-3 py-1 rounded border font-semibold ${
                product.stockStatus === 'in-stock'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  : product.stockStatus === 'low-stock'
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    : 'bg-red-500/20 border-red-400/40 text-red-300'
              }`}
            >
              {product.stockStatus === 'in-stock'
                ? 'In Stock'
                : product.stockStatus === 'low-stock'
                  ? 'Low Stock'
                  : 'Out of Stock'}
            </span>
          </div>

          {/* Quick View Button - Center */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label={`Quick view ${product.name}`}
          >
            <div className="bg-gold/10 backdrop-blur-sm border border-gold/40 rounded-lg px-6 py-3 text-gold font-semibold text-sm uppercase tracking-wider">
              Quick View
            </div>
          </button>
        </div>

        {/* Info panel */}
        <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between mb-3">
            <p
              className="font-body text-gold text-xs uppercase tracking-widest"
              style={{ letterSpacing: '0.3em' }}
            >
              {product.category}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    className={i < Math.floor(product.rating) ? 'text-gold' : 'text-gold/30'}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-gold text-xs">{product.rating}</span>
              <span className="text-silver/60 text-xs">({product.reviewCount})</span>
            </div>
          </div>

          {/* Thin gold line */}
          <div
            className="mb-4"
            style={{
              height: '1px',
              width: '40px',
              background: 'linear-gradient(90deg, #C9A84C, transparent)',
            }}
          />

          {/* Name */}
          <h3
            className="font-display text-ivory text-2xl md:text-3xl leading-tight mb-2"
            style={{ fontStyle: 'italic', fontWeight: 700 }}
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="font-body text-silver text-sm mb-3 leading-relaxed">
            {product.tagline}
          </p>

          {/* Variants Preview */}
          {product.variants.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {product.variants.slice(0, 3).map((v) => (
                <span
                  key={v.value}
                  className="px-2 py-1 bg-gold/10 border border-gold/20 text-silver text-xs rounded"
                >
                  {v.label}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="px-2 py-1 text-gold text-xs">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <p className="font-body text-gold text-base font-semibold">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            {product.originalPrice && (
              <p className="font-body text-silver/50 line-through text-sm">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {token ? (
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                productCategory={product.category}
                price={product.price}
                image={product.image}
                selectedVariant={product.variants[0]}
              />
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-gold flex-1"
                aria-label={`Login to book ${product.name}`}
              >
                Login to Buy
              </button>
            )}
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300 flex-1"
              style={{ letterSpacing: '0.2em' }}
              aria-label={`View details for ${product.name}`}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
