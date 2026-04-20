import { Link } from 'react-router-dom';
import { featuredProducts } from '../data/products';

const trustPoints = [
  'Same-day repair on the most common screen and battery jobs',
  'Genuine parts with warranty-backed replacement support',
  'Pickup, doorstep service, and in-store repair options',
  'Amberpet, Hyderabad service desk with live status tracking',
];

const repairServices = [
  {
    title: 'Screen Repair',
    copy: 'Fast display replacement for cracked glass, touch issues, and OLED panel problems.',
  },
  {
    title: 'Battery Replacement',
    copy: 'Backup, overheating, battery swelling, and quick-drain diagnostics with safe replacement.',
  },
  {
    title: 'Charging Port',
    copy: 'Loose charging, cable fit issues, slow charging, and port cleaning or replacement.',
  },
  {
    title: 'Speaker and Camera',
    copy: 'Low audio, mic faults, blurred camera output, and module replacement work.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Book the repair',
    copy: 'Choose walk-in, pickup, or doorstep service and share the device issue, model, and photos.',
  },
  {
    step: '02',
    title: 'Approve the quote',
    copy: 'After inspection, the customer receives the estimate, timeline, and approval request.',
  },
  {
    step: '03',
    title: 'Track until handover',
    copy: 'Repair status moves from intake to quality check, then to pickup or final delivery.',
  },
];

const reviewCards = [
  {
    name: 'Priya N.',
    quote: 'They replaced my iPhone screen the same evening and the tracking updates were actually useful.',
  },
  {
    name: 'Arjun S.',
    quote: 'The pickup service made the whole repair process feel organized and professional, not chaotic.',
  },
  {
    name: 'Farah K.',
    quote: 'Good prices, clean accessories display, and they explained the repair quote before starting work.',
  },
];

