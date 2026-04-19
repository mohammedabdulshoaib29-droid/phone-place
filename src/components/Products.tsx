import { useEffect, useRef } from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';

export default function Products() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.fade-section');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="collection" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      {/* Section header */}
      <div className="text-center mb-20">
        <p
          className="font-body text-gold text-xs uppercase tracking-widest mb-4"
          style={{ letterSpacing: '0.4em' }}
        >
          Our Collection
        </p>
        <h2
          className="font-display text-ivory"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontStyle: 'italic',
            fontWeight: 700,
          }}
        >
          The Pinnacle of Mobile Luxury
        </h2>
        <div className="gold-line mt-6 mx-auto" style={{ width: '80px' }} />
      </div>

      {/* 2×2 product grid */}
      <div
        ref={sectionRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite max-w-7xl mx-auto"
      >
        {products.map((product, i) => (
          <div key={product.id} className="bg-carbon">
            <ProductCard product={product} delay={i * 120} />
          </div>
        ))}
      </div>
    </section>
  );
}
