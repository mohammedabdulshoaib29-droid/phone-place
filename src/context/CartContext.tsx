import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';

export interface CartItem {
  _id?: string;
  productId: string;
  productName: string;
  productCategory: string;
  price: number;
  quantity: number;
  variant?: {
    label: string;
    value: string;
  };
  image?: string;
}

export interface Cart {
  _id?: string;
  userId?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (
    productId: string,
    productName: string,
    productCategory: string,
    price: number,
    quantity: number,
    variant?: { label: string; value: string },
    image?: string
  ) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate totals
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/cart');
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch cart';
      setError(errorMsg);
      console.error('Fetch cart error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productId: string,
    productName: string,
    productCategory: string,
    price: number,
    quantity: number,
    variant?: { label: string; value: string },
    image?: string
  ) => {
    try {
      setError(null);
      const { data } = await api.post('/cart/add', {
        productId,
        productName,
        productCategory,
        price,
        quantity,
        variant,
        image,
      });

      if (data.success) {
        setCart(data.cart);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to add to cart';
      setError(errorMsg);
      throw err;
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      const { data } = await api.patch(`/cart/item/${itemId}`, { quantity });

      if (data.success) {
        setCart(data.cart);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Failed to update item';
      setError(errorMsg);
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setError(null);
      const { data } = await api.delete(`/cart/item/${itemId}`);

      if (data.success) {
        setCart(data.cart);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to remove item';
      setError(errorMsg);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const { data } = await api.delete('/cart/clear');

      if (data.success) {
        setCart(data.cart);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to clear cart';
      setError(errorMsg);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalPrice,
        loading,
        error,
        fetchCart,
        addToCart,
        updateItemQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
