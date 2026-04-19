import { Link } from 'react-router-dom';

const INSTAGRAM_URL =
  'https://www.instagram.com/phone_palace_amberpet?igsh=ZW5kbzVjNGdsb3B1';
const WHATSAPP_URL = 'https://wa.me/917997000166';

export default function Footer() {
  return (
    <footer id="contact" className="py-16 px-6 text-center">
      {/* Gold divider */}
      <div className="gold-line mb-12 mx-auto" style={{ width: '100%', maxWidth: '900px' }} />

      <p
        className="font-display text-ivory text-xl md:text-2xl mb-2"
        style={{ fontStyle: 'italic', fontWeight: 400 }}
      >
        Phone Palace
      </p>

      <p
        className="font-body text-silver text-xs uppercase mb-3"
        style={{ letterSpacing: '0.25em' }}
      >
        Premium Mobile Accessories · Amberpet, Hyderabad
      </p>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body text-gold text-xs hover:text-gold-pale transition-colors duration-300 block mb-10"
        style={{ letterSpacing: '0.2em' }}
      >
        +91 79970 00166
      </a>

      {/* Social / nav links */}
      <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300"
          style={{ letterSpacing: '0.2em' }}
        >
          Instagram
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300"
          style={{ letterSpacing: '0.2em' }}
        >
          WhatsApp
        </a>
        <Link
          to="/admin"
          className="font-body text-silver text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300"
          style={{ letterSpacing: '0.2em' }}
        >
          Admin
        </Link>
      </div>

      <p className="font-body text-silver/40 text-xs">
        © 2025 Phone Palace. All rights reserved.
      </p>
    </footer>
  );
}
