import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/products';

type Props = {
  product: Product;
  delay?: number;
};

export default function ProductCard({ product, delay = 0 }: Props) {
  const navigate = useNavigate();

  return (
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
      </div>

      {/* Info panel */}
      <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
        {/* Category */}
        <p
          className="font-body text-gold text-xs uppercase mb-3 tracking-widest"
          style={{ letterSpacing: '0.3em' }}
        >
          {product.category}
        </p>

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
        <p className="font-body text-silver text-sm mb-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Price */}
        <p className="font-body text-gold text-base font-semibold mb-6">
          ₹{product.price.toLocaleString('en-IN')}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/checkout/${product.id}`)}
            className="btn-gold"
            aria-label={`Book ${product.name}`}
          >
            Book Now
          </button>
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300"
            style={{ letterSpacing: '0.2em' }}
            aria-label={`View details for ${product.name}`}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
