import { useState, useEffect, useRef } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const ALL = 'ALL';
const categories = [ALL, ...Array.from(new Set(products.map((p) => p.category)))];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === ALL ? products : products.filter((p) => p.category === activeCategory);

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
      { threshold: 0.08 }
    );

    // Reset and re-observe on category change
    cards.forEach((card) => {
      card.classList.remove('visible');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [activeCategory]);

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:px-20 min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <p
          className="font-body text-gold text-xs uppercase tracking-widest mb-4"
          style={{ letterSpacing: '0.4em' }}
        >
          Our Collection
        </p>
        <h1
          className="font-display text-ivory"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontStyle: 'italic', fontWeight: 700 }}
        >
          All Products
        </h1>
        <div className="gold-line mt-6 mx-auto" style={{ width: '80px' }} />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-body text-xs uppercase px-6 py-3 border transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-gold text-carbon border-gold'
                : 'border-gold/30 text-silver hover:border-gold hover:text-gold'
            }`}
            style={{ letterSpacing: '0.2em' }}
          >
            {cat === ALL ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div
        ref={sectionRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite max-w-7xl mx-auto"
      >
        {filtered.map((product, i) => (
          <div key={product.id} className="bg-carbon">
            <ProductCard product={product} delay={i * 80} />
          </div>
        ))}
      </div>
    </main>
  );
}
