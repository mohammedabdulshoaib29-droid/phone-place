export type PaymentMethod = 'cod' | 'online';
export type OrderStatus = 'pending' | 'confirmed' | 'delivered';
export type PaymentStatus = 'pending' | 'paid';

export interface Order {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  productId: string;
  quantity: number;
  price: number;
  payment_method: PaymentMethod;
  razorpay_order_id?: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  timestamp: string;
}
