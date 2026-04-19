import { useState } from 'react';

export type FilterOptions = {
  search: string;
  category: string;
  priceRange: [number, number];
  minRating: number;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
};

type SearchFilterProps = {
  categories: string[];
  maxPrice: number;
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
};

export default function SearchFilter({
  categories,
  maxPrice,
  onFilterChange,
  initialFilters = {
    search: '',
    category: 'ALL',
    priceRange: [0, maxPrice],
    minRating: 0,
    sortBy: 'featured',
  },
}: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={filters.search}
            onChange={(e) => handleChange({ search: e.target.value })}
            className="input-luxury w-full pl-4 pr-10"
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-silver/60"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="md:hidden w-full flex items-center justify-between py-3 px-4 border border-gold/20 rounded-lg mb-4"
      >
        <span className="font-body text-silver text-xs uppercase tracking-widest">Filters & Sort</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`text-gold transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Desktop Filters / Mobile Expanded */}
      <div
        className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${
          !expanded && 'md:flex hidden'
        }`}
      >
        {/* Sort */}
        <div>
          <label className="font-body text-silver text-xs uppercase tracking-widest block mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              handleChange({
                sortBy: e.target.value as FilterOptions['sortBy'],
              })
            }
            className="w-full bg-transparent border border-gold/20 text-silver text-sm px-3 py-2 rounded focus:border-gold/40 outline-none transition-colors"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="font-body text-silver text-xs uppercase tracking-widest block mb-3">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange({ category: e.target.value })}
            className="w-full bg-transparent border border-gold/20 text-silver text-sm px-3 py-2 rounded focus:border-gold/40 outline-none transition-colors"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="font-body text-silver text-xs uppercase tracking-widest block mb-3">
            Price Range
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleChange({
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="w-full accent-gold"
            />
            <div className="flex gap-2 text-xs text-silver">
              <span>₹0</span>
              <span>—</span>
              <span>₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="font-body text-silver text-xs uppercase tracking-widest block mb-3">
            Min. Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleChange({ minRating: Number(e.target.value) })}
            className="w-full bg-transparent border border-gold/20 text-silver text-sm px-3 py-2 rounded focus:border-gold/40 outline-none transition-colors"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4★ & above</option>
            <option value={4.5}>4.5★ & above</option>
            <option value={5}>5★ only</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(filters.search ||
        filters.category !== 'ALL' ||
        filters.priceRange[1] < maxPrice ||
        filters.minRating > 0) && (
        <button
          onClick={() => {
            const reset: FilterOptions = {
              search: '',
              category: 'ALL',
              priceRange: [0, maxPrice],
              minRating: 0,
              sortBy: 'featured',
            };
            setFilters(reset);
            onFilterChange(reset);
          }}
          className="mt-4 font-body text-gold text-xs uppercase tracking-widest hover:text-gold-pale transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
