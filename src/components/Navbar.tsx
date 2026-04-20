import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CartDropdown from './CartDropdown';
import NotificationBell from './NotificationBell';

const navLinks = [
  { label: 'Shop',     to: '/products', isRoute: true },
  { label: 'Coupons',  to: '/coupons',  isRoute: true },
  { label: 'About',    to: '/about',    isRoute: true },
  { label: 'FAQ',      to: '/faq',      isRoute: true },
  { label: 'My Orders', to: '/my-orders', isRoute: true },
  { label: 'Referral', to: '/referral', isRoute: true },
  { label: 'Profile',  to: '/profile',  isRoute: true },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass =
    'font-body text-silver text-xs tracking-widest uppercase hover:text-gold transition-colors duration-300';

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'h-16 bg-charcoal/80 backdrop-blur-xl border-b border-gold/10'
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-full px-8 md:px-16">
        {/* Brand */}
        <Link
          to="/"
          className="font-display text-ivory text-sm uppercase no-underline"
          style={{ letterSpacing: '0.28em' }}
        >
          Phone Palace
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(({ label, to, isRoute }) =>
            isRoute ? (
              <Link key={label} to={to} className={linkClass} style={{ letterSpacing: '0.22em' }}>
                {label}
              </Link>
            ) : (
              <a key={label} href={to} className={linkClass} style={{ letterSpacing: '0.22em' }}>
                {label}
              </a>
            )
          )}
          <Link to="/admin" className={linkClass} style={{ letterSpacing: '0.22em' }}>
            Admin
          </Link>

          {/* Cart icon */}
          {token && <CartDropdown />}

          {/* Notification bell */}
          {token && <NotificationBell />}

          {/* Auth buttons */}
          <div className="flex items-center gap-4 pl-4 border-l border-gold/20">
            {token && user ? (
              <>
                <Link to="/profile" className="text-xs text-silver hover:text-gold transition-colors cursor-pointer">
                  <div className="font-semibold">{user.name || 'User'}</div>
                  <div className="text-gold/70">+91{user.phone}</div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-gold hover:text-gold/70 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${linkClass} text-gold`}>
                  Login
                </Link>
                <Link to="/register" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="block w-5 h-px bg-silver transition-all" />
          <span className={`block h-px bg-gold transition-all ${menuOpen ? 'w-5' : 'w-3'}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-charcoal/96 backdrop-blur-xl border-b border-gold/10 py-8 px-8 flex flex-col gap-7">
          {navLinks.map(({ label, to, isRoute }) =>
            isRoute ? (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
                style={{ letterSpacing: '0.22em' }}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={to}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
                style={{ letterSpacing: '0.22em' }}
              >
                {label}
              </a>
            )
          )}
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className={linkClass}
            style={{ letterSpacing: '0.22em' }}
          >
            Admin
          </Link>

          {/* Mobile Cart */}
          {token && (
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={`${linkClass} text-emerald-400 py-2`}
              style={{ letterSpacing: '0.22em' }}
            >
              🛒 View Cart
            </Link>
          )}

          {/* Mobile Auth */}
          <div className="border-t border-gold/20 pt-6 mt-4">
            {token && user ? (
              <>
                <div className="text-sm text-silver mb-4">
                  <div className="font-semibold">{user.name || 'User'}</div>
                  <div className="text-gold/70">+91{user.phone}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-sm font-semibold text-gold hover:text-gold/70 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={`${linkClass} block py-2`}
                  style={{ letterSpacing: '0.22em' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
