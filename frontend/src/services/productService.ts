import api from './api';
import type { Product, ProductRequest } from '../types';

const PRODUCT_SERVICE_URL = '/PRODUCT-SERVICE/api/products';

export const productService = {
  // Get all products (public)
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>(PRODUCT_SERVICE_URL);
    return response.data;
  },

  // Get product by ID (public)
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`${PRODUCT_SERVICE_URL}/${id}`);
    return response.data;
  },

  // Create product (ADMIN only)
  createProduct: async (product: ProductRequest): Promise<Product> => {
    const response = await api.post<Product>(PRODUCT_SERVICE_URL, product);
    return response.data;
  },

  // Update product (ADMIN only)
  updateProduct: async (id: string, product: ProductRequest): Promise<Product> => {
    const response = await api.put<Product>(`${PRODUCT_SERVICE_URL}/${id}`, product);
    return response.data;
  },

  // Delete product (ADMIN only)
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`${PRODUCT_SERVICE_URL}/${id}`);
  },
};
