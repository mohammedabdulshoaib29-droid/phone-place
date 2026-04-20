import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { label: 'Shop',     to: '/products', isRoute: true },
  { label: 'Coupons',  to: '/coupons',  isRoute: true },
  { label: 'About',    to: '/about',    isRoute: true },
  { label: 'FAQ',      to: '/faq',      isRoute: true },
  { label: 'My Orders', to: '/my-orders', isRoute: true },
  { label: 'Referral', to: '/referral', isRoute: true },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass =
    'font-body text-silver text-xs tracking-widest uppercase hover:text-gold transition-colors duration-300';

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
          
          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-4 border-l border-gold/30 pl-6">
              <span className="text-gold text-xs">Hi, {user.phone}</span>
              <button
                onClick={logout}
                className={linkClass}
                style={{ letterSpacing: '0.22em' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-gold/30 pl-6">
              <button
                onClick={() => navigate('/login')}
                className={linkClass}
                style={{ letterSpacing: '0.22em' }}
              >
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

          {/* Mobile auth buttons */}
          <div className="border-t border-gold/30 pt-4 mt-4 flex flex-col gap-4">
            {user ? (
              <>
                <span className="text-gold text-xs">Logged in: {user.phone}</span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className={linkClass}
                  style={{ letterSpacing: '0.22em' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                  className={linkClass}
                  style={{ letterSpacing: '0.22em' }}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-gold to-ivory text-charcoal text-xs font-body tracking-widest uppercase px-4 py-2 rounded text-center w-full"
                  style={{ letterSpacing: '0.22em' }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
