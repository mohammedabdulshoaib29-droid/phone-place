import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredProducts, products } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

const trustStats = [
  { label: 'Orders packed daily', value: '120+' },
  { label: 'Repair quote response', value: '15 min' },
  { label: 'Average product rating', value: '4.8/5' },
];

const categoryChips = [
  'Cases and Covers',
  'Fast Chargers',
  'Tempered Glass',
  'Wireless Audio',
  'Power Banks',
];

const merchHighlights = [
  {
    eyebrow: 'Fast-moving accessories',
    title: 'Built for quick thumb-scrolling on mobile',
    copy:
      'Large touch targets, crisp pricing, and concise copy keep the purchase path clean whether the user lands from Instagram, Maps, or WhatsApp.',
  },
  {
    eyebrow: 'Performance-minded motion',
    title: 'Scroll animation that stays smooth',
    copy:
      'The page uses GSAP ScrollTrigger with scrubbed transforms, batched reveals, and cleanup on unmount so the storefront feels premium without feeling heavy.',
  },
];

const serviceBlocks = [
  {
    title: 'Delivery and pickup',
    copy: 'Local delivery, store pickup, and doorstep repair booking from the same navigation.',
  },
  {
    title: 'Real compatibility',
    copy: 'Cases, glass, and chargers are grouped by real device fit instead of vague catalog names.',
  },
  {
    title: 'Faster conversion',
    copy: 'Sticky product CTA, scannable pricing, and trust details stay close to the thumb zone.',
  },
];

