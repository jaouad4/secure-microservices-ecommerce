// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Order types
export interface OrderLineItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  totalLinePrice: number;
}

export type OrderStatus = 'CREATED' | 'PENDING' | 'DELIVERED' | 'CANCELED';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
  orderLines: OrderLineItem[];
}

export interface OrderRequest {
  products: Record<string, number>; // { productId: quantity }
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// User types
export interface UserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  roles: string[];
}
