import api from './api';
import type { Order, OrderRequest } from '../types';

const ORDER_SERVICE_URL = '/ORDER-SERVICE/api/orders';

export const orderService = {
  // Create order (CLIENT only)
  createOrder: async (orderRequest: OrderRequest): Promise<Order> => {
    const response = await api.post<Order>(ORDER_SERVICE_URL, orderRequest);
    return response.data;
  },

  // Get order by ID (CLIENT or ADMIN)
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`${ORDER_SERVICE_URL}/${id}`);
    return response.data;
  },

  // Get my orders (CLIENT only)
  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>(`${ORDER_SERVICE_URL}/my-orders`);
    return response.data;
  },

  // Get all orders (ADMIN only)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>(ORDER_SERVICE_URL);
    return response.data;
  },
};
