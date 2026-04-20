import { useState } from 'react';
import { useCart } from '../hooks/useCart';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productCategory: string;
  price: number;
  image?: string;
  selectedVariant?: {
    label: string;
    value: string;
  };
  onSuccess?: () => void;
}

export default function AddToCartButton({
  productId,
  productName,
  productCategory,
  price,
  image,
  selectedVariant,
  onSuccess,
}: AddToCartButtonProps) {
  const { addToCart, error } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(
        productId,
        productName,
        productCategory,
        price,
        quantity,
        selectedVariant,
        image
      );
      setSuccessMessage(`${productName} added to cart!`);
      setQuantity(1);
      setTimeout(() => setSuccessMessage(''), 3000);
      onSuccess?.();
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-silver">Qty:</span>
        <div className="flex items-center border border-gold/30 rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-silver hover:text-gold transition-colors"
            disabled={loading}
          >
            −
          </button>
          <span className="px-4 py-1 text-silver min-w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 text-silver hover:text-gold transition-colors"
            disabled={loading}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded transition-all"
      >
        {loading ? 'Adding...' : '🛒 Add to Cart'}
      </button>

      {/* Messages */}
      {successMessage && (
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-xs text-center">
          ✓ {successMessage}
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-xs text-center">
          {error}
        </div>
      )}
    </div>
  );
}
