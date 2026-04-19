import { Link } from 'react-router-dom';
import TrustBadges from './TrustBadges';

const INSTAGRAM_URL =
  'https://www.instagram.com/phone_palace_amberpet?igsh=ZW5kbzVjNGdsb3B1';
const WHATSAPP_URL = 'https://wa.me/917997000166';

export default function Footer() {
  return (
    <footer id="contact" className="py-24 px-6">
      {/* Gold divider */}
      <div className="gold-line mb-16 mx-auto" style={{ width: '100%', maxWidth: '900px' }} />

      {/* Trust Badges Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <p
          className="font-body text-gold text-xs uppercase tracking-widest text-center mb-8"
          style={{ letterSpacing: '0.4em' }}
        >
          Why Trust Phone Palace
        </p>
        <TrustBadges
          types={['ssl', 'authentic', 'warranty', 'guarantee']}
          layout="grid"
        />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <p
          className="font-display text-ivory text-2xl md:text-3xl mb-2"
          style={{ fontStyle: 'italic', fontWeight: 400 }}
        >
          Phone Palace
        </p>

        <p
          className="font-body text-silver text-xs uppercase mb-4"
          style={{ letterSpacing: '0.25em' }}
        >
          Premium Mobile Accessories · Amberpet, Hyderabad
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-gold text-xs hover:text-gold-pale transition-colors duration-300 inline-block mb-8"
          style={{ letterSpacing: '0.2em' }}
        >
          📞 +91 79970 00166
        </a>
      </div>

      {/* Links Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
        {/* Shop */}
        <div>
          <p className="font-body text-gold text-xs uppercase mb-4 tracking-widest">Shop</p>
          <div className="space-y-3">
            <Link
              to="/products"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              All Products
            </Link>
            <Link
              to="/products"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              New Arrivals
            </Link>
            <Link
              to="/products"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              Best Sellers
            </Link>
          </div>
        </div>

        {/* About */}
        <div>
          <p className="font-body text-gold text-xs uppercase mb-4 tracking-widest">Company</p>
          <div className="space-y-3">
            <Link
              to="/about"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              About Us
            </Link>
            <Link
              to="/faq"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              FAQ
            </Link>
            <Link
              to="/my-orders"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              My Orders
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="font-body text-gold text-xs uppercase mb-4 tracking-widest">Support</p>
          <div className="space-y-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              WhatsApp
            </a>
            <a
              href="mailto:info@phonepalace.com"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              Email
            </a>
            <Link
              to="/faq"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              Help Center
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <p className="font-body text-gold text-xs uppercase mb-4 tracking-widest">Legal</p>
          <div className="space-y-3">
            <Link
              to="/policies"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              Policies
            </Link>
            <Link
              to="/policies"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              Warranty
            </Link>
            <Link
              to="/policies"
              className="font-body text-silver text-xs hover:text-gold transition-colors duration-300 block"
            >
              Returns
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="gold-line mb-8 mx-auto" style={{ width: '100%', maxWidth: '900px' }} />

      <p className="font-body text-silver/50 text-xs text-center">
        © 2025 Phone Palace. All rights reserved. | Hyderabad, India
      </p>
    </footer>
  );
}
