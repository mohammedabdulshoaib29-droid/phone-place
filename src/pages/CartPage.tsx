import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, removeItem, updateItemQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveItem = async (itemId: string | undefined) => {
    if (!itemId) return;
    try {
      await removeItem(itemId);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleUpdateQuantity = async (itemId: string | undefined, quantity: number) => {
    if (!itemId || quantity < 1) return;
    setUpdatingId(itemId);
    try {
      await updateItemQuantity(itemId, quantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length !== 1) {
      return;
    }
    navigate(`/checkout/${cart.items[0].productId}`);
  };

  if (loading) {
    return (
      <main className="pt-24 pb-20 min-h-screen px-6">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="animate-spin inline-block">
            <div className="h-12 w-12 border-4 border-gold rounded-full border-t-transparent" />
          </div>
          <p className="text-silver mt-4">Loading cart...</p>
        </div>
      </main>
    );
  }

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const isEmpty = !cart?.items || cart.items.length === 0;
  const canDirectCheckout = Boolean(cart?.items.length === 1 && cart.items[0]?.productId);

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-3"
            style={{ letterSpacing: '0.4em' }}
          >
            Shopping
          </p>
          <h1
            className="font-display text-ivory"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 700 }}
          >
            Your Cart
          </h1>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        {isEmpty ? (
          <div className="glass-card p-12 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-silver text-lg mb-2">Your cart is empty</p>
            <p className="text-slate-400 text-sm mb-8">
              Explore our premium accessories and add some to your cart!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold text-carbon font-semibold py-3 px-8 rounded transition-all"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-silver text-sm">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
                </p>
                <button
                  onClick={handleClearCart}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {cart.items.map((item) => (
                <div key={item._id} className="glass-card p-6 flex gap-6 items-start">
                  {/* Product image */}
                  {item.image && (
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Product details */}
                  <div className="flex-1">
                    <h3 className="text-ivory font-semibold text-lg mb-1">{item.productName}</h3>
                    <p className="text-slate-400 text-sm mb-2">{item.productCategory}</p>
                    <button
                      onClick={() => navigate(`/product/${item.productId}`)}
                      className="mb-3 text-xs uppercase tracking-[0.18em] text-gold"
                    >
                      View product
                    </button>

                    {item.variant && (
                      <p className="text-emerald-400 text-sm mb-3">
                        {item.variant.label}
                      </p>
                    )}

                    <p className="text-gold font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Quantity and actions */}
                  <div className="flex flex-col items-end gap-4">
                    {/* Quantity control */}
                    <div className="flex items-center border border-gold/30 rounded">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={updatingId === item._id}
                        className="px-3 py-2 text-silver hover:text-gold transition-colors disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 text-silver min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity + 1)
                        }
                        disabled={updatingId === item._id}
                        className="px-3 py-2 text-silver hover:text-gold transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Price and remove */}
                    <div className="text-right">
                      <p className="text-ivory font-semibold text-lg">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold mt-2 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-gold font-semibold mb-4">Order Summary</h3>
                </div>

                {/* Calculations */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Shipping</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Tax (est.)</span>
                    <span>₹{Math.round(totalPrice * 0.18).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="border-t border-gold/20 pt-3 flex justify-between text-lg font-semibold">
                    <span className="text-ivory">Total</span>
                    <span className="text-gold">
                      ₹{Math.round(totalPrice * 1.18).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  disabled={!canDirectCheckout}
                  className="w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold text-carbon font-semibold py-3 px-6 rounded transition-all"
                >
                  {canDirectCheckout ? 'Proceed to Checkout' : 'Use Buy Now from Product Page'}
                </button>

                {!canDirectCheckout && (
                  <p className="text-xs leading-6 text-slate-400">
                    Checkout is currently available one product at a time. Open a saved product and
                    continue with Buy Now.
                  </p>
                )}

                {/* Trust badges */}
                <div className="border-t border-gold/20 pt-6 space-y-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🚚</span>
                    <span>Free shipping on orders above ₹999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>

                {/* User info */}
                {user && (
                  <div className="border-t border-gold/20 pt-6 text-xs text-slate-400">
                    <div className="mb-2 font-semibold text-silver">Checkout as:</div>
                    <div>{user.name || 'User'}</div>
                    <div>+91{user.phone}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
