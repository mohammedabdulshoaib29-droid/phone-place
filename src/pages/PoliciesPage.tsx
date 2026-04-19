import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

type PolicySection = {
  id: string;
  title: string;
  content: string;
};

const policies: PolicySection[] = [
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    content: `
## Delivery Timeline
- **Hyderabad:** Same-day or next-day delivery available
- **Major Cities:** 2-3 business days
- **Rest of India:** 3-7 business days
- Orders placed before 5 PM ship the same day (Hyderabad)
- Orders placed after 5 PM ship the next day

## Shipping Costs
- **Hyderabad:** Free for orders above ₹500, ₹50 for orders below ₹500
- **Rest of India:** Calculated based on weight and destination
- Costs displayed at checkout before payment

## Order Tracking
- Tracking link sent via WhatsApp and email
- Real-time tracking available through carrier website
- Updates sent for each milestone: Order Placed → Shipped → Out for Delivery → Delivered

## Delivery Guarantee
- Secure packaging ensures products arrive in perfect condition
- If item arrives damaged, we replace it immediately at no cost
- Free re-delivery for any delivery failures

## Shipping Address
Orders only ship to addresses in India. PO Boxes are not accepted. Ensure your address is complete and correct before checkout.
    `,
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    content: `
## 30-Day Money-Back Guarantee
- Returns accepted within 30 days of delivery
- Full refund if product is unused and in original packaging
- No questions asked return policy

## Return Process
1. Contact us via WhatsApp with your order number
2. We'll provide return address and prepaid shipping label
3. Send the item back to us (shipping is on us)
4. We inspect and process refund within 5-7 business days

## Eligible for Return
- Unused products in original packaging
- Within 30 days of delivery
- All original accessories included
- No signs of wear or damage

## Not Eligible for Return
- Used or damaged products
- Items outside 30-day window
- Missing original packaging
- Physical damage from user negligence

## Exchanges
Request exchanges within 7 days for:
- Manufacturing defects
- Incorrect item received
- Damaged on arrival

Free exchange shipping provided.
    `,
  },
  {
    id: 'warranty',
    title: 'Warranty Policy',
    content: `
## Warranty Coverage
All our products come with manufacturer warranty:
- **Phone Cases:** 3-6 months coverage
- **Tempered Glass:** 7 days fit replacement, 3 months defect coverage
- **Chargers:** 1 year manufacturer warranty
- **Cables:** 6 months replacement warranty

## What's Covered
- Manufacturing defects
- Material defects
- Non-functional components
- Durability issues

## What's NOT Covered
- Physical damage from drops or impacts
- Water damage from user negligence
- Cosmetic damage (scratches, color fading)
- Wear and tear from normal use
- Damage from unauthorized modification

## Warranty Claims
1. Contact us within 30 days of discovering the defect
2. Provide proof of purchase and photos of defect
3. Ship the item to us (prepaid label provided)
4. We'll replace or repair at no cost
5. Return shipping on us

## Extended Warranty
Extended warranty options (1-2 years) available on select products at checkout for a small additional fee.
    `,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `
## Information We Collect
- Name, email, phone number, delivery address
- Payment information (processed securely by Razorpay)
- Order history and preferences
- Device information for analytics

## How We Use Your Information
- Process and deliver your orders
- Send order updates and support communications
- Improve our products and services
- Marketing communications (only if you opt-in)
- Legal compliance

## Data Security
- All payments encrypted with SSL 256-bit encryption
- Your data is never shared with third parties
- Secure servers with regular backups
- Compliant with data protection standards

## Cookies
We use cookies to:
- Remember your login information
- Improve site experience
- Analyze user behavior
- Personalize recommendations

## Contact & Updates
- You can request access to your data anytime
- Update your information in account settings
- Opt-out of marketing emails anytime
- Contact us for data deletion requests

## Changes to Policy
We may update this policy occasionally. Continued use implies acceptance of updates.
    `,
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    content: `
## Agreement to Terms
By using Phone Palace website and services, you agree to these terms and conditions.

## Product Information
- Product descriptions are accurate to the best of our knowledge
- Images are representative; actual product may vary slightly
- Specifications and pricing subject to change without notice
- We reserve the right to correct errors

## Pricing & Availability
- All prices in Indian Rupees (₹)
- Prices subject to change without notice
- We reserve the right to limit quantities
- Out-of-stock items will be notified during checkout

## Order Acceptance
We reserve the right to:
- Refuse or cancel any order
- Limit quantities per customer
- Correct pricing errors
- Modify product availability

## User Responsibilities
- Provide accurate information
- Use website for lawful purposes only
- Not attempt to hack or compromise security
- Not engage in fraudulent activities
- Not resell items for commercial purpose

## Limitation of Liability
Phone Palace is not liable for:
- Indirect or consequential damages
- Loss of profits or data
- Unauthorized access to accounts
- Third-party services

## Intellectual Property
All content on our website is owned by Phone Palace:
- Do not copy without permission
- Do not use for commercial purposes
- Respect brand trademarks

## Dispute Resolution
- Disputes governed by Hyderabad jurisdiction
- First attempt amicable resolution
- Escalation through legal channels if needed

## Contact for Issues
Email: info@phonepalace.com
WhatsApp: +91 79970 00166
    `,
  },
];

export default function PoliciesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(
    policies[0]?.id || null
  );

  const currentPolicy = policies.find((p) => p.id === expandedId);

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
            Legal
          </p>
          <h1
            className="font-display text-ivory"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            Policies & Legal
          </h1>
          <div className="gold-line mt-6 mx-auto" style={{ width: '80px' }} />
        </div>
      </section>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2 sticky top-24">
            {policies.map((policy) => (
              <button
                key={policy.id}
                onClick={() => setExpandedId(policy.id)}
                className={`w-full text-left px-4 py-3 rounded transition-all ${
                  expandedId === policy.id
                    ? 'bg-gold text-carbon font-semibold'
                    : 'text-silver hover:bg-gold/10 hover:text-gold'
                }`}
              >
                <span className="font-body text-sm uppercase tracking-widest">
                  {policy.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {currentPolicy && (
            <div className="border border-gold/20 rounded-lg p-8">
              <h2
                className="font-display text-ivory text-2xl mb-6"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                {currentPolicy.title}
              </h2>

              <div className="prose prose-invert max-w-none font-body text-silver text-sm leading-relaxed space-y-4">
                {currentPolicy.content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('##')) {
                    return (
                      <h3
                        key={i}
                        className="font-display text-ivory text-lg mt-6 mb-3"
                        style={{ fontStyle: 'italic', fontWeight: 700 }}
                      >
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={i} className="space-y-2 ml-4">
                        {paragraph.split('\n').map((item, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="text-gold">•</span>
                            <span>{item.replace('- ', '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <ol key={i} className="space-y-2 ml-4 list-decimal">
                        {paragraph.split('\n').map((item, j) => (
                          <li key={j} className="text-silver">
                            {item.replace(/^\d+\.\s*/, '')}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={i} className="text-base">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto mt-20 text-center border border-gold/20 rounded-lg p-12">
        <h2
          className="font-display text-ivory text-2xl mb-4"
          style={{ fontStyle: 'italic', fontWeight: 700 }}
        >
          Questions About Our Policies?
        </h2>
        <p className="font-body text-silver mb-8">
          Contact our support team for clarification on any policy.
        </p>
        <a
          href="https://wa.me/917997000166"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          Contact Support
        </a>
      </section>
    </main>
  );
}