export default function HomePage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '[data-hero-copy]',
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }
        );

        gsap.fromTo(
          '[data-hero-card]',
          { autoAlpha: 0, y: 42, rotate: -3 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.15,
          }
        );

        gsap.utils.toArray<HTMLElement>('[data-parallax-layer]').forEach((layer, index) => {
          gsap.to(layer, {
            yPercent: -10 - index * 6,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-hero]',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        });

        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 85%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.12,
              overwrite: true,
            }),
        });

        gsap.utils.toArray<HTMLElement>('[data-media-parallax]').forEach((mediaLayer) => {
          gsap.fromTo(
            mediaLayer,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: mediaLayer,
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
  }, []);

  return (
    <main ref={pageRef} className="overflow-hidden pb-16">
      <section
        data-hero
        className="relative min-h-screen overflow-hidden px-5 pb-20 pt-28 md:px-12 lg:px-20"
      >
        <div className="hero-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.24),transparent_32%),radial-gradient(circle_at_70%_25%,rgba(66,153,225,0.16),transparent_22%),linear-gradient(180deg,#0d0d0d_0%,#0d0d0d_35%,#111111_100%)]" />
        <div
          data-parallax-layer
          className="performance-layer absolute -right-20 top-24 h-56 w-56 rounded-full bg-gold/15 blur-3xl md:h-72 md:w-72"
        />
        <div
          data-parallax-layer
          className="performance-layer absolute -left-16 top-[38%] h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div data-hero-copy className="performance-layer">
            <p className="mb-5 font-body text-[11px] uppercase tracking-[0.42em] text-gold">
              Mobile E-Commerce Experience
            </p>
            <h1
              className="max-w-3xl font-display text-5xl leading-[0.92] text-ivory md:text-7xl"
              style={{ fontStyle: 'italic', fontWeight: 700 }}
            >
              Shop accessories with cinematic motion and a checkout path built for phones.
            </h1>
            <p className="mt-6 max-w-2xl font-body text-sm leading-8 text-silver md:text-base">
              Phone Palace now leads with product discovery: parallax hero visuals, scroll-reveal
              merchandising, and mobile-friendly action zones that help customers browse and buy
              without friction.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="btn-gold text-center">
                Shop Collection
              </Link>
              <Link
                to="/book-repair"
                className="rounded-full border border-gold/20 px-6 py-4 text-center text-xs uppercase tracking-[0.24em] text-gold transition-colors hover:bg-gold/10"
              >
                Book Repair
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {categoryChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-gold/15 bg-charcoal/70 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-silver"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {trustStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.75rem] border border-gold/10 bg-charcoal/60 p-5 backdrop-blur-md"
                >
                  <p className="font-display text-3xl text-ivory" style={{ fontWeight: 700 }}>
                    {item.value}
                  </p>
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.22em] text-silver">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div
              data-hero-card
              className="performance-layer absolute left-0 top-0 w-[72%] overflow-hidden rounded-[2rem] border border-gold/15 bg-charcoal/70 p-3 shadow-2xl shadow-black/30"
            >
              <div className="relative h-64 overflow-hidden rounded-[1.5rem]">
                <img
                  src={featuredProducts[0]?.image}
                  alt={featuredProducts[0]?.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/10 to-transparent" />
              </div>
              <div className="p-4">
                <p className="font-body text-[11px] uppercase tracking-[0.26em] text-gold">
                  Trending Pick
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-ivory" style={{ fontWeight: 700 }}>
                      {featuredProducts[0]?.name}
                    </h2>
                    <p className="mt-2 text-sm text-silver">{featuredProducts[0]?.tagline}</p>
                  </div>
                  <p className="font-body text-base font-semibold text-gold">
                    Rs. {featuredProducts[0]?.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div
              data-hero-card
              className="performance-layer absolute right-0 top-24 w-[60%] rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <p className="font-body text-[11px] uppercase tracking-[0.24em] text-gold">
                Thumb-first layout
              </p>
              <p className="mt-3 font-display text-3xl text-ivory" style={{ fontWeight: 700 }}>
                Sticky purchase actions
              </p>
              <p className="mt-3 text-sm leading-7 text-silver">
                Add-to-cart controls stay accessible on small screens while the product story keeps
                moving underneath.
              </p>
            </div>

            <div
              data-hero-card
              className="performance-layer absolute bottom-0 right-8 w-[68%] overflow-hidden rounded-[2rem] border border-gold/10 bg-charcoal/75 p-3"
            >
              <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
                <div className="overflow-hidden rounded-[1.35rem]">
                  <img
                    src={featuredProducts[1]?.image}
                    alt={featuredProducts[1]?.name}
                    className="h-36 w-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="font-body text-[11px] uppercase tracking-[0.24em] text-gold">
                    Best Seller
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-ivory" style={{ fontWeight: 700 }}>
                    {featuredProducts[1]?.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-silver">
                    Smooth scroll reveals bring the product mix forward in controlled, lightweight
                    steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {merchHighlights.map((item) => (
            <article
              key={item.title}
              data-reveal
              className="performance-layer rounded-[2rem] border border-gold/10 bg-charcoal/60 p-7 opacity-0"
            >
              <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">
                {item.eyebrow}
              </p>
              <h2
                className="mt-4 max-w-lg font-display text-4xl text-ivory"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                {item.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-silver">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="performance-layer mb-10 opacity-0">
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-gold">
              Featured Products
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2
                className="max-w-3xl font-display text-4xl text-ivory md:text-5xl"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                Product reveal blocks designed to feel premium on every swipe.
              </h2>
              <Link
                to="/products"
                className="text-xs uppercase tracking-[0.24em] text-gold transition-opacity hover:opacity-80"
              >
                View all products
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                data-reveal
                className="performance-layer overflow-hidden rounded-[2rem] border border-gold/10 bg-charcoal/55 opacity-0"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    data-media-parallax
                    src={product.image}
                    alt={product.name}
                    className="h-[112%] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/25 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-gold/20 bg-carbon/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="font-display text-3xl text-ivory"
                        style={{ fontStyle: 'italic', fontWeight: 700 }}
                      >
                        {product.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-silver">{product.tagline}</p>
                    </div>
                    <span className="rounded-full border border-gold/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-silver">
                      {product.stockStatus.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="font-body text-base font-semibold text-gold">
                      Rs. {product.price.toLocaleString('en-IN')}
                    </p>
                    <span className="text-xs uppercase tracking-[0.22em] text-gold">
                      Open
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2.5rem] border border-gold/10 bg-[linear-gradient(135deg,rgba(201,168,76,0.12),rgba(255,255,255,0.03))] p-8 md:grid-cols-[0.95fr_1.05fr] md:p-12">
          <div data-reveal className="performance-layer opacity-0">
            <p className="font-body text-[11px] uppercase tracking-[0.3em] text-gold">
              Mobile Commerce Stack
            </p>
            <h2
              className="mt-4 max-w-xl font-display text-4xl text-ivory md:text-5xl"
              style={{ fontStyle: 'italic', fontWeight: 700 }}
            >
              Hero, discovery, and checkout actions now work like one connected story.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-silver">
              The homepage does the attention work first, then hands off to the product page where
              the sticky CTA keeps the conversion path within reach. That balance matters most on
              mobile.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {serviceBlocks.map((item) => (
              <article
                key={item.title}
                data-reveal
                className="performance-layer rounded-[1.75rem] border border-white/10 bg-carbon/65 p-5 opacity-0"
              >
                <p className="font-body text-[11px] uppercase tracking-[0.24em] text-gold">
                  {item.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-silver">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
