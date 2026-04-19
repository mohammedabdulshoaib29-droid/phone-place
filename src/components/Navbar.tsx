import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Shop',    to: '/products', isRoute: true },
  { label: 'About',   to: '/#about',   isRoute: false },
  { label: 'Contact', to: '/#contact', isRoute: false },
];

export default function Navbar() {
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
        </div>
      )}
    </nav>
  );
}
