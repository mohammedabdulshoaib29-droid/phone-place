import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import CartDropdown from './CartDropdown';
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
  const { itemCount } = useCart();
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
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'bg-carbon/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-16">
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
            <CartDropdown />

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

          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-charcoal/70 text-gold"
              aria-label="Open cart"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-carbon">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="flex flex-col gap-[5px] cursor-pointer p-1"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span className="block h-px w-5 bg-silver transition-all" />
              <span className={`block h-px bg-gold transition-all ${menuOpen ? 'w-5' : 'w-3'}`} />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-x-4 top-20 z-40 rounded-[1.75rem] border border-gold/15 bg-charcoal/95 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:hidden">
          <div className="mb-5 flex items-center justify-between border-b border-gold/10 pb-4">
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.28em] text-gold">Menu</p>
              <p className="font-body text-sm text-silver">Shop, repair, and account</p>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-[0.22em] text-silver"
            >
              Close
            </button>
          </div>

          <div className="grid gap-3">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl border border-gold/10 bg-carbon/80 px-4 py-4 text-sm text-ivory"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl border border-gold/10 bg-carbon/80 px-4 py-4 text-sm text-ivory"
            >
              Cart {itemCount > 0 ? `(${itemCount})` : ''}
            </Link>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="rounded-2xl border border-gold/10 bg-carbon/80 px-4 py-4 text-left text-sm text-ivory"
              >
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                  className="rounded-2xl border border-gold/15 px-4 py-4 text-xs uppercase tracking-[0.22em] text-gold"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMenuOpen(false);
                  }}
                  className="rounded-2xl bg-gold px-4 py-4 text-xs uppercase tracking-[0.22em] text-carbon"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
