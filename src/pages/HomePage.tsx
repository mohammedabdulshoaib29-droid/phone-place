import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredProducts, products } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

const trustStats = [
  { label: 'Happy customers', value: '1200+' },
  { label: 'Fast repair help', value: '15 min' },
  { label: 'Top-rated products', value: '4.8/5' },
];

const categoryChips = [
  'Phone cases',
  'Chargers',
  'Tempered glass',
  'Earbuds',
  'Power banks',
];

const featureCards = [
  {
    eyebrow: 'Easy shopping',
    title: 'Find what you need quickly',
    copy:
      'Clear product cards, simple prices, and easy buttons help every customer understand the store without extra searching.',
  },
  {
    eyebrow: 'Smooth browsing',
    title: 'Scroll feels soft and fast',
    copy:
      'The motion is light and clean so the page looks modern while still loading well on phones.',
  },
];

const serviceBlocks = [
  {
    title: 'Buy accessories',
    copy: 'Shop covers, glass, chargers, audio, and other daily phone essentials in one place.',
  },
  {
    title: 'Book repairs',
    copy: 'Customers can book common phone repairs and get help without leaving the same website.',
  },
  {
    title: 'Quick checkout',
    copy: 'The product page keeps the main action close, so adding to cart feels simple on mobile.',
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
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }
        );

        gsap.fromTo(
          '[data-hero-card]',
          { autoAlpha: 0, y: 40, rotate: -2 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 0.95,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.15,
          }
        );

        gsap.utils.toArray<HTMLElement>('[data-parallax-layer]').forEach((layer, index) => {
          gsap.to(layer, {
            yPercent: -8 - index * 4,
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
          start: 'top 86%',
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
            { yPercent: -5 },
            {
              yPercent: 5,
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
    <main ref={pageRef} className="overflow-hidden bg-[#efe3c8] pb-16 text-[#34281c]">
      <section
        data-hero
        className="relative min-h-screen overflow-hidden px-5 pb-20 pt-28 md:px-12 lg:px-20"
      >
        <div className="hero-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.28),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.75),transparent_22%),linear-gradient(180deg,#f7ecd7_0%,#efe3c8_50%,#e4d3b1_100%)]" />
        <div
          data-parallax-layer
          className="performance-layer absolute -right-20 top-20 h-64 w-64 rounded-full bg-[#d7b97a]/35 blur-3xl"
        />
        <div
          data-parallax-layer
          className="performance-layer absolute -left-14 top-[42%] h-44 w-44 rounded-full bg-white/40 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div data-hero-copy className="performance-layer">
            <p className="mb-5 font-body text-[11px] uppercase tracking-[0.42em] text-[#8a6e2f]">
              Phone Palace
            </p>
            <h1
              className="max-w-3xl font-display text-5xl leading-[0.95] text-[#2f2417] md:text-7xl"
              style={{ fontStyle: 'italic', fontWeight: 700 }}
            >
              Buy phone accessories and book repairs in one easy website.
            </h1>
            <p className="mt-6 max-w-2xl font-body text-sm leading-8 text-[#6a5843] md:text-base">
              Shop chargers, cases, tempered glass, and more. If your phone needs help, you can
              also book a repair and track the progress here.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="btn-gold text-center">
                Shop Now
              </Link>
              <Link
                to="/book-repair"
                className="rounded-full border border-[#bda06a] px-6 py-4 text-center text-xs uppercase tracking-[0.24em] text-[#6e5627] transition-colors hover:bg-[#f5ead3]"
              >
                Book Repair
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {categoryChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#d7c19b] bg-white/55 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#6a5843]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {trustStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.75rem] border border-[#d8c5a0] bg-white/55 p-5 backdrop-blur-md"
                >
                  <p className="font-display text-3xl text-[#2f2417]" style={{ fontWeight: 700 }}>
                    {item.value}
                  </p>
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.22em] text-[#7a6851]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div
              data-hero-card
              className="performance-layer absolute left-0 top-0 w-[72%] overflow-hidden rounded-[2rem] border border-[#d8c5a0] bg-white/70 p-3 shadow-2xl shadow-[#c3aa7b]/20"
            >
              <div className="relative h-64 overflow-hidden rounded-[1.5rem]">
                <img
                  src={featuredProducts[0]?.image}
                  alt={featuredProducts[0]?.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d3125]/25 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <p className="font-body text-[11px] uppercase tracking-[0.26em] text-[#8a6e2f]">
                  Popular choice
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-[#2f2417]" style={{ fontWeight: 700 }}>
                      {featuredProducts[0]?.name}
                    </h2>
                    <p className="mt-2 text-sm text-[#6a5843]">{featuredProducts[0]?.tagline}</p>
                  </div>
                  <p className="font-body text-base font-semibold text-[#8a6e2f]">
                    Rs. {featuredProducts[0]?.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div
              data-hero-card
              className="performance-layer absolute right-0 top-24 w-[60%] rounded-[2rem] border border-[#dbc8a1] bg-[#f9f1e2]/85 p-5 backdrop-blur-xl"
            >
              <p className="font-body text-[11px] uppercase tracking-[0.24em] text-[#8a6e2f]">
                Easy to use
              </p>
              <p className="mt-3 font-display text-3xl text-[#2f2417]" style={{ fontWeight: 700 }}>
                Simple shopping on mobile
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6a5843]">
                The main buttons stay easy to reach, so customers can browse and buy without
                confusion.
              </p>
            </div>

            <div
              data-hero-card
              className="performance-layer absolute bottom-0 right-8 w-[68%] overflow-hidden rounded-[2rem] border border-[#d8c5a0] bg-white/75 p-3"
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
                  <p className="font-body text-[11px] uppercase tracking-[0.24em] text-[#8a6e2f]">
                    Best seller
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-[#2f2417]" style={{ fontWeight: 700 }}>
                    {featuredProducts[1]?.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#6a5843]">
                    Smooth motion and clear text help customers understand the product quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {featureCards.map((item) => (
            <article
              key={item.title}
              data-reveal
              className="performance-layer rounded-[2rem] border border-[#d7c19b] bg-white/60 p-7 opacity-0"
            >
              <p className="font-body text-[11px] uppercase tracking-[0.28em] text-[#8a6e2f]">
                {item.eyebrow}
              </p>
              <h2
                className="mt-4 max-w-lg font-display text-4xl text-[#2f2417]"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                {item.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-[#6a5843]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="performance-layer mb-10 opacity-0">
            <p className="font-body text-[11px] uppercase tracking-[0.32em] text-[#8a6e2f]">
              Featured Products
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2
                className="max-w-3xl font-display text-4xl text-[#2f2417] md:text-5xl"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                Popular products, shown in a clean and easy way.
              </h2>
              <Link
                to="/products"
                className="text-xs uppercase tracking-[0.24em] text-[#8a6e2f] transition-opacity hover:opacity-80"
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
                className="performance-layer overflow-hidden rounded-[2rem] border border-[#d7c19b] bg-white/60 opacity-0"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    data-media-parallax
                    src={product.image}
                    alt={product.name}
                    className="h-[112%] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d3125]/35 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-[#d7c19b] bg-[#f7eedf]/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#8a6e2f]">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="font-display text-3xl text-[#2f2417]"
                        style={{ fontStyle: 'italic', fontWeight: 700 }}
                      >
                        {product.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#6a5843]">{product.tagline}</p>
                    </div>
                    <span className="rounded-full border border-[#d7c19b] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#7a6851]">
                      {product.stockStatus.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="font-body text-base font-semibold text-[#8a6e2f]">
                      Rs. {product.price.toLocaleString('en-IN')}
                    </p>
                    <span className="text-xs uppercase tracking-[0.22em] text-[#8a6e2f]">
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
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2.5rem] border border-[#d7c19b] bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(224,202,159,0.35))] p-8 md:grid-cols-[0.95fr_1.05fr] md:p-12">
          <div data-reveal className="performance-layer opacity-0">
            <p className="font-body text-[11px] uppercase tracking-[0.3em] text-[#8a6e2f]">
              Why customers like it
            </p>
            <h2
              className="mt-4 max-w-xl font-display text-4xl text-[#2f2417] md:text-5xl"
              style={{ fontStyle: 'italic', fontWeight: 700 }}
            >
              One place for shopping, repairs, and quick checkout.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-[#6a5843]">
              The homepage explains the business clearly, the product cards are easy to scan, and
              the product page keeps the main action close for mobile users.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {serviceBlocks.map((item) => (
              <article
                key={item.title}
                data-reveal
                className="performance-layer rounded-[1.75rem] border border-[#e0cfaf] bg-[#faf3e7] p-5 opacity-0"
              >
                <p className="font-body text-[11px] uppercase tracking-[0.24em] text-[#8a6e2f]">
                  {item.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#6a5843]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
