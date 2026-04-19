import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { products } from '../data/products';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const product = products.find((p) => p.id === id);

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
        <p className="font-body text-silver mb-8">Product not found.</p>
        <button onClick={() => navigate('/products')} className="btn-gold">
          View All Products
        </button>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      {/* Full-width hero image */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/50 to-transparent" />
      </div>

      {/* Detail section */}
      <section
        ref={contentRef}
        className="py-20 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto fade-section"
      >
        {/* Category */}
        <p
          className="font-body text-gold text-xs uppercase tracking-widest mb-4"
          style={{ letterSpacing: '0.35em' }}
        >
          {product.category}
        </p>

        {/* Name */}
        <h1
          className="font-display text-ivory leading-tight mb-4"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontStyle: 'italic', fontWeight: 700 }}
        >
          {product.name}
        </h1>

        {/* Price */}
        <p className="font-body text-gold text-2xl font-semibold mb-6">
          ₹{product.price.toLocaleString('en-IN')}
        </p>

        {/* Divider */}
        <div className="gold-line mb-8" style={{ maxWidth: '120px' }} />

        {/* Tagline */}
        <p
          className="font-display text-ivory/80 text-xl md:text-2xl mb-6 leading-snug"
          style={{ fontStyle: 'italic' }}
        >
          "{product.tagline}"
        </p>

        {/* Description */}
        <p className="font-body text-silver leading-relaxed text-sm md:text-base mb-14">
          {product.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <button
            onClick={() => navigate(`/checkout/${product.id}`)}
            className="btn-gold"
            style={{ padding: '1rem 3rem' }}
          >
            Book Now
          </button>
          <button
            onClick={() => navigate('/products')}
            className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300 py-4"
            style={{ letterSpacing: '0.2em' }}
          >
            ← Back to Collection
          </button>
        </div>
      </section>
    </main>
  );
}
