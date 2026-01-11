import keycloakConfig from '../config/keycloak'
import { logger } from '../utils/logger'

/**
 * Keycloak Auth Service
 * Provides helper functions for authentication operations
 */
const authService = {
  /**
   * Get Keycloak login URL
   */
  getLoginUrl: (redirectUri = window.location.origin) => {
    const { url, realm, clientId } = keycloakConfig
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
    })
    return `${url}/realms/${realm}/protocol/openid-connect/auth?${params}`
  },

  /**
   * Get Keycloak logout URL
   */
  getLogoutUrl: (redirectUri = window.location.origin) => {
    const { url, realm } = keycloakConfig
    const params = new URLSearchParams({
      post_logout_redirect_uri: redirectUri,
    })
    return `${url}/realms/${realm}/protocol/openid-connect/logout?${params}`
  },

  /**
   * Get Keycloak account management URL
   */
  getAccountUrl: () => {
    const { url, realm } = keycloakConfig
    return `${url}/realms/${realm}/account`
  },

  /**
   * Parse JWT token
   */
  parseToken: (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      logger.error('Failed to parse token', error)
      return null
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (token) => {
    const parsed = authService.parseToken(token)
    if (!parsed || !parsed.exp) return true
    
    const now = Math.floor(Date.now() / 1000)
    return parsed.exp < now
  },

  /**
   * Get time until token expires (in seconds)
   */
  getTokenExpiresIn: (token) => {
    const parsed = authService.parseToken(token)
    if (!parsed || !parsed.exp) return 0
    
    const now = Math.floor(Date.now() / 1000)
    return Math.max(0, parsed.exp - now)
  },

  /**
   * Extract roles from token
   */
  getRolesFromToken: (token) => {
    const parsed = authService.parseToken(token)
    if (!parsed) return []
    
    return parsed.realm_access?.roles || []
  },

  /**
   * Extract user info from token
   */
  getUserFromToken: (token) => {
    const parsed = authService.parseToken(token)
    if (!parsed) return null
    
    return {
      id: parsed.sub,
      username: parsed.preferred_username,
      email: parsed.email,
      firstName: parsed.given_name,
      lastName: parsed.family_name,
      fullName: parsed.name,
    }
  },
}

export default authService
