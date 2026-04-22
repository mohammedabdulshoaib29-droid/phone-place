import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { gsap } from 'gsap';

const navLinks = [
  { label: 'Book Repair', to: '/book-repair' },
  { label: 'Track Repair', to: '/track-repair' },
  { label: 'Shop', to: '/products' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'My Account', to: '/account' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      "#navbar",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const linkClass =
    'font-body text-silver text-xs tracking-widest uppercase hover:text-gold transition-colors duration-300';

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 md:px-16 transition-all duration-700 ${
        scrolled ? 'bg-carbon/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="font-display text-ivory text-sm uppercase no-underline"
          style={{ letterSpacing: '0.28em' }}
        >
          Phone Palace
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(({ label, to }) => (
          <Link key={label} to={to} className={linkClass} style={{ letterSpacing: '0.22em' }}>
            {label}
          </Link>
        ))}
        <Link to="/admin" className={linkClass} style={{ letterSpacing: '0.22em' }}>
          Admin
        </Link>

        {user ? (
          <div className="flex items-center gap-4 border-l border-gold/30 pl-6">
            <span className="text-gold text-xs">Hi, {user.phone}</span>
            <button onClick={logout} className={linkClass} style={{ letterSpacing: '0.22em' }}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 border-l border-gold/30 pl-6">
            <button onClick={() => navigate('/login')} className={linkClass} style={{ letterSpacing: '0.22em' }}>
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-gold to-ivory text-charcoal text-xs font-body tracking-widest uppercase px-4 py-1.5 rounded hover:shadow-lg hover:shadow-gold/50 transition-all"
              style={{ letterSpacing: '0.22em' }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      <button
        className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span className="block w-5 h-px bg-silver transition-all" />
        <span className={`block h-px bg-gold transition-all ${menuOpen ? 'w-5' : 'w-3'}`} />
      </button>
    </nav>
  );
}
