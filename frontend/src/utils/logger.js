/**
 * Logger utility for client-side logging
 * Provides structured logging with different levels
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const CURRENT_LOG_LEVEL = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} data - Additional data
 * @returns {Object} Formatted log entry
 */
const formatLog = (level, message, data) => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  data,
  userAgent: navigator.userAgent,
  url: window.location.href,
})

/**
 * Logger object with different log levels
 */
export const logger = {
  /**
   * Debug level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  debug: (message, data = null) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log('%c[DEBUG]', 'color: #6b7280', message, data || '')
    }
  },

  /**
   * Info level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  info: (message, data = null) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.info('%c[INFO]', 'color: #3b82f6', message, data || '')
    }
  },

  /**
   * Warning level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  warn: (message, data = null) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn('%c[WARN]', 'color: #f59e0b', message, data || '')
    }
  },

  /**
   * Error level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  error: (message, data = null) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      console.error('%c[ERROR]', 'color: #ef4444', message, data || '')
      
      // In production, you could send errors to a logging service
      if (!import.meta.env.DEV) {
        // sendToLoggingService(formatLog('ERROR', message, data))
      }
    }
  },

  /**
   * Log user action for tracking
   * @param {string} action - Action name
   * @param {Object} details - Action details
   */
  action: (action, details = {}) => {
    const logEntry = formatLog('ACTION', action, details)
    
    if (import.meta.env.DEV) {
      console.log('%c[ACTION]', 'color: #10b981', action, details)
    }
    
    // Track user actions
    // In production, send to analytics service
    return logEntry
  },

  /**
   * Log API call
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Object} options - Additional options
   */
  api: (method, url, options = {}) => {
    if (import.meta.env.DEV) {
      console.log(
        '%c[API]',
        'color: #8b5cf6',
        `${method.toUpperCase()} ${url}`,
        options
      )
    }
  },
}

export default logger
