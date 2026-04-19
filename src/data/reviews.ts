export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful?: number;
  avatar?: string;
};

export const reviews: Review[] = [
  // Armoured Elegance Reviews
  {
    id: 'review-1',
    productId: 'armoured-elegance',
    author: 'Rajesh Kumar',
    rating: 5,
    title: 'Best case I\'ve ever bought!',
    content: 'The protection is amazing and the design looks premium. My phone fell from waist height twice and not a single scratch. Highly recommended!',
    date: '2024-03-15',
    verified: true,
    helpful: 24,
    avatar: 'RK',
  },
  {
    id: 'review-2',
    productId: 'armoured-elegance',
    author: 'Priya Singh',
    rating: 4,
    title: 'Great quality, slightly thick',
    content: 'Excellent build quality and protection. My only concern is it\'s slightly thicker than expected, but worth it for the safety it provides.',
    date: '2024-03-10',
    verified: true,
    helpful: 12,
    avatar: 'PS',
  },
  {
    id: 'review-3',
    productId: 'armoured-elegance',
    author: 'Arjun Patel',
    rating: 5,
    title: 'Professional grade protection',
    content: 'Using for 2 months now. Still looks brand new. The matte finish doesn\'t show fingerprints. Love it!',
    date: '2024-02-28',
    verified: true,
    helpful: 18,
    avatar: 'AP',
  },

  // Crystal Clarity Reviews
  {
    id: 'review-4',
    productId: 'crystal-clarity',
    author: 'Neha Desai',
    rating: 5,
    title: 'Perfect clarity and smoothness',
    content: 'Installation was super easy with the alignment frame. Touch response is buttery smooth. Can\'t even feel it\'s there!',
    date: '2024-03-18',
    verified: true,
    helpful: 31,
    avatar: 'ND',
  },
  {
    id: 'review-5',
    productId: 'crystal-clarity',
    author: 'Vikram Reddy',
    rating: 4,
    title: 'Great but minor air bubble',
    content: 'Quality is top notch. Had a tiny air bubble in the corner but nothing major. Customer service helped with quick replacement.',
    date: '2024-03-05',
    verified: true,
    helpful: 15,
    avatar: 'VR',
  },
  {
    id: 'review-6',
    productId: 'crystal-clarity',
    author: 'Anjali Nair',
    rating: 5,
    title: 'Best screen protector ever!',
    content: 'Applied it myself in under 2 minutes. The oleophobic coating is fantastic - doesn\'t attract fingerprints at all. Worth every rupee!',
    date: '2024-02-25',
    verified: true,
    helpful: 28,
    avatar: 'AN',
  },

  // Pure Power 65W Reviews
  {
    id: 'review-7',
    productId: 'pure-power-65w',
    author: 'Aditya Sharma',
    rating: 5,
    title: 'One charger for everything',
    content: 'Charges my phone, iPad, and even powers my laptop! The compact size is a game-changer for travel. No overheating, rock solid.',
    date: '2024-03-12',
    verified: true,
    helpful: 42,
    avatar: 'AS',
  },
  {
    id: 'review-8',
    productId: 'pure-power-65w',
    author: 'Divya Chauhan',
    rating: 5,
    title: 'Fast charging delivered!',
    content: 'My iPhone charges from 0-100% in just over 30 minutes. The GaN technology is legit. Best investment ever!',
    date: '2024-03-08',
    verified: true,
    helpful: 35,
    avatar: 'DC',
  },
  {
    id: 'review-9',
    productId: 'pure-power-65w',
    author: 'Mohit Verma',
    rating: 4,
    title: 'Great charger, cable not included',
    content: 'Performance is excellent but I had to buy a cable separately. Still worth it though. Runs cool and charges fast.',
    date: '2024-02-20',
    verified: true,
    helpful: 19,
    avatar: 'MV',
  },

  // SilkShield Clear Case Reviews
  {
    id: 'review-10',
    productId: 'silkshield-clear-case',
    author: 'Pooja Menon',
    rating: 5,
    title: 'See your phone, protect it too',
    content: 'Minimal aesthetics with great protection. The clear TPU hasn\'t yellowed even after a month of use. Impressed!',
    date: '2024-03-14',
    verified: true,
    helpful: 22,
    avatar: 'PM',
  },
  {
    id: 'review-11',
    productId: 'silkshield-clear-case',
    author: 'Sandeep Singh',
    rating: 4,
    title: 'Good case but slight discoloration',
    content: 'Fits perfectly and feels premium. Slight yellowing starting to show after 3 months but still acceptable.',
    date: '2024-02-15',
    verified: true,
    helpful: 8,
    avatar: 'SS',
  },

  // Leather Luxe Folio Reviews
  {
    id: 'review-12',
    productId: 'leather-luxe-folio',
    author: 'Isha Gupta',
    rating: 5,
    title: 'Luxury meets functionality',
    content: 'The leather feels authentic and premium. Card slots are perfectly sized. Magnetic closure is satisfying. Love this folio!',
    date: '2024-03-11',
    verified: true,
    helpful: 26,
    avatar: 'IG',
  },
  {
    id: 'review-13',
    productId: 'leather-luxe-folio',
    author: 'Rahul Gupta',
    rating: 4,
    title: 'Premium feel, needs break-in',
    content: 'Beautiful leather but it\'s a bit stiff initially. After a week of use, it\'s molding nicely. Definitely a premium product.',
    date: '2024-02-22',
    verified: true,
    helpful: 14,
    avatar: 'RG',
  },

  // FlexCore USB-C Cable Reviews
  {
    id: 'review-14',
    productId: 'flexcore-usb-c-cable',
    author: 'Harsh Pandey',
    rating: 5,
    title: 'Built to last',
    content: 'Using for 3 months with no fraying. The braided design is solid. Fast charging works perfectly. Best cable investment!',
    date: '2024-03-07',
    verified: true,
    helpful: 29,
    avatar: 'HP',
  },
  {
    id: 'review-15',
    productId: 'flexcore-usb-c-cable',
    author: 'Kavya Saxena',
    rating: 5,
    title: 'This cable is a lifesaver',
    content: 'My previous cable kept getting damaged at the connector. This one is so durable! Highly durable and well-built.',
    date: '2024-02-18',
    verified: true,
    helpful: 33,
    avatar: 'KS',
  },

  // Lens Guard Pro Reviews
  {
    id: 'review-16',
    productId: 'lens-guard-pro',
    author: 'Sameer Ahmed',
    rating: 4,
    title: 'Effective camera protection',
    content: 'Camera quality isn\'t affected at all. The lens protection is working as intended. Great for heavy users.',
    date: '2024-03-09',
    verified: true,
    helpful: 17,
    avatar: 'SA',
  },

  // VoltPort 30W Mini Reviews
  {
    id: 'review-17',
    productId: 'voltport-30w-mini',
    author: 'Tanya Reddy',
    rating: 5,
    title: 'Perfect for travel',
    content: 'So compact! Fits in my pocket easily. Charges my phone super fast despite the small size. Travel essential!',
    date: '2024-03-13',
    verified: true,
    helpful: 38,
    avatar: 'TR',
  },

  // Privacy Guard Glass Reviews
  {
    id: 'review-18',
    productId: 'privacy-guard-glass',
    author: 'Rajiv Kumar',
    rating: 5,
    title: 'Privacy on the metro',
    content: 'Perfect for public transport. People can\'t see my screen from the side. Works as advertised!',
    date: '2024-02-28',
    verified: true,
    helpful: 21,
    avatar: 'RK',
  },
];

export const getProductReviews = (productId: string): Review[] => {
  return reviews.filter((r) => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};
