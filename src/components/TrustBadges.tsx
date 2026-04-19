export type TrustBadgeType = 'ssl' | 'secure' | 'authentic' | 'warranty' | 'guarantee' | 'support';

type TrustBadge = {
  icon: string;
  title: string;
  description: string;
};

const badges: Record<TrustBadgeType, TrustBadge> = {
  ssl: {
    icon: '🔒',
    title: 'SSL Encrypted',
    description: '256-bit encryption for all transactions',
  },
  secure: {
    icon: '✓',
    title: 'Secure Checkout',
    description: 'PCI DSS compliant payment processing',
  },
  authentic: {
    icon: '✅',
    title: '100% Authentic',
    description: 'Genuine products with certificates',
  },
  warranty: {
    icon: '🛡️',
    title: 'Warranty Protected',
    description: '3-12 months manufacturer warranty',
  },
  guarantee: {
    icon: '💰',
    title: '30-Day Guarantee',
    description: 'Money-back if not satisfied',
  },
  support: {
    icon: '🤝',
    title: '24/7 Support',
    description: 'Quick response via WhatsApp & Email',
  },
};

type TrustBadgesProps = {
  types?: TrustBadgeType[];
  layout?: 'row' | 'grid';
};

export default function TrustBadges({
  types = ['ssl', 'authentic', 'warranty', 'guarantee'],
  layout = 'grid',
}: TrustBadgesProps) {
  const selectedBadges = types.map((type) => ({ type, ...badges[type] }));

  if (layout === 'row') {
    return (
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {selectedBadges.map((badge) => (
          <div key={badge.type} className="flex flex-col items-center text-center">
            <div className="text-3xl md:text-4xl mb-2">{badge.icon}</div>
            <p className="font-display text-silver text-xs uppercase tracking-widest mb-1">
              {badge.title}
            </p>
            <p className="font-body text-silver/60 text-xs">{badge.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {selectedBadges.map((badge) => (
        <div
          key={badge.type}
          className="border border-gold/20 rounded-lg p-4 text-center hover:border-gold/40 transition-all"
        >
          <div className="text-3xl mb-3">{badge.icon}</div>
          <p className="font-display text-silver text-sm uppercase tracking-widest mb-1">
            {badge.title}
          </p>
          <p className="font-body text-silver/60 text-xs">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