const faqPreview = [
  {
    question: 'Do you provide warranty on repairs?',
    answer: 'Yes. Common hardware repairs and genuine-part replacements come with warranty support based on the part category.',
  },
  {
    question: 'Can customers approve the quote online?',
    answer: 'Yes. The repair flow is structured for estimate approval before paid repair work begins.',
  },
  {
    question: 'Do you also sell accessories?',
    answer: 'Yes. The shop and product pages are built to sell chargers, cables, cases, glass, earbuds, and more.',
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-screen px-6 pt-32 pb-20 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(201,168,76,0.12),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-body text-gold text-xs uppercase tracking-[0.45em] mb-5">Phone Repair and Accessories</p>
            <h1 className="font-display text-ivory text-5xl md:text-7xl leading-[0.95]" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              Repair booking, device tracking, and accessory shopping in one storefront
            </h1>
            <p className="mt-6 max-w-2xl font-body text-silver text-sm md:text-base leading-8">
              Phone Palace now answers the three questions that matter immediately:
              what you do, why customers can trust you, and what they should do next.
              Book a repair, track the device, or shop accessories without leaving the same experience.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/book-repair" className="btn-gold text-center">
                Book Repair
              </Link>
              <Link
                to="/track-repair"
                className="border border-gold/30 px-6 py-4 text-center text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold/10 transition-colors"
              >
                Track Repair
              </Link>
              <Link
                to="/products"
                className="border border-gold/15 px-6 py-4 text-center text-xs uppercase tracking-[0.25em] text-silver hover:border-gold/40 hover:text-gold transition-colors"
              >
                Shop Now
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className="rounded-3xl border border-gold/15 bg-charcoal/50 px-5 py-4">
                  <p className="font-body text-silver text-sm leading-7">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-[2rem] p-6 sm:col-span-2">
              <p className="font-body text-gold text-xs uppercase tracking-[0.3em] mb-3">Service Snapshot</p>
              <h2 className="font-display text-ivory text-3xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
                Built for a working repair counter
              </h2>
              <p className="font-body text-silver text-sm leading-7 mt-4">
                Repair ID generation, quote approval, timeline updates, payment status, technician notes,
                and order support all fit naturally into the same customer journey.
              </p>
            </div>

            {[
              { label: 'Repair Services', value: 'Screen, battery, camera, charging port' },
              { label: 'Coverage', value: 'Amberpet, Hyderabad and nearby pickup zones' },
              { label: 'Store Hours', value: '10:00 AM to 9:00 PM, six days a week' },
              { label: 'Support', value: 'WhatsApp, phone, email, and in-store help' },
            ].map((item) => (
              <div key={item.label} className="rounded-[2rem] border border-gold/15 bg-charcoal/50 p-6">
                <p className="font-body text-silver text-xs uppercase tracking-[0.22em] mb-3">{item.label}</p>
                <p className="font-body text-ivory text-sm leading-7">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Top Repair Services</p>
              <h2 className="font-display text-ivory text-4xl md:text-5xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
                The jobs customers search for first
              </h2>
            </div>
            <Link to="/book-repair" className="text-gold text-xs uppercase tracking-[0.25em]">
              Start a booking
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {repairServices.map((service) => (
              <div key={service.title} className="glass-card rounded-[2rem] p-6">
                <p className="font-body text-gold text-xs uppercase tracking-[0.22em] mb-4">{service.title}</p>
                <p className="font-body text-silver text-sm leading-7">{service.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Featured Products</p>
            <h2 className="font-display text-ivory text-4xl md:text-5xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              Accessory shopping that feels clean and trustworthy
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="overflow-hidden rounded-[2rem] border border-gold/15 bg-charcoal/50 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="h-60 overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="font-body text-gold text-xs uppercase tracking-[0.22em] mb-3">{product.category}</p>
                  <h3 className="font-display text-ivory text-2xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
                    {product.name}
                  </h3>
                  <p className="font-body text-silver text-sm leading-7 mt-3">{product.tagline}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="font-body text-gold text-base font-semibold">Rs. {product.price.toLocaleString('en-IN')}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-silver">{product.stockStatus.replace('-', ' ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-gold/15 bg-charcoal/40 p-8 md:p-12">
          <div className="mb-10">
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">How It Works</p>
            <h2 className="font-display text-ivory text-4xl md:text-5xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              Three steps from damaged phone to delivered device
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="rounded-[2rem] border border-gold/10 bg-carbon/70 p-6">
                <p className="font-display text-gold text-4xl" style={{ fontWeight: 700 }}>{item.step}</p>
                <h3 className="font-body text-ivory text-lg mt-4">{item.title}</h3>
                <p className="font-body text-silver text-sm leading-7 mt-3">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Customer Reviews</p>
            <h2 className="font-display text-ivory text-4xl md:text-5xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              Social proof that fits the business
            </h2>
            <p className="font-body text-silver text-sm leading-7 mt-5 max-w-xl">
              A phone repair site needs trust fast. Reviews should reassure the customer that repairs are explained clearly,
              timelines are real, and the team knows both service and accessories.
            </p>
          </div>
          <div className="grid gap-5">
            {reviewCards.map((review) => (
              <div key={review.name} className="glass-card rounded-[2rem] p-6">
                <p className="font-body text-ivory text-sm leading-8">"{review.quote}"</p>
                <p className="font-body text-gold text-xs uppercase tracking-[0.22em] mt-4">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">FAQ Preview</p>
            <h2 className="font-display text-ivory text-4xl md:text-5xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              The fast answers customers look for before messaging
            </h2>
            <Link to="/faq" className="inline-block mt-6 text-gold text-xs uppercase tracking-[0.25em]">
              Open full FAQ
            </Link>
          </div>
          <div className="space-y-4">
            {faqPreview.map((item) => (
              <div key={item.question} className="rounded-[2rem] border border-gold/15 bg-charcoal/50 p-6">
                <p className="font-body text-ivory text-base">{item.question}</p>
                <p className="font-body text-silver text-sm leading-7 mt-3">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-gold/15">
            <iframe
              title="Phone Palace Hyderabad"
              src="https://maps.google.com/maps?q=Amberpet%20Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="glass-card rounded-[2rem] p-8">
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Contact and Hours</p>
            <h2 className="font-display text-ivory text-4xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              Visit, call, WhatsApp, or book online
            </h2>
            <div className="mt-6 space-y-4 text-sm text-silver">
              <p><span className="text-ivory block mb-1">Store</span>Phone Palace, Amberpet Main Road, Hyderabad</p>
              <p><span className="text-ivory block mb-1">Hours</span>Monday to Saturday 10:00 AM to 9:00 PM, Sunday 11:00 AM to 7:00 PM</p>
              <p><span className="text-ivory block mb-1">Phone</span>+91 79970 00166</p>
              <p><span className="text-ivory block mb-1">Response Time</span>WhatsApp support usually responds within 10 to 20 minutes during open hours</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-gold text-center">Contact Page</Link>
              <Link
                to="/book-repair"
                className="border border-gold/30 px-6 py-4 text-center text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold/10 transition-colors"
              >
                Start Repair Booking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
