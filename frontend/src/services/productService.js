import api from './api'
import { handleApiError } from '../utils/errorHandler'
import { logger } from '../utils/logger'

/**
 * Product Service
 * Handles all product-related API calls through the API Gateway
 */
const productService = {
  /**
   * Get all products
   * @returns {Promise<Array>} List of products
   */
  getAllProducts: async () => {
    try {
      const response = await api.get('/PRODUCT-SERVICE/api/products')
      logger.info('Products fetched successfully', { count: response.data.length })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (id) => {
    try {
      const response = await api.get(`/PRODUCT-SERVICE/api/products/${id}`)
      logger.info('Product fetched successfully', { id })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Create a new product (Admin only)
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/PRODUCT-SERVICE/api/products', productData)
      logger.action('Product created', { id: response.data.id })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Update a product (Admin only)
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/PRODUCT-SERVICE/api/products/${id}`, productData)
      logger.action('Product updated', { id })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Delete a product (Admin only)
   * @param {string} id - Product ID
   * @returns {Promise<void>}
   */
  deleteProduct: async (id) => {
    try {
      await api.delete(`/PRODUCT-SERVICE/api/products/${id}`)
      logger.action('Product deleted', { id })
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Search products by name
   * @param {string} query - Search query
   * @returns {Promise<Array>} Filtered products
   */
  searchProducts: async (query) => {
    try {
      const allProducts = await productService.getAllProducts()
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
      )
      logger.info('Products searched', { query, resultCount: filtered.length })
      return filtered
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Check product stock availability
   * @param {string} id - Product ID
   * @param {number} quantity - Required quantity
   * @returns {Promise<Object>} Stock availability info
   */
  checkStock: async (id, quantity) => {
    try {
      const product = await productService.getProductById(id)
      const available = product.quantity >= quantity
      
      return {
        available,
        currentStock: product.quantity,
        requestedQuantity: quantity,
        product,
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Validate multiple products stock
   * @param {Object} items - Object with productId as key and quantity as value
   * @returns {Promise<Object>} Validation result
   */
  validateCartStock: async (items) => {
    try {
      const results = []
      let allAvailable = true

      for (const [productId, quantity] of Object.entries(items)) {
        const stockInfo = await productService.checkStock(productId, quantity)
        results.push(stockInfo)
        
        if (!stockInfo.available) {
          allAvailable = false
        }
      }

      return {
        valid: allAvailable,
        items: results,
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

export default productService
