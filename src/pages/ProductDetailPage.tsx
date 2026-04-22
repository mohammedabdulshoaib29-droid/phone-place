import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import { getProductReviews } from '../data/reviews';
import Breadcrumbs from '../components/Breadcrumbs';
import ReviewsList from '../components/ReviewsList';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, error: cartError } = useCart();

  const pageRef = useRef<HTMLElement>(null);
  const actionPanelRef = useRef<HTMLDivElement>(null);
  const mobileNoticeTimerRef = useRef<number | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [cartNotice, setCartNotice] = useState('');
  const [showMobileBar, setShowMobileBar] = useState(true);

  const product = products.find((p) => p.id === id);
  const reviews = product ? getProductReviews(product.id) : [];
  const relatedProducts = product
    ? products.filter((p) => product.relatedIds.includes(p.id)).slice(0, 3)
    : [];

  const activeVariant = product?.variants[selectedVariant];
  const activePrice = activeVariant?.price ?? product?.price ?? 0;
  const activeStock = activeVariant?.stockStatus ?? product?.stockStatus ?? 'out-of-stock';
  const savings = product?.originalPrice ? product.originalPrice - activePrice : 0;

  const featureSummary = useMemo(
    () =>
      product
        ? [
            { label: 'Ships with', value: 'Secure packaging and compatibility check' },
            { label: 'Support', value: 'WhatsApp and phone help before checkout' },
            { label: 'Ideal for', value: product.compatibleWith.slice(0, 2).join(', ') || 'Most recent phones' },
          ]
        : [],
    [product]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedVariant(0);
    setCartNotice('');
  }, [id]);

  useEffect(() => {
    const panel = actionPanelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileBar(!entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, [product?.id]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-detail-hero]',
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' }
        );

        gsap.fromTo(
          '[data-detail-card]',
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.1,
          }
        );

        gsap.utils.toArray<HTMLElement>('[data-detail-reveal]').forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                once: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-image-parallax]').forEach((image) => {
          gsap.fromTo(
            image,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: image,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });
      }, page);

      return () => ctx.revert();
    });

    return () => media.revert();
  }, [product?.id]);

  useEffect(() => {
    return () => {
      if (mobileNoticeTimerRef.current) {
        window.clearTimeout(mobileNoticeTimerRef.current);
      }
    };
  }, []);

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-40 text-center">
        <Breadcrumbs />
        <p className="mb-8 font-body text-silver">Product not found.</p>
        <button onClick={() => navigate('/products')} className="btn-gold">
          View All Products
        </button>
      </main>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (activeStock === 'out-of-stock') {
      setCartNotice('This option is currently out of stock.');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(
        product.id,
        product.name,
        product.category,
        activePrice,
        1,
        activeVariant ? { label: activeVariant.label, value: activeVariant.value } : undefined,
        product.image
      );
      setCartNotice(`${product.name} added to cart.`);
      if (mobileNoticeTimerRef.current) {
        window.clearTimeout(mobileNoticeTimerRef.current);
      }
      mobileNoticeTimerRef.current = window.setTimeout(() => setCartNotice(''), 2600);
    } catch {
      // Error is surfaced through cartError.
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <main ref={pageRef} className="min-h-screen pb-32 pt-20 md:pb-20">
      <Breadcrumbs />

      <section className="px-5 py-10 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div
              data-detail-hero
              className="performance-layer relative overflow-hidden rounded-[2.25rem] border border-gold/10 bg-charcoal/50 opacity-0"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.14),transparent_26%)]" />
              <div className="relative h-[420px] overflow-hidden md:h-[560px]">
                <img
                  data-image-parallax
                  src={product.gallery[selectedImage] || product.image}
                  alt={product.name}
                  className="h-[110%] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/55 via-carbon/10 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full border border-gold/20 bg-carbon/75 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold">
                  Swipe-ready product media
                </div>
              </div>
            </div>

            {product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-[1.2rem] border transition-all ${
                      selectedImage === index
                        ? 'border-gold shadow-lg shadow-gold/10'
                        : 'border-gold/10'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-20 w-full object-cover md:h-24"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div data-detail-card className="performance-layer opacity-0">
              <div className="mb-4 flex flex-wrap gap-2">
                {product.featured && (
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    Featured
                  </span>
                )}
                {product.bestSeller && (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Best Seller
                  </span>
                )}
                {product.isNew && (
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                    New
                  </span>
                )}
                <span className="rounded-full border border-gold/15 bg-charcoal/70 px-3 py-1 text-xs font-semibold text-silver">
                  {activeStock === 'in-stock'
                    ? 'In Stock'
                    : activeStock === 'low-stock'
                      ? 'Low Stock'
                      : 'Out of Stock'}
                </span>
              </div>

              <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
                {product.category}
              </p>
              <h1
                className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] text-ivory md:text-6xl"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                {product.name}
              </h1>
              <p className="mt-5 max-w-2xl font-body text-base leading-8 text-silver">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-5 border-b border-gold/10 pb-6 text-sm text-silver">
                <span>{product.rating} rating</span>
                <span>{product.reviewCount} verified reviews</span>
                <span>{product.compatibleWith.length} compatibility targets</span>
              </div>
            </div>

            <div
              ref={actionPanelRef}
              data-detail-card
              className="performance-layer sticky top-24 rounded-[2rem] border border-gold/10 bg-charcoal/70 p-6 opacity-0 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-[0.24em] text-gold">
                      Sticky purchase panel
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <p className="font-display text-3xl text-ivory" style={{ fontWeight: 700 }}>
                        Rs. {activePrice.toLocaleString('en-IN')}
                      </p>
                      {product.originalPrice && (
                        <p className="text-sm text-silver/50 line-through">
                          Rs. {product.originalPrice.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                    {product.originalPrice && savings > 0 && (
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-300">
                        Save Rs. {savings.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/checkout/${product.id}`)}
                    className="rounded-full border border-gold/20 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-gold"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {featureSummary.map((item) => (
                    <div key={item.label} className="rounded-[1.3rem] border border-white/8 bg-carbon/60 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-silver">{item.value}</p>
                    </div>
                  ))}
                </div>

                {product.variants.length > 0 && (
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.26em] text-gold">
                      Choose Option
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {product.variants.map((variant, index) => {
                        const isActive = selectedVariant === index;
                        const isOut = variant.stockStatus === 'out-of-stock';
                        const variantPrice = variant.price ?? product.price;

                        return (
                          <button
                            key={variant.value}
                            type="button"
                            onClick={() => setSelectedVariant(index)}
                            disabled={isOut}
                            className={`rounded-[1.2rem] border px-4 py-4 text-left transition-all ${
                              isActive
                                ? 'border-gold bg-gold/10'
                                : 'border-gold/10 bg-carbon/55'
                            } ${isOut ? 'cursor-not-allowed opacity-45' : ''}`}
                          >
                            <div className="text-sm text-ivory">{variant.label}</div>
                            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-silver">
                              Rs. {variantPrice.toLocaleString('en-IN')}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding || activeStock === 'out-of-stock'}
                    className="flex-1 rounded-full bg-gold px-6 py-4 text-xs uppercase tracking-[0.24em] text-carbon transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAdding ? 'Adding...' : 'Add To Cart'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    className="flex-1 rounded-full border border-gold/15 px-6 py-4 text-xs uppercase tracking-[0.24em] text-silver"
                  >
                    Back To Collection
                  </button>
                </div>

                {(cartNotice || cartError) && (
                  <p className={`text-sm ${cartError ? 'text-red-300' : 'text-emerald-300'}`}>
                    {cartError || cartNotice}
                  </p>
                )}
              </div>
            </div>

            <div
              data-detail-reveal
              className="performance-layer rounded-[2rem] border border-gold/10 bg-charcoal/50 p-6 opacity-0"
            >
              <p className="text-[11px] uppercase tracking-[0.26em] text-gold">Product Story</p>
              <p className="mt-4 text-sm leading-8 text-silver">"{product.tagline}"</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.compatibleWith.map((device) => (
                  <span
                    key={device}
                    className="rounded-full border border-gold/12 bg-carbon/70 px-4 py-2 text-xs text-silver"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>

            {product.specifications.length > 0 && (
              <div
                data-detail-reveal
                className="performance-layer rounded-[2rem] border border-gold/10 bg-charcoal/50 p-6 opacity-0"
              >
                <p className="mb-4 text-[11px] uppercase tracking-[0.26em] text-gold">
                  Specifications
                </p>
                <div className="space-y-3">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4 border-b border-gold/5 pb-3">
                      <p className="text-sm text-silver/70">{spec.label}</p>
                      <p className="text-right text-sm font-semibold text-ivory">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <div
            data-detail-reveal
            className="performance-layer mx-auto mt-20 max-w-6xl border-t border-gold/10 pt-14 opacity-0"
          >
            <ReviewsList
              reviews={reviews}
              maxDisplay={3}
              averageRating={product.rating}
              totalReviews={product.reviewCount}
            />
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div className="mx-auto mt-20 max-w-6xl">
            <div data-detail-reveal className="performance-layer mb-12 text-center opacity-0">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">You Might Also Like</p>
              <h2
                className="mt-4 font-display text-4xl text-ivory"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                Complete the cart with matching picks
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px bg-graphite md:grid-cols-3">
              {relatedProducts.map((item, index) => (
                <div key={item.id} className="bg-carbon">
                  <ProductCard product={item} delay={index * 90} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {showMobileBar && (
        <div className="mobile-safe-bottom fixed inset-x-4 bottom-4 z-40 md:hidden">
          <div className="rounded-[1.5rem] border border-gold/15 bg-charcoal/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Quick add</p>
                <p className="mt-1 text-lg font-semibold text-ivory">
                  Rs. {activePrice.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/checkout/${product.id}`)}
                className="text-[11px] uppercase tracking-[0.22em] text-silver"
              >
                Buy now
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || activeStock === 'out-of-stock'}
              className="w-full rounded-full bg-gold px-6 py-4 text-xs uppercase tracking-[0.24em] text-carbon transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add To Cart'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
