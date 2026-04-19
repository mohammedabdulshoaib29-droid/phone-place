export type Product = {
  id: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  attribution: string;
  price: number;
};

export const products: Product[] = [
  {
    id: 'back-covers',
    category: 'MOBILE BACK COVERS',
    name: 'Armoured Elegance',
    tagline: 'The finest protection for the finest devices.',
    description:
      'Precision-crafted cases offering military-grade drop protection with a premium matte finish. Available for all major smartphone models. Shockproof TPU + hard PC shell with reinforced corners for all-round defence.',
    image:
      'https://images.unsplash.com/photo-1603313011186-4711e7f8e477?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900',
    attribution: 'Mason Supply on Unsplash',
    price: 499,
  },
  {
    id: 'tempered-glass',
    category: 'TEMPERED GLASS',
    name: 'Crystal Clarity',
    tagline: 'Precision-engineered clarity for your display.',
    description:
      '9H hardness optical-grade tempered glass with oleophobic and anti-fingerprint coating. 99.9% transparency with seamless edge-to-edge coverage. Anti-scratch, anti-glare — fits all major smartphones perfectly.',
    image:
      'https://images.pexels.com/photos/14979020/pexels-photo-14979020.jpeg?auto=compress&cs=tinysrgb&w=900',
    attribution: 'Kafeel Ahmed on Pexels',
    price: 249,
  },
  {
    id: 'earbuds',
    category: 'EARBUDS & EARPODS',
    name: 'Sonic Supremacy',
    tagline: 'Audiophile-grade wireless experience.',
    description:
      'Premium wireless earbuds with active noise cancellation, 30-hour total battery life, and intuitive touch controls. Bluetooth 5.3 with ultra-low latency for gaming and calls. IPX5 water resistance for all-day wear.',
    image:
      'https://images.pexels.com/photos/9956763/pexels-photo-9956763.jpeg?auto=compress&cs=tinysrgb&w=900',
    attribution: 'Emmanuel Jason Eliphalet on Pexels',
    price: 1299,
  },
  {
    id: 'chargers',
    category: 'CHARGERS & CABLES',
    name: 'Pure Power',
    tagline: 'Rapid charge. Zero compromise.',
    description:
      'GaN technology fast charger delivering 65W output — compatible with all devices. Dual USB-C and USB-A ports with intelligent power distribution. Includes premium braided nylon cable. Smart chip prevents overcharging.',
    image:
      'https://images.pexels.com/photos/7989741/pexels-photo-7989741.jpeg?auto=compress&cs=tinysrgb&w=900',
    attribution: 'Carlos Jairo on Pexels',
    price: 799,
  },
];
