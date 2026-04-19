import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQItem[] = [
  // Product Questions
  {
    id: 'faq-1',
    category: 'Products',
    question: 'Are all products genuine/authentic?',
    answer:
      'Yes, 100% authentic! Every product is sourced directly from authorized manufacturers and dealers. We provide certificates of authenticity with every purchase. If you ever doubt the authenticity, we offer a full refund.',
  },
  {
    id: 'faq-2',
    category: 'Products',
    question: 'Which phone models are your products compatible with?',
    answer:
      'We carry accessories for all major phone models including iPhone (15, 14, 13, 12 series), Samsung (S24, S23, S22 Ultra), OnePlus, Pixel, and more. Each product listing clearly shows compatible models. Use our search filter to find products for your specific phone.',
  },
  {
    id: 'faq-3',
    category: 'Products',
    question: 'Do you offer custom or bulk orders?',
    answer:
      'Yes! Contact us via WhatsApp for bulk orders and custom requests. We offer special discounts for orders of 5+ units. Message us at +91 79970 00166 for bulk pricing.',
  },
  {
    id: 'faq-4',
    category: 'Products',
    question: 'How do I know if a product is right for my phone?',
    answer:
      'Each product page shows: (1) Compatible devices list, (2) Detailed specifications, (3) Customer reviews with photos, (4) Quick View modal for preview. Still unsure? Contact us via WhatsApp and we\'ll recommend the perfect fit.',
  },

  // Ordering & Delivery
  {
    id: 'faq-5',
    category: 'Ordering',
    question: 'How long does delivery take?',
    answer:
      'We offer same-day and next-day delivery in Hyderabad. For rest of India, delivery is typically 2-7 business days depending on location. Shipping costs are calculated at checkout based on your location.',
  },
  {
    id: 'faq-6',
    category: 'Ordering',
    question: 'Do you deliver outside Hyderabad?',
    answer:
      'Yes! We ship across all of India via trusted courier partners. Delivery times and costs vary by location. Shipping charges are calculated and displayed before checkout so you know exactly what to expect.',
  },
  {
    id: 'faq-7',
    category: 'Ordering',
    question: 'Can I track my order?',
    answer:
      'Absolutely! You\'ll receive a tracking link via WhatsApp and email after your order ships. You can track your package in real-time. We also provide order confirmation and regular updates.',
  },
  {
    id: 'faq-8',
    category: 'Ordering',
    question: 'What payment methods do you accept?',
    answer:
      'We accept: (1) Credit/Debit Cards, (2) UPI, (3) Net Banking, (4) Digital Wallets (via Razorpay), and (5) Cash on Delivery (COD). Choose your preferred method at checkout.',
  },

  // Returns & Warranty
  {
    id: 'faq-9',
    category: 'Returns',
    question: 'What is your return policy?',
    answer:
      '30-day money-back guarantee! If you\'re not satisfied for any reason, return the product within 30 days for a full refund. Product must be unused and in original packaging. We cover return shipping.',
  },
  {
    id: 'faq-10',
    category: 'Returns',
    question: 'How do I initiate a return?',
    answer:
      'Contact us via WhatsApp with your order number within 30 days. We\'ll provide a return address and prepaid shipping label. Once we receive and inspect the item, refund is processed within 5-7 business days.',
  },
  {
    id: 'faq-11',
    category: 'Returns',
    question: 'What warranty does the product come with?',
    answer:
      'All products come with manufacturer warranty ranging from 3-12 months depending on the item. Details are on each product page. Warranty covers manufacturing defects. Physical damage is not covered by warranty.',
  },
  {
    id: 'faq-12',
    category: 'Returns',
    question: 'What if the product arrives damaged?',
    answer:
      'We guarantee safe delivery in excellent condition. If your item arrives damaged, contact us immediately with photos. We\'ll replace it or refund you without asking for return shipping. Your satisfaction is guaranteed.',
  },

  // Installation & Support
  {
    id: 'faq-13',
    category: 'Support',
    question: 'Do you provide installation guides?',
    answer:
      'Yes! Each product comes with detailed installation instructions. We also provide YouTube links to video guides. For tempered glass, we include an alignment frame and dust removal kit to make installation super easy.',
  },
  {
    id: 'faq-14',
    category: 'Support',
    question: 'How do I apply a tempered glass protector?',
    answer:
      'Our Crystal Clarity tempered glass includes an easy-install alignment frame. Follow the steps: (1) Clean screen, (2) Use dust stickers, (3) Place alignment frame, (4) Slide glass in, (5) Press gently. Videos available on our product page.',
  },
  {
    id: 'faq-15',
    category: 'Support',
    question: 'How do I contact customer support?',
    answer:
      'We\'re available 9 AM - 9 PM daily via: WhatsApp: +91 79970 00166 | Email: info@phonepalace.com | You can also visit our store in Amberpet, Hyderabad. Response time is usually within 30 minutes.',
  },
  {
    id: 'faq-16',
    category: 'Support',
    question: 'Do you offer phone case customization?',
    answer:
      'We\'re exploring custom printing options for bulk orders. Contact us via WhatsApp to discuss your custom design requirements. Minimum order quantity may apply.',
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered =
    selectedCategory === 'All'
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <main className="pt-20 pb-24 px-6 md:px-12 lg:px-20 min-h-screen">
      <Breadcrumbs />

      {/* Header */}
      <section className="max-w-4xl mx-auto mt-8 mb-12">
        <div className="text-center mb-8">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-4"
            style={{ letterSpacing: '0.4em' }}
          >
            Help Center
          </p>
          <h1
            className="font-display text-ivory"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            Frequently Asked Questions
          </h1>
          <div className="gold-line mt-6 mx-auto" style={{ width: '80px' }} />
        </div>

        <p className="font-body text-silver text-center text-base mb-8">
          Find answers to common questions about our products, ordering, shipping, returns, and
          support.
        </p>
      </section>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-body text-xs uppercase px-6 py-2 border rounded transition-all ${
                selectedCategory === cat
                  ? 'bg-gold text-carbon border-gold'
                  : 'border-gold/30 text-silver hover:border-gold hover:text-gold'
              }`}
              style={{ letterSpacing: '0.2em' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filtered.map((faq) => (
          <div
            key={faq.id}
            className="border border-gold/20 rounded-lg overflow-hidden hover:border-gold/40 transition-all"
          >
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gold/5 transition-colors"
            >
              <div className="flex-1">
                <p className="font-body text-gold text-xs uppercase mb-2" style={{ letterSpacing: '0.2em' }}>
                  {faq.category}
                </p>
                <h3
                  className="font-display text-ivory text-lg"
                  style={{ fontStyle: 'italic', fontWeight: 700 }}
                >
                  {faq.question}
                </h3>
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className={`text-gold transition-transform flex-shrink-0 ml-4 ${
                  expandedId === faq.id ? 'rotate-180' : ''
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedId === faq.id && (
              <div className="px-6 pb-6 border-t border-gold/10">
                <p className="font-body text-silver leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still Need Help */}
      <section className="max-w-4xl mx-auto mt-20 text-center border border-gold/20 rounded-lg p-12">
        <h2
          className="font-display text-ivory text-2xl mb-4"
          style={{ fontStyle: 'italic', fontWeight: 700 }}
        >
          Still Have Questions?
        </h2>
        <p className="font-body text-silver mb-8">
          Our support team is here to help! Reach out via WhatsApp, email, or phone anytime.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/917997000166?text=I%20have%20a%20question%20about%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            WhatsApp Support
          </a>
          <a href="mailto:info@phonepalace.com" className="btn-gold">
            Email Us
          </a>
        </div>
      </section>
    </main>
  );
}
