import { useState, useEffect } from 'react';

interface PromoOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  badge: string;
  bgColor: string;
  ctaText: string;
  endDate: string;
}

export default function PromoDisplay() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const promos: PromoOffer[] = [
    {
      id: '1',
      title: 'Summer Sale',
      description: 'Up to 40% off on all accessories',
      discount: '40%',
      badge: '☀️ SUMMER',
      bgColor: 'from-yellow-600/30 to-orange-600/30',
      ctaText: 'Shop Summer Sale',
      endDate: '2025-06-30',
    },
    {
      id: '2',
      title: 'Flash Deal',
      description: 'Limited time offer - 50% off on premium chargers',
      discount: '50%',
      badge: '⚡ FLASH',
      bgColor: 'from-red-600/30 to-pink-600/30',
      ctaText: 'Grab Deals',
      endDate: '2025-04-25',
    },
    {
      id: '3',
      title: 'New Arrivals',
      description: 'Get ₹300 off on new product launches',
      discount: '₹300',
      badge: '🆕 NEW',
      bgColor: 'from-purple-600/30 to-blue-600/30',
      ctaText: 'Explore New',
      endDate: '2025-05-15',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promos.length]);

  useEffect(() => {
    const updateTimer = () => {
      const endDate = new Date(promos[currentPromo].endDate);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Offer Ended');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [currentPromo, promos]);

  const promo = promos[currentPromo];

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Carousel */}
        <div
          className={`relative bg-gradient-to-r ${promo.bgColor} rounded-lg overflow-hidden p-8 md:p-12`}
        >
          {/* Promo Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div>
              <span
                className="inline-block px-4 py-2 bg-gold/20 text-gold rounded-full font-body text-xs uppercase tracking-widest mb-4"
                style={{ letterSpacing: '0.3em' }}
              >
                {promo.badge}
              </span>

              <h2
                className="font-display text-ivory text-3xl md:text-4xl mb-3"
                style={{ fontStyle: 'italic', fontWeight: 700 }}
              >
                {promo.title}
              </h2>

              <p className="font-body text-silver text-lg mb-6">{promo.description}</p>

              {/* Timer & Discount */}
              <div className="flex flex-wrap gap-6 items-center mb-6">
                <div>
                  <p className="font-body text-gold text-xs uppercase tracking-widest mb-1">
                    Save Up To
                  </p>
                  <p className="font-display text-gold text-4xl font-bold">{promo.discount}</p>
                </div>

                <div className="h-16 w-px bg-gold/30" />

                <div>
                  <p className="font-body text-silver text-xs uppercase tracking-widest mb-1">
                    Offer Ends In
                  </p>
                  <p className="font-display text-ivory font-bold text-lg">{timeLeft}</p>
                </div>
              </div>

              <button className="btn-gold">🛍️ {promo.ctaText}</button>
            </div>

            {/* Right: Decorative */}
            <div className="hidden md:flex justify-center text-9xl opacity-20">
              {promo.badge.split(' ')[0]}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex gap-2 mt-8 justify-center">
            {promos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPromo(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentPromo ? 'w-8 bg-gold' : 'bg-gold/30 hover:bg-gold/50'
                }`}
                aria-label={`Go to promo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Promotional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: '✨', title: 'Authentic Products', desc: 'All items verified & tested' },
            { icon: '💳', title: 'Flexible Payment', desc: 'COD & Online options' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <span className="text-4xl mb-3 block">{item.icon}</span>
              <p className="font-body text-ivory font-semibold text-sm mb-1">{item.title}</p>
              <p className="font-body text-silver text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
