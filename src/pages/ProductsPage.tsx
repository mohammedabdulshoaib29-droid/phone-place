import { useState, useEffect, useRef } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchFilter, { type FilterOptions } from '../components/SearchFilter';
import Breadcrumbs from '../components/Breadcrumbs';
import Product3DCarousel from '../components/Product3DCarousel';

const ALL = 'ALL';
const categories = [ALL, ...Array.from(new Set(products.map((p) => p.category)))];
const maxPrice = Math.max(...products.map((p) => p.price));

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: ALL,
    priceRange: [0, maxPrice],
    minRating: 0,
    sortBy: 'featured',
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const filtered = products
    .filter((p) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(search) ||
          p.tagline.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== ALL && p.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (p.rating < filters.minRating) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
                 (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      }
    });

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

    // Reset and re-observe on filter change
    cards.forEach((card) => {
      card.classList.remove('visible');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [filters]);

  return (
    <main className="pt-20 pb-24 px-6 md:px-12 lg:px-20 min-h-screen">
      <Breadcrumbs />

      {/* 3D Product Showcase */}
      <div className="mb-16 mt-8">
        <p
          className="font-body text-gold text-xs uppercase tracking-widest mb-4 text-center"
          style={{ letterSpacing: '0.4em' }}
        >
          Interactive Showcase
        </p>
        <Product3DCarousel products={products.slice(0, 8)} />
      </div>

      {/* Header */}
      <div className="text-center mb-12 mt-6">
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

      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <SearchFilter
          categories={categories.filter((c) => c !== ALL)}
          maxPrice={maxPrice}
          onFilterChange={setFilters}
          initialFilters={filters}
        />

        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <p className="font-body text-silver text-sm">
            Showing{' '}
            <span className="text-gold font-semibold">{filtered.length}</span> of{' '}
            <span className="text-gold font-semibold">{products.length}</span> products
          </p>
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div
            ref={sectionRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite max-w-7xl"
          >
            {filtered.map((product, i) => (
              <div key={product.id} className="bg-carbon">
                <ProductCard product={product} delay={i * 80} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-ivory text-xl mb-4">No products found</p>
            <p className="font-body text-silver mb-8">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  category: ALL,
                  priceRange: [0, maxPrice],
                  minRating: 0,
                  sortBy: 'featured',
                })
              }
              className="btn-gold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
