import axios from 'axios'
import apiConfig from '../config/api'
import { logger } from '../utils/logger'
import { handleApiError } from '../utils/errorHandler'

// Create axios instance with default config
const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store for token getter function
let tokenGetter = null

/**
 * Set the token getter function (called from AuthContext)
 */
export const setTokenGetter = (getter) => {
  tokenGetter = getter
}

/**
 * Request interceptor - Add JWT token to requests
 */
api.interceptors.request.use(
  async (config) => {
    // Log the request
    logger.api(config.method, config.url, {
      params: config.params,
      data: config.data,
    })

    // Get fresh token if available
    if (tokenGetter) {
      try {
        const token = await tokenGetter()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        logger.warn('Failed to get token for request', error)
      }
    }

    return config
  },
  (error) => {
    logger.error('Request interceptor error', error)
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      url: response.config.url,
      status: response.status,
    })
    return response
  },
  (error) => {
    // Don't auto-handle errors here, let the service layer handle them
    // This allows for custom error handling per request
    logger.error('API Response Error', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    })
    return Promise.reject(error)
  }
)

export default api
