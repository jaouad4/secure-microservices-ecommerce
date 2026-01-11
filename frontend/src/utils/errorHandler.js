import toast from 'react-hot-toast'
import { logger } from './logger'

/**
 * Error types enumeration
 */
export const ErrorType = {
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
}

/**
 * Map HTTP status code to error type
 * @param {number} status - HTTP status code
 * @returns {string} Error type
 */
const getErrorType = (status) => {
  if (!status) return ErrorType.NETWORK
  if (status === 401) return ErrorType.AUTHENTICATION
  if (status === 403) return ErrorType.AUTHORIZATION
  if (status === 404) return ErrorType.NOT_FOUND
  if (status === 400 || status === 422) return ErrorType.VALIDATION
  if (status >= 500) return ErrorType.SERVER
  return ErrorType.UNKNOWN
}

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'Une erreur inattendue s\'est produite'

  // Network error
  if (error.message === 'Network Error' || !error.response) {
    return 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
  }

  const status = error.response?.status
  const serverMessage = error.response?.data?.message || error.response?.data?.error

  switch (getErrorType(status)) {
    case ErrorType.AUTHENTICATION:
      return 'Votre session a expiré. Veuillez vous reconnecter.'
    case ErrorType.AUTHORIZATION:
      return 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.'
    case ErrorType.NOT_FOUND:
      return serverMessage || 'La ressource demandée n\'a pas été trouvée.'
    case ErrorType.VALIDATION:
      return serverMessage || 'Les données fournies sont invalides.'
    case ErrorType.SERVER:
      return 'Une erreur serveur s\'est produite. Veuillez réessayer plus tard.'
    default:
      return serverMessage || 'Une erreur inattendue s\'est produite.'
  }
}

/**
 * Handle API errors with toast notifications
 * @param {Error} error - Error object
 * @param {Object} options - Options
 * @param {boolean} options.showToast - Show toast notification
 * @param {Function} options.onAuthError - Callback for authentication errors
 */
export const handleApiError = (error, options = {}) => {
  const { showToast = true, onAuthError } = options
  
  const errorType = getErrorType(error.response?.status)
  const message = getErrorMessage(error)

  // Log the error
  logger.error('API Error:', {
    type: errorType,
    status: error.response?.status,
    message,
    url: error.config?.url,
    method: error.config?.method,
  })

  // Handle authentication errors
  if (errorType === ErrorType.AUTHENTICATION && onAuthError) {
    onAuthError()
    return
  }

  // Show toast notification
  if (showToast) {
    toast.error(message)
  }

  return {
    type: errorType,
    message,
    status: error.response?.status,
  }
}

/**
 * Format validation errors from server
 * @param {Object} errors - Validation errors object
 * @returns {Object} Formatted errors
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return {}
  
  const formatted = {}
  Object.keys(errors).forEach(key => {
    formatted[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key]
  })
  
  return formatted
}
