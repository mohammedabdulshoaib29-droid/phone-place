import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function CartDropdown() {
  const { cart, itemCount, totalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 text-gold hover:text-gold/70 transition-colors"
      >
        <svg
          width="20"
          height="20"
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
          <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-gold/30 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gold/20">
            <h3 className="text-gold font-semibold">Shopping Cart</h3>
          </div>

          {/* Items */}
          <div className="max-h-96 overflow-y-auto">
            {itemCount === 0 ? (
              <div className="px-4 py-8 text-center text-silver">
                <p className="text-sm mb-4">Your cart is empty</p>
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Continue Shopping →
                </Link>
              </div>
            ) : (
              <div className="px-4 py-3 space-y-3">
                {cart?.items.map((item) => (
                  <div key={item._id} className="flex gap-3 pb-3 border-b border-slate-700">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-silver text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-slate-400">
                        ₹{item.price} × {item.quantity}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-emerald-400">{item.variant.label}</p>
                      )}
                    </div>
                    <p className="text-silver font-semibold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {itemCount > 0 && (
            <>
              <div className="px-4 py-3 border-t border-gold/20">
                <div className="flex justify-between mb-3">
                  <span className="text-silver">Subtotal:</span>
                  <span className="text-gold font-semibold">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold text-carbon font-semibold py-2 px-4 rounded text-center text-sm transition-all"
                >
                  View Cart & Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
