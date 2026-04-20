import Breadcrumbs from '../components/Breadcrumbs';

export default function ReturnPolicyPage() {
  const policyItems = [
    {
      title: '30-Day Return Window',
      description:
        'All products can be returned within 30 days of purchase. Items must be unused and in original packaging.',
      icon: '📅',
    },
    {
      title: 'Easy Process',
      description:
        'Request a return through your account, provide reason and photos if needed, and we\'ll arrange pickup.',
      icon: '🔄',
    },
    {
      title: 'Free Return Shipping',
      description:
        'We\'ll provide a prepaid return label. No additional charges for return shipping on eligible items.',
      icon: '🚚',
    },
    {
      title: 'Fast Refunds',
      description:
        'Once we receive and verify your return, refunds are processed within 7-10 business days.',
      icon: '💰',
    },
  ];

  const eligibleReasons = [
    'Defective or Damaged: Product has manufacturing defects or arrived damaged',
    'Wrong Item: You received an incorrect product',
    'Not as Described: Product doesn\'t match the listing description',
    'Changed Mind: You\'ve changed your mind within 30 days',
    'Expired: Product has passed expiry/best-before date',
  ];

  const notEligible = [
    'Items purchased more than 30 days ago',
    'Products without original packaging',
    'Items showing signs of heavy use',
    'Products damaged due to misuse',
    'Items where serial numbers don\'t match',
  ];

  const refundMethods = [
    {
      method: 'Original Payment Method',
      description: 'Refunded to your original credit/debit card or UPI account',
      time: '7-10 business days',
    },
    {
      method: 'Phone Palace Wallet',
      description: 'Instant wallet credit for faster shopping',
      time: 'Immediate',
    },
    {
      method: 'Bank Transfer',
      description: 'Direct transfer to your registered bank account',
      time: '5-7 business days',
    },
  ];

  return (
    <main className="pt-20 pb-24 min-h-screen">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-4"
            style={{ letterSpacing: '0.4em' }}
          >
            Our Commitment
          </p>
          <h1
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontStyle: 'italic', fontWeight: 700 }}
          >
            Return & Refund Policy
          </h1>
          <p className="text-silver mt-4 max-w-2xl mx-auto">
            Shop with confidence. If you're not satisfied with your purchase, we'll make it right.
          </p>
          <div className="gold-line mt-6 mx-auto" style={{ width: '80px' }} />
        </div>

        {/* Quick Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {policyItems.map((item) => (
            <div key={item.title} className="glass-card p-8">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-gold font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-silver text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="gold-line my-12 mx-auto" style={{ width: '60px' }} />

        {/* Detailed Policy Sections */}
        <div className="space-y-12">
          {/* Eligible Reasons */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">✅</span>
              <h2 className="text-gold font-semibold text-2xl">Return Eligible Reasons</h2>
            </div>
            <div className="space-y-3">
              {eligibleReasons.map((reason) => (
                <div key={reason} className="flex items-start gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded">
                  <span className="text-emerald-400 mt-1">→</span>
                  <p className="text-silver">{reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Not Eligible */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">❌</span>
              <h2 className="text-gold font-semibold text-2xl">Non-Returnable Items</h2>
            </div>
            <div className="space-y-3">
              {notEligible.map((reason) => (
                <div key={reason} className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded">
                  <span className="text-red-400 mt-1">✗</span>
                  <p className="text-silver">{reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How to Request Return */}
          <section>
            <h2 className="text-gold font-semibold text-2xl mb-6">How to Request a Return</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Go to Order History', desc: 'Navigate to "My Orders" in your account' },
                { step: 2, title: 'Select Your Product', desc: 'Choose the product you want to return' },
                { step: 3, title: 'Request Return', desc: 'Click "Request Return" and fill in the form' },
                { step: 4, title: 'Provide Details', desc: 'Describe the issue and upload photos if needed' },
                { step: 5, title: 'Submit', desc: 'Our team will review and respond within 24 hours' },
                { step: 6, title: 'Ship It Back', desc: 'Use the prepaid label to send back the item' },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 p-4 glass-card">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gold/20 border border-gold/40">
                      <span className="text-gold font-semibold">{item.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-ivory font-semibold mb-1">{item.title}</h3>
                    <p className="text-silver text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Refund Methods */}
          <section>
            <h2 className="text-gold font-semibold text-2xl mb-6">Refund Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {refundMethods.map((method) => (
                <div key={method.method} className="glass-card p-6">
                  <h3 className="text-gold font-semibold mb-2">{method.method}</h3>
                  <p className="text-silver text-sm mb-3">{method.description}</p>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <span>⏱️</span>
                    <span>{method.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Return Status Tracking */}
          <section>
            <h2 className="text-gold font-semibold text-2xl mb-6">Track Your Return</h2>
            <div className="glass-card p-8">
              <p className="text-silver mb-6">
                Once you submit a return request, you can track its status in real-time:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { status: 'Requested', icon: '📝', color: 'blue' },
                  { status: 'Approved', icon: '✅', color: 'green' },
                  { status: 'In Transit', icon: '📦', color: 'yellow' },
                  { status: 'Received', icon: '📬', color: 'purple' },
                  { status: 'Refunded', icon: '💰', color: 'emerald' },
                ].map((item) => (
                  <div key={item.status} className="text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-silver text-sm">{item.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-gold font-semibold text-2xl mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How long does the return process take?',
                  a: 'Typically 2-3 weeks from submission to refund. Once we receive your item and verify it, refunds are processed within 7-10 business days.',
                },
                {
                  q: 'Do I need to pay for return shipping?',
                  a: 'No! We provide a prepaid return label for all eligible returns. Return shipping is completely free.',
                },
                {
                  q: 'What if my return is rejected?',
                  a: 'If your return doesn\'t meet our criteria, we\'ll explain why and offer you options. You can dispute the decision within 7 days.',
                },
                {
                  q: 'Can I exchange instead of returning?',
                  a: 'Yes! You can request an exchange for a different size, color, or product. Exchanges follow the same process as returns.',
                },
                {
                  q: 'What condition must the item be in?',
                  a: 'Items must be unused and in original, undamaged packaging. Minor wear from inspection is acceptable.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="glass-card p-6">
                  <h3 className="text-ivory font-semibold mb-2">{faq.q}</h3>
                  <p className="text-silver text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center bg-gold/5 border border-gold/20 rounded-lg p-8">
            <h2 className="text-ivory font-semibold text-xl mb-3">Need Help?</h2>
            <p className="text-silver mb-6">
              Have questions about our return policy? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/917997000166"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors"
              >
                Chat on WhatsApp
              </a>
              <a
                href="mailto:support@phoneplace.com"
                className="px-6 py-3 border border-gold/30 text-gold hover:bg-gold/5 rounded font-semibold transition-colors"
              >
                Email Support
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
