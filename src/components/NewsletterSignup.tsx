import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to localStorage (in production, send to backend)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }

      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p
          className="font-body text-gold text-xs uppercase tracking-widest mb-3"
          style={{ letterSpacing: '0.4em' }}
        >
          Stay Updated
        </p>

        <h3
          className="font-display text-ivory text-2xl md:text-3xl mb-3"
          style={{ fontStyle: 'italic', fontWeight: 700 }}
        >
          Subscribe to Our Newsletter
        </h3>

        <p className="font-body text-silver text-sm mb-8 max-w-lg mx-auto">
          Get exclusive deals, new product launches, and premium tips delivered to your inbox every week.
          Join {subscribed ? '✓ 2,400+' : '2,400+'} happy subscribers.
        </p>

        <div className="gold-line mb-8 mx-auto" style={{ width: '40px' }} />

        {/* Subscription form */}
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-luxury flex-1"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading || subscribed}
            className="btn-gold whitespace-nowrap"
            style={{ padding: '0.7rem 2rem' }}
          >
            {subscribed ? '✓ Subscribed!' : loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {error && <p className="font-body text-red-400 text-xs mt-3">{error}</p>}

        {/* Privacy notice */}
        <p className="font-body text-silver/50 text-xs mt-6">
          We respect your privacy. Unsubscribe anytime. No spam, ever.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-xs">
          <div>
            <span className="text-lg mb-2 block">🎁</span>
            <p className="font-body text-silver">Exclusive Deals</p>
          </div>
          <div>
            <span className="text-lg mb-2 block">📦</span>
            <p className="font-body text-silver">New Launches</p>
          </div>
          <div>
            <span className="text-lg mb-2 block">💡</span>
            <p className="font-body text-silver">Expert Tips</p>
          </div>
        </div>
      </div>
    </section>
  );
}
