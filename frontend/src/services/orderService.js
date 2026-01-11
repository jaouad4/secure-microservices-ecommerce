import api from './api'
import { handleApiError } from '../utils/errorHandler'
import { logger } from '../utils/logger'

/**
 * Order Service
 * Handles all order-related API calls through the API Gateway
 */
const orderService = {
  /**
   * Get all orders (Admin only)
   * @returns {Promise<Array>} List of all orders
   */
  getAllOrders: async () => {
    try {
      const response = await api.get('/ORDER-SERVICE/api/orders')
      logger.info('All orders fetched successfully', { count: response.data.length })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Get order by ID
   * @param {string} id - Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/ORDER-SERVICE/api/orders/${id}`)
      logger.info('Order fetched successfully', { id })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Create a new order (Client only)
   * @param {Object} orderData - Order data with products map
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/ORDER-SERVICE/api/orders', orderData)
      logger.action('Order created', { id: response.data.id })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Get orders for current user (My Orders)
   * Note: This endpoint may need to be implemented on the backend
   * For now, we'll use the getOrderById approach
   * @returns {Promise<Array>} List of user's orders
   */
  getMyOrders: async () => {
    try {
      // Try the my-orders endpoint first
      const response = await api.get('/ORDER-SERVICE/api/orders/my-orders')
      logger.info('My orders fetched successfully', { count: response.data.length })
      return response.data
    } catch (error) {
      // If my-orders doesn't exist, fall back to getting all orders
      // The backend should filter by the authenticated user
      logger.warn('my-orders endpoint not available, using alternative')
      try {
        const response = await api.get('/ORDER-SERVICE/api/orders')
        return response.data
      } catch (fallbackError) {
        handleApiError(fallbackError)
        throw fallbackError
      }
    }
  },

  /**
   * Update order status (Admin only)
   * Note: This endpoint may need to be implemented on the backend
   * @param {string} id - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/ORDER-SERVICE/api/orders/${id}/status`, { status })
      logger.action('Order status updated', { id, status })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Cancel an order
   * @param {string} id - Order ID
   * @returns {Promise<Object>} Cancelled order
   */
  cancelOrder: async (id) => {
    try {
      const response = await api.put(`/ORDER-SERVICE/api/orders/${id}/cancel`)
      logger.action('Order cancelled', { id })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  /**
   * Get order statistics (Admin only)
   * @returns {Promise<Object>} Order statistics
   */
  getOrderStats: async () => {
    try {
      const orders = await orderService.getAllOrders()
      
      const stats = {
        total: orders.length,
        byStatus: {
          CREATED: 0,
          PENDING: 0,
          DELIVERED: 0,
          CANCELED: 0,
        },
        totalRevenue: 0,
        recentOrders: [],
      }

      orders.forEach(order => {
        if (order.status && stats.byStatus[order.status] !== undefined) {
          stats.byStatus[order.status]++
        }
        if (order.status !== 'CANCELED') {
          stats.totalRevenue += order.totalAmount || 0
        }
      })

      // Get 5 most recent orders
      stats.recentOrders = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

      logger.info('Order stats calculated', stats)
      return stats
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

export default orderService
