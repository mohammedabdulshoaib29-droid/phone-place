import Breadcrumbs from '../components/Breadcrumbs';

export default function AboutUsPage() {
  return (
    <main className="pt-20 pb-24 px-6 md:px-12 lg:px-20 min-h-screen">
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto mt-8 mb-20">
        <div className="text-center mb-12">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-4"
            style={{ letterSpacing: '0.4em' }}
          >
            Our Story
          </p>
          <h1
            className="font-display text-ivory"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            About Phone Palace
          </h1>
          <div className="gold-line mt-6 mx-auto" style={{ width: '80px' }} />
        </div>

        <p className="font-body text-silver text-base md:text-lg leading-relaxed mb-8">
          Phone Palace is your trusted destination for premium mobile accessories. Founded in 2020,
          we've been committed to delivering world-class protection and style for your devices with
          uncompromising quality and exceptional customer service.
        </p>
      </section>

      {/* Mission & Values */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {/* Mission */}
        <div className="border border-gold/20 rounded-lg p-8 hover:border-gold/40 transition-all">
          <h3
            className="font-display text-ivory text-2xl mb-4"
            style={{ fontStyle: 'italic', fontWeight: 700 }}
          >
            Our Mission
          </h3>
          <p className="font-body text-silver text-sm leading-relaxed">
            To provide premium quality mobile accessories that offer superior protection, stunning
            design, and exceptional value. We believe your device deserves the best.
          </p>
        </div>

        {/* Quality */}
        <div className="border border-gold/20 rounded-lg p-8 hover:border-gold/40 transition-all">
          <h3
            className="font-display text-ivory text-2xl mb-4"
            style={{ fontStyle: 'italic', fontWeight: 700 }}
          >
            Quality Promise
          </h3>
          <p className="font-body text-silver text-sm leading-relaxed">
            Every product we offer undergoes rigorous quality testing. We partner with only the
            most trusted manufacturers to ensure your satisfaction and device safety.
          </p>
        </div>

        {/* Innovation */}
        <div className="border border-gold/20 rounded-lg p-8 hover:border-gold/40 transition-all">
          <h3
            className="font-display text-ivory text-2xl mb-4"
            style={{ fontStyle: 'italic', fontWeight: 700 }}
          >
            Customer Focus
          </h3>
          <p className="font-body text-silver text-sm leading-relaxed">
            Your satisfaction is our priority. We're here to help you find the perfect accessories
            and provide support every step of the way.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2
          className="font-display text-ivory text-3xl mb-12 text-center"
          style={{ fontStyle: 'italic', fontWeight: 700 }}
        >
          Why Choose Phone Palace?
        </h2>

        <div className="space-y-6">
          {[
            {
              title: '🏆 Premium Quality',
              description:
                'Handpicked products from trusted global brands and manufacturers with proven track records.',
            },
            {
              title: '✅ Authentic Guarantee',
              description:
                '100% authentic products. Every item is verified and comes with proof of authenticity.',
            },
            {
              title: '🛡️ Warranty Protection',
              description:
                'All products come with comprehensive warranty. If something goes wrong, we make it right.',
            },
            {
              title: '⚡ Fast Shipping',
              description:
                'Quick delivery to Hyderabad and across India. Most orders ship within 24 hours.',
            },
            {
              title: '💰 Best Pricing',
              description:
                'Competitive prices without compromising quality. Regular discounts and exclusive offers.',
            },
            {
              title: '🤝 Expert Support',
              description:
                'Friendly customer service team ready to help via WhatsApp, phone, or email anytime.',
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 pb-6 border-b border-gold/10 last:border-0">
              <div className="flex-1">
                <h3 className="font-display text-ivory text-lg mb-2" style={{ fontStyle: 'italic' }}>
                  {item.title}
                </h3>
                <p className="font-body text-silver text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-4xl mx-auto mb-20 border border-gold/20 rounded-lg p-12">
        <h2
          className="font-display text-ivory text-2xl mb-8 text-center"
          style={{ fontStyle: 'italic', fontWeight: 700 }}
        >
          Certifications & Recognition
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '✓', title: 'GST Registered', desc: 'Legally registered business with full compliance' },
            { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted transactions for your safety' },
            { icon: '📱', title: 'Phone Industry Partner', desc: 'Authorized dealer of premium brands' },
            { icon: '⭐', title: 'Customer Rated', desc: '4.8/5 stars from 500+ verified customers' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="text-gold text-2xl font-bold">{item.icon}</div>
              <div>
                <h4 className="font-display text-ivory mb-1" style={{ fontStyle: 'italic' }}>
                  {item.title}
                </h4>
                <p className="font-body text-silver text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-4xl mx-auto text-center">
        <h2
          className="font-display text-ivory text-2xl mb-8"
          style={{ fontStyle: 'italic', fontWeight: 700 }}
        >
          Get in Touch
        </h2>
        <p className="font-body text-silver text-sm mb-6">
          Have questions? We'd love to hear from you. Contact us anytime.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <a
            href="https://wa.me/917997000166?text=Hi%20Phone%20Palace"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            WhatsApp Us
          </a>
          <a href="mailto:info@phonepalace.com" className="btn-gold">
            Email Us
          </a>
        </div>
        <p className="font-body text-silver/60 text-xs">
          📍 Amberpet, Hyderabad · 📞 +91 79970 00166
        </p>
      </section>
    </main>
  );
}
