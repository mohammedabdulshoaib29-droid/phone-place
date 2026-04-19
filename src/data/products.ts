export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type ProductVariant = {
  label: string;
  value: string;
  price?: number;
  stockStatus?: StockStatus;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  category: string;
  categoryKey:
    | 'back-covers'
    | 'tempered-glass'
    | 'chargers'
    | 'cables'
    | 'wireless-audio'
    | 'power-banks'
    | 'car-accessories'
    | 'stands';
  name: string;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  attribution: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  stockStatus: StockStatus;
  stockCount: number;
  compatibleWith: string[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  relatedIds: string[];
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
};

export const STOCK_STATUS_STYLES: Record<StockStatus, string> = {
  'in-stock': 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10',
  'low-stock': 'text-amber-300 border-amber-400/40 bg-amber-500/10',
  'out-of-stock': 'text-red-300 border-red-400/40 bg-red-500/10',
};

export const products: Product[] = [
  {
    id: 'armoured-elegance',
    slug: 'armoured-elegance',
    category: 'MOBILE BACK COVERS',
    categoryKey: 'back-covers',
    name: 'Armoured Elegance',
    tagline: 'Military-grade confidence with a refined matte silhouette.',
    description:
      'A dual-layer shockproof case built for everyday drops, camera protection, and premium grip. The raised bezels, metal button covers, and anti-slip texture make it an easy upgrade for users who want stronger protection without a bulky feel.',
    image:
      'https://images.unsplash.com/photo-1603313011186-4711e7f8e477?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1603313011186-4711e7f8e477?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Mason Supply on Unsplash',
    price: 499,
    originalPrice: 699,
    rating: 4.8,
    reviewCount: 214,
    featured: true,
    bestSeller: true,
    stockStatus: 'in-stock',
    stockCount: 24,
    compatibleWith: ['iPhone 15', 'iPhone 14', 'Samsung S24', 'OnePlus 12R'],
    variants: [
      { label: 'Black', value: 'black' },
      { label: 'Blue', value: 'blue' },
      { label: 'Red', value: 'red', stockStatus: 'low-stock' },
      { label: 'Titan Grey', value: 'titan-grey' },
    ],
    specifications: [
      { label: 'Material', value: 'TPU + polycarbonate shell' },
      { label: 'Drop Protection', value: 'Up to 12 ft' },
      { label: 'Finish', value: 'Matte anti-fingerprint coating' },
      { label: 'Weight', value: '45 g' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['crystal-clarity', 'lens-guard-pro', 'magnetic-car-vent-mount'],
  },
  {
    id: 'silkshield-clear-case',
    slug: 'silkshield-clear-case',
    category: 'MOBILE BACK COVERS',
    categoryKey: 'back-covers',
    name: 'SilkShield Clear Case',
    tagline: 'Crystal-clear protection that keeps your device design visible.',
    description:
      'A slim transparent case with reinforced corners, yellowing-resistant polymer, and responsive button covers. Designed for customers who want daily scratch protection without hiding the original phone finish.',
    image:
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 349,
    originalPrice: 499,
    rating: 4.6,
    reviewCount: 136,
    stockStatus: 'in-stock',
    stockCount: 31,
    compatibleWith: ['iPhone 15', 'iPhone 14', 'Samsung S24'],
    variants: [
      { label: 'Clear', value: 'clear' },
      { label: 'Frosted Clear', value: 'frosted-clear' },
      { label: 'Smoke Transparent', value: 'smoke-transparent' },
    ],
    specifications: [
      { label: 'Material', value: 'Flexible anti-yellow TPU' },
      { label: 'Protection', value: 'Raised lip for screen and camera' },
      { label: 'Grip', value: 'Soft-touch side rails' },
      { label: 'Weight', value: '32 g' },
      { label: 'Warranty', value: '3 months replacement support' },
    ],
    relatedIds: ['crystal-clarity', 'camera-ring-armor', 'flexcore-usb-c-cable'],
  },
  {
    id: 'leather-luxe-folio',
    slug: 'leather-luxe-folio',
    category: 'MOBILE BACK COVERS',
    categoryKey: 'back-covers',
    name: 'Leather Luxe Folio',
    tagline: 'Elegant folio storage and all-round screen coverage.',
    description:
      'A premium folio case crafted for professionals who want card slots, stand mode, and front-screen protection in one accessory. Strong magnetic closure and stitched edges deliver a polished everyday-carry experience.',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewCount: 82,
    stockStatus: 'low-stock',
    stockCount: 5,
    compatibleWith: ['iPhone 15', 'Samsung S24', 'OnePlus 12'],
    variants: [
      { label: 'Espresso Brown', value: 'espresso-brown' },
      { label: 'Midnight Black', value: 'midnight-black' },
      { label: 'Wine Red', value: 'wine-red', stockStatus: 'low-stock' },
    ],
    specifications: [
      { label: 'Material', value: 'PU leather + microfiber lining' },
      { label: 'Card Slots', value: '3 card slots + cash sleeve' },
      { label: 'Viewing Mode', value: 'Built-in kickstand fold' },
      { label: 'Closure', value: 'Magnetic clasp' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['crystal-clarity', 'magnetic-car-vent-mount', 'voltport-30w-mini'],
  },
  {
    id: 'crystal-clarity',
    slug: 'crystal-clarity',
    category: 'TEMPERED GLASS',
    categoryKey: 'tempered-glass',
    name: 'Crystal Clarity',
    tagline: 'Precision-cut glass with flagship-level touch response.',
    description:
      'An optical-grade 9H tempered glass built for crisp display output, smooth finger glide, and strong scratch resistance. Perfect for users who want edge-to-edge coverage with an easy-install frame and bubble-free fit.',
    image:
      'https://images.pexels.com/photos/14979020/pexels-photo-14979020.jpeg?auto=compress&cs=tinysrgb&w=900',
    gallery: [
      'https://images.pexels.com/photos/14979020/pexels-photo-14979020.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Kafeel Ahmed on Pexels',
    price: 249,
    originalPrice: 349,
    rating: 4.7,
    reviewCount: 301,
    featured: true,
    bestSeller: true,
    stockStatus: 'in-stock',
    stockCount: 58,
    compatibleWith: ['iPhone 15', 'iPhone 14', 'iPhone 13', 'Samsung S24'],
    variants: [
      { label: 'iPhone 15', value: 'iphone-15' },
      { label: 'iPhone 14', value: 'iphone-14' },
      { label: 'iPhone 13', value: 'iphone-13' },
      { label: 'Samsung S24', value: 'samsung-s24' },
    ],
    specifications: [
      { label: 'Hardness', value: '9H Japanese glass' },
      { label: 'Transparency', value: '99.9% optical clarity' },
      { label: 'Coating', value: 'Oleophobic anti-smudge' },
      { label: 'Coverage', value: 'Full edge-to-edge' },
      { label: 'In The Box', value: 'Glass, frame, wipes, dust stickers' },
    ],
    relatedIds: ['armoured-elegance', 'silkshield-clear-case', 'lens-guard-pro'],
  },
  {
    id: 'privacy-guard-glass',
    slug: 'privacy-guard-glass',
    category: 'TEMPERED GLASS',
    categoryKey: 'tempered-glass',
    name: 'Privacy Guard Glass',
    tagline: 'Keep your screen visible only to you.',
    description:
      'A privacy tempered glass engineered for commuters and office use. It reduces side-angle visibility while preserving front-view brightness and touch smoothness, helping protect confidential messages and payment details.',
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 399,
    originalPrice: 549,
    rating: 4.5,
    reviewCount: 94,
    stockStatus: 'low-stock',
    stockCount: 7,
    compatibleWith: ['iPhone 15', 'iPhone 14', 'Samsung S24'],
    variants: [
      { label: 'iPhone 15', value: 'iphone-15' },
      { label: 'iPhone 14', value: 'iphone-14', stockStatus: 'low-stock' },
      { label: 'Samsung S24', value: 'samsung-s24' },
    ],
    specifications: [
      { label: 'Visibility Angle', value: 'Approx. 28° side privacy' },
      { label: 'Hardness', value: '9H reinforced glass' },
      { label: 'Coating', value: 'Anti-fingerprint matte layer' },
      { label: 'Installation', value: 'Bubble-free alignment tray' },
      { label: 'Warranty', value: '7-day fit replacement' },
    ],
    relatedIds: ['armoured-elegance', 'camera-ring-armor', 'powervault-10000'],
  },
  {
    id: 'lens-guard-pro',
    slug: 'lens-guard-pro',
    category: 'TEMPERED GLASS',
    categoryKey: 'tempered-glass',
    name: 'Lens Guard Pro',
    tagline: 'Protect your camera rings without affecting clarity.',
    description:
      'Tempered lens caps with scratch-resistant sapphire-style finish for flagship camera modules. Maintains flash output and camera sharpness while defending raised camera bumps from daily wear.',
    image:
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 199,
    originalPrice: 299,
    rating: 4.6,
    reviewCount: 122,
    stockStatus: 'in-stock',
    stockCount: 33,
    compatibleWith: ['iPhone 15 Pro', 'iPhone 15', 'Samsung S24 Ultra'],
    variants: [
      { label: 'Clear', value: 'clear' },
      { label: 'Black Ring', value: 'black-ring' },
      { label: 'Titanium Ring', value: 'titanium-ring' },
    ],
    specifications: [
      { label: 'Material', value: '9H camera lens glass' },
      { label: 'Thickness', value: '0.22 mm' },
      { label: 'Finish', value: 'HD transparent coating' },
      { label: 'Installation', value: 'Individual ring alignment' },
      { label: 'Pack Size', value: 'Set of 2' },
    ],
    relatedIds: ['armoured-elegance', 'crystal-clarity', 'silkshield-clear-case'],
  },
  {
    id: 'pure-power-65w',
    slug: 'pure-power-65w',
    category: 'CHARGERS & CABLES',
    categoryKey: 'chargers',
    name: 'Pure Power 65W',
    tagline: 'High-speed GaN charging for phones, tablets, and laptops.',
    description:
      'A travel-ready GaN wall charger with intelligent power distribution, low heat output, and wide device compatibility. Ideal for users who want one adapter for phone fast charging and compact laptop top-ups.',
    image:
      'https://images.pexels.com/photos/7989741/pexels-photo-7989741.jpeg?auto=compress&cs=tinysrgb&w=900',
    gallery: [
      'https://images.pexels.com/photos/7989741/pexels-photo-7989741.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Carlos Jairo on Pexels',
    price: 799,
    originalPrice: 1099,
    rating: 4.8,
    reviewCount: 187,
    featured: true,
    bestSeller: true,
    stockStatus: 'in-stock',
    stockCount: 18,
    compatibleWith: ['iPhone', 'Samsung', 'OnePlus', 'iPad', 'MacBook Air'],
    variants: [
      { label: '65W White', value: '65w-white' },
      { label: '65W Black', value: '65w-black' },
      { label: '45W White', value: '45w-white', price: 699 },
    ],
    specifications: [
      { label: 'Output', value: 'Up to 65W PD fast charge' },
      { label: 'Ports', value: '2× USB-C + 1× USB-A' },
      { label: 'Technology', value: 'GaN low-heat architecture' },
      { label: 'Safety', value: 'Over-voltage and surge protection' },
      { label: 'Warranty', value: '1 year replacement warranty' },
    ],
    relatedIds: ['flexcore-usb-c-cable', 'magflow-dual-pad', 'powervault-10000'],
  },
  {
    id: 'voltport-30w-mini',
    slug: 'voltport-30w-mini',
    category: 'CHARGERS & CABLES',
    categoryKey: 'chargers',
    name: 'VoltPort 30W Mini',
    tagline: 'Pocket-size fast charging for everyday carry.',
    description:
      'A compact single-port wall charger built for modern phones and earbuds. It slips into small bags and travel pouches easily while still delivering enough power for rapid charging on the move.',
    image:
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 499,
    originalPrice: 699,
    rating: 4.6,
    reviewCount: 108,
    stockStatus: 'in-stock',
    stockCount: 26,
    compatibleWith: ['iPhone', 'Samsung', 'Pixel', 'Nothing Phone'],
    variants: [
      { label: 'White', value: 'white' },
      { label: 'Black', value: 'black' },
    ],
    specifications: [
      { label: 'Output', value: '30W USB-C PD' },
      { label: 'Design', value: 'Foldable prongs mini body' },
      { label: 'Use Case', value: 'Fast top-ups for phones and earbuds' },
      { label: 'Weight', value: '58 g' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['flexcore-usb-c-cable', 'crystal-clarity', 'airpulse-neckband'],
  },
  {
    id: 'flexcore-usb-c-cable',
    slug: 'flexcore-usb-c-cable',
    category: 'CHARGERS & CABLES',
    categoryKey: 'cables',
    name: 'FlexCore USB-C Cable',
    tagline: 'Braided strength with fast-charge stability.',
    description:
      'A reinforced nylon-braided cable built to survive daily bends, desk use, and travel. Supports high-speed charging and quick sync for modern USB-C phones, tablets, and accessories.',
    image:
      'https://images.unsplash.com/photo-1580906853203-f82f986727b1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1580906853203-f82f986727b1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 299,
    originalPrice: 399,
    rating: 4.7,
    reviewCount: 174,
    stockStatus: 'in-stock',
    stockCount: 42,
    compatibleWith: ['USB-C phones', 'Tablets', 'Power banks', 'Earbuds'],
    variants: [
      { label: '1 Meter - Black', value: '1m-black' },
      { label: '1 Meter - Red', value: '1m-red' },
      { label: '2 Meter - Black', value: '2m-black', price: 399 },
      { label: '2 Meter - Blue', value: '2m-blue', price: 399 },
    ],
    specifications: [
      { label: 'Length Options', value: '1 m and 2 m' },
      { label: 'Current Support', value: 'Up to 5A fast charge' },
      { label: 'Build', value: 'Braided nylon with metal heads' },
      { label: 'Compatibility', value: 'USB-C to USB-C' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['pure-power-65w', 'voltport-30w-mini', 'powervault-10000'],
  },
  {
    id: 'lightning-weave-cable',
    slug: 'lightning-weave-cable',
    category: 'CHARGERS & CABLES',
    categoryKey: 'cables',
    name: 'Lightning Weave Cable',
    tagline: 'Reliable braided charging for iPhone users.',
    description:
      'Built for Apple users who want dependable daily charging with tougher strain relief and cleaner cable management. Ideal for car, desk, and bedside charging setups.',
    image:
      'https://images.unsplash.com/photo-1580906853203-f82f986727b1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1580906853203-f82f986727b1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 349,
    originalPrice: 449,
    rating: 4.5,
    reviewCount: 91,
    stockStatus: 'low-stock',
    stockCount: 8,
    compatibleWith: ['iPhone 14', 'iPhone 13', 'AirPods', 'iPad Lightning'],
    variants: [
      { label: '1 Meter - White', value: '1m-white' },
      { label: '2 Meter - White', value: '2m-white', price: 449, stockStatus: 'low-stock' },
    ],
    specifications: [
      { label: 'Connector', value: 'USB-C to Lightning' },
      { label: 'Length Options', value: '1 m and 2 m' },
      { label: 'Build', value: 'Braided jacket + reinforced joints' },
      { label: 'Use Case', value: 'Phone, earbuds, in-car charging' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['voltport-30w-mini', 'powervault-10000', 'crystal-clarity'],
  },
  {
    id: 'sonic-supremacy',
    slug: 'sonic-supremacy',
    category: 'EARBUDS & EARPODS',
    categoryKey: 'wireless-audio',
    name: 'Sonic Supremacy',
    tagline: 'ANC earbuds tuned for immersive calls, music, and gaming.',
    description:
      'Premium wireless earbuds with active noise cancellation, deep bass tuning, low-latency pairing, and all-day battery. Ideal for users who want reliable calling and punchy sound in a compact luxury finish.',
    image:
      'https://images.pexels.com/photos/9956763/pexels-photo-9956763.jpeg?auto=compress&cs=tinysrgb&w=900',
    gallery: [
      'https://images.pexels.com/photos/9956763/pexels-photo-9956763.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Emmanuel Jason Eliphalet on Pexels',
    price: 1299,
    originalPrice: 1699,
    rating: 4.8,
    reviewCount: 243,
    featured: true,
    stockStatus: 'in-stock',
    stockCount: 16,
    compatibleWith: ['Android', 'iPhone', 'Windows', 'Mac'],
    variants: [
      { label: 'Pearl White', value: 'pearl-white' },
      { label: 'Graphite Black', value: 'graphite-black' },
      { label: 'Navy Blue', value: 'navy-blue' },
    ],
    specifications: [
      { label: 'Battery', value: '30 hours total with case' },
      { label: 'Noise Control', value: 'ANC + ENC calling' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
      { label: 'Water Resistance', value: 'IPX5 splash resistant' },
      { label: 'Warranty', value: '1 year replacement warranty' },
    ],
    relatedIds: ['voltport-30w-mini', 'powervault-10000', 'magflow-dual-pad'],
  },
  {
    id: 'airpulse-neckband',
    slug: 'airpulse-neckband',
    category: 'EARBUDS & EARPODS',
    categoryKey: 'wireless-audio',
    name: 'AirPulse Neckband',
    tagline: 'Comfort-first wireless audio for long listening sessions.',
    description:
      'A lightweight neckband designed for calls, commute, and workouts. Delivers stable Bluetooth pairing, good passive isolation, and quick charging for users who prefer an around-the-neck form factor.',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 899,
    originalPrice: 1199,
    rating: 4.4,
    reviewCount: 77,
    stockStatus: 'in-stock',
    stockCount: 20,
    compatibleWith: ['Android', 'iPhone', 'Windows'],
    variants: [
      { label: 'Black', value: 'black' },
      { label: 'Blue', value: 'blue' },
    ],
    specifications: [
      { label: 'Battery', value: 'Up to 24 hours' },
      { label: 'Driver', value: '12 mm dynamic driver' },
      { label: 'Charge Time', value: '10 min = 8 hours playback' },
      { label: 'Water Resistance', value: 'IPX4 sweat resistant' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['voltport-30w-mini', 'pure-power-65w', 'powervault-10000'],
  },
  {
    id: 'magflow-dual-pad',
    slug: 'magflow-dual-pad',
    category: 'CHARGERS & CABLES',
    categoryKey: 'chargers',
    name: 'MagFlow Dual Pad',
    tagline: 'Minimal wireless charging for phone and earbuds together.',
    description:
      'A sleek wireless charging pad for users who want a clutter-free bedside or desk setup. Charges a compatible phone and earbuds side by side with thermal control and foreign object detection.',
    image:
      'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 1499,
    originalPrice: 1899,
    rating: 4.6,
    reviewCount: 63,
    isNew: true,
    stockStatus: 'low-stock',
    stockCount: 6,
    compatibleWith: ['MagSafe iPhones', 'Qi phones', 'Wireless earbuds'],
    variants: [
      { label: 'Black', value: 'black' },
      { label: 'Sandstone', value: 'sandstone', stockStatus: 'low-stock' },
    ],
    specifications: [
      { label: 'Charging Type', value: '15W phone + 5W earbuds' },
      { label: 'Alignment', value: 'Magnetic assisted' },
      { label: 'Safety', value: 'Thermal regulation + FOD' },
      { label: 'Cable Included', value: 'USB-C braided cable' },
      { label: 'Warranty', value: '1 year replacement warranty' },
    ],
    relatedIds: ['pure-power-65w', 'sonic-supremacy', 'powervault-10000'],
  },
  {
    id: 'powervault-10000',
    slug: 'powervault-10000',
    category: 'POWER BANKS',
    categoryKey: 'power-banks',
    name: 'PowerVault 10000',
    tagline: 'Slim backup power with airline-friendly convenience.',
    description:
      'A compact 10000mAh power bank designed for day trips, office commutes, and emergency top-ups. Supports two-way fast charging and fits easily into sling bags and laptop sleeves.',
    image:
      'https://images.unsplash.com/photo-1609592424826-4c7d9fcd4d7d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1609592424826-4c7d9fcd4d7d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 1199,
    originalPrice: 1499,
    rating: 4.7,
    reviewCount: 112,
    stockStatus: 'in-stock',
    stockCount: 19,
    compatibleWith: ['Phones', 'Earbuds', 'Smartwatches', 'Portable devices'],
    variants: [
      { label: 'Black', value: 'black' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
    ],
    specifications: [
      { label: 'Capacity', value: '10000mAh' },
      { label: 'Output', value: '22.5W fast charge' },
      { label: 'Ports', value: 'USB-C + 2× USB-A' },
      { label: 'Body', value: 'Slim matte ABS shell' },
      { label: 'Warranty', value: '1 year replacement warranty' },
    ],
    relatedIds: ['pure-power-65w', 'flexcore-usb-c-cable', 'sonic-supremacy'],
  },
  {
    id: 'powervault-20000',
    slug: 'powervault-20000',
    category: 'POWER BANKS',
    categoryKey: 'power-banks',
    name: 'PowerVault 20000',
    tagline: 'High-capacity travel backup for heavy users.',
    description:
      'A larger-capacity power bank for multi-device users, longer trips, and creators on the move. Supports simultaneous charging with strong battery endurance and dependable fast-charge output.',
    image:
      'https://images.unsplash.com/photo-1609592424826-4c7d9fcd4d7d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1609592424826-4c7d9fcd4d7d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 1799,
    originalPrice: 2199,
    rating: 4.6,
    reviewCount: 89,
    stockStatus: 'low-stock',
    stockCount: 4,
    compatibleWith: ['Phones', 'Tablets', 'Earbuds', 'Handheld consoles'],
    variants: [
      { label: 'Black', value: 'black' },
      { label: 'Titan Grey', value: 'titan-grey', stockStatus: 'low-stock' },
    ],
    specifications: [
      { label: 'Capacity', value: '20000mAh' },
      { label: 'Output', value: '20W PD + QC fast charge' },
      { label: 'Ports', value: 'USB-C + 2× USB-A' },
      { label: 'Display', value: 'Digital battery percentage' },
      { label: 'Warranty', value: '1 year replacement warranty' },
    ],
    relatedIds: ['pure-power-65w', 'flexcore-usb-c-cable', 'magflow-dual-pad'],
  },
  {
    id: 'magnetic-car-vent-mount',
    slug: 'magnetic-car-vent-mount',
    category: 'CAR ACCESSORIES',
    categoryKey: 'car-accessories',
    name: 'Magnetic Car Vent Mount',
    tagline: 'Stable one-hand phone mounting for navigation.',
    description:
      'A compact magnetic mount designed for quick placement, strong grip, and stable viewing while driving. Works well for navigation, hands-free calling, and charging-on-the-go setups.',
    image:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 449,
    originalPrice: 599,
    rating: 4.5,
    reviewCount: 68,
    stockStatus: 'in-stock',
    stockCount: 15,
    compatibleWith: ['Most phones and case combinations'],
    variants: [
      { label: 'Black', value: 'black' },
      { label: 'Silver', value: 'silver' },
    ],
    specifications: [
      { label: 'Mount Type', value: 'Air vent magnetic clip' },
      { label: 'Rotation', value: '360° adjustable head' },
      { label: 'Grip', value: 'Strong N52 magnets' },
      { label: 'In The Box', value: 'Mount + 2 metal plates' },
      { label: 'Warranty', value: '3 months replacement support' },
    ],
    relatedIds: ['armoured-elegance', 'pure-power-65w', 'lightning-weave-cable'],
  },
  {
    id: 'dash-clamp-pro',
    slug: 'dash-clamp-pro',
    category: 'CAR ACCESSORIES',
    categoryKey: 'car-accessories',
    name: 'Dash Clamp Pro',
    tagline: 'Secure dashboard mounting for larger phones.',
    description:
      'A clamp-style dashboard holder with telescopic reach and strong suction for users who want a non-magnetic mount. Great for larger phones, thick cases, and adjustable viewing angles.',
    image:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 699,
    originalPrice: 899,
    rating: 4.4,
    reviewCount: 54,
    stockStatus: 'in-stock',
    stockCount: 11,
    compatibleWith: ['Phones up to 7 inches'],
    variants: [
      { label: 'Dashboard Mount', value: 'dashboard-mount' },
      { label: 'Windshield Mount', value: 'windshield-mount' },
    ],
    specifications: [
      { label: 'Mount Type', value: 'Clamp arm with suction base' },
      { label: 'Extension', value: 'Telescopic adjustable arm' },
      { label: 'Rotation', value: '360° head adjustment' },
      { label: 'Grip', value: 'Side-lock phone clamp' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['pure-power-65w', 'flexcore-usb-c-cable', 'powervault-10000'],
  },
  {
    id: 'deskfold-aluminium-stand',
    slug: 'deskfold-aluminium-stand',
    category: 'PHONE STANDS',
    categoryKey: 'stands',
    name: 'DeskFold Aluminium Stand',
    tagline: 'An elegant desktop stand for work, calls, and streaming.',
    description:
      'A premium foldable aluminium stand with anti-slip pads and adjustable angles. Ideal for video calls, content watching, and keeping charging cables neatly routed while your device stays visible.',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 599,
    originalPrice: 799,
    rating: 4.7,
    reviewCount: 96,
    stockStatus: 'in-stock',
    stockCount: 22,
    compatibleWith: ['Phones', 'Mini tablets', 'E-readers'],
    variants: [
      { label: 'Silver', value: 'silver' },
      { label: 'Space Grey', value: 'space-grey' },
      { label: 'Rose Gold', value: 'rose-gold' },
    ],
    specifications: [
      { label: 'Body', value: 'CNC aluminium alloy' },
      { label: 'Adjustment', value: 'Multi-angle foldable hinge' },
      { label: 'Support', value: 'Phones and mini tablets' },
      { label: 'Padding', value: 'Silicone anti-slip contact points' },
      { label: 'Warranty', value: '6 months replacement support' },
    ],
    relatedIds: ['pure-power-65w', 'magflow-dual-pad', 'flexcore-usb-c-cable'],
  },
  {
    id: 'pocket-ring-stand',
    slug: 'pocket-ring-stand',
    category: 'PHONE STANDS',
    categoryKey: 'stands',
    name: 'Pocket Ring Stand',
    tagline: 'Grip, stand, and carry support in one compact add-on.',
    description:
      'A lightweight stick-on ring stand that improves one-hand grip and props your phone up for quick viewing. A budget-friendly choice for customers who want extra confidence while handling larger phones.',
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 199,
    originalPrice: 299,
    rating: 4.3,
    reviewCount: 58,
    stockStatus: 'out-of-stock',
    stockCount: 0,
    compatibleWith: ['Flat-back cases and phones'],
    variants: [
      { label: 'Black', value: 'black', stockStatus: 'out-of-stock' },
      { label: 'Gold', value: 'gold', stockStatus: 'out-of-stock' },
      { label: 'Rose Gold', value: 'rose-gold', stockStatus: 'out-of-stock' },
    ],
    specifications: [
      { label: 'Material', value: 'Zinc alloy ring + adhesive base' },
      { label: 'Function', value: 'Grip support + kickstand' },
      { label: 'Rotation', value: '360° rotating ring' },
      { label: 'Use Case', value: 'One-hand use and quick media viewing' },
      { label: 'Warranty', value: 'No replacement on adhesive wear' },
    ],
    relatedIds: ['deskfold-aluminium-stand', 'silkshield-clear-case', 'armoured-elegance'],
  },
  {
    id: 'camera-ring-armor',
    slug: 'camera-ring-armor',
    category: 'TEMPERED GLASS',
    categoryKey: 'tempered-glass',
    name: 'Camera Ring Armor',
    tagline: 'Metal-edged lens protection with a premium finish.',
    description:
      'A stylized camera ring protector that combines metal-edge aesthetics with scratch-resistant clear glass. It adds a subtle premium look while shielding the lens housing from pocket and table abrasion.',
    image:
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    ],
    attribution: 'Unsplash',
    price: 249,
    originalPrice: 349,
    rating: 4.4,
    reviewCount: 47,
    stockStatus: 'in-stock',
    stockCount: 13,
    compatibleWith: ['iPhone 15 Pro', 'iPhone 15', 'Samsung S24 Ultra'],
    variants: [
      { label: 'Black Titanium', value: 'black-titanium' },
      { label: 'Silver', value: 'silver' },
      { label: 'Gold', value: 'gold' },
    ],
    specifications: [
      { label: 'Material', value: 'Aluminium ring + tempered insert' },
      { label: 'Protection', value: 'Scratch and dust shielding' },
      { label: 'Fit', value: 'Independent ring installation' },
      { label: 'Finish', value: 'Color-matched metallic edge' },
      { label: 'Pack Size', value: '3 lens rings set' },
    ],
    relatedIds: ['armoured-elegance', 'privacy-guard-glass', 'silkshield-clear-case'],
  },
];

export const featuredProducts = products.filter((product) => product.featured);

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(product: Product, count = 3) {
  return product.relatedIds
    .map((relatedId) => products.find((item) => item.id === relatedId))
    .filter((item): item is Product => Boolean(item))
    .slice(0, count);
}
