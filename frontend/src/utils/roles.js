// Role constants for the application
export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
}

/**
 * Check if user has a specific role
 * @param {string[]} userRoles - Array of user roles
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (userRoles, role) => {
  if (!userRoles || !Array.isArray(userRoles)) return false
  return userRoles.includes(role)
}

/**
 * Check if user has any of the specified roles
 * @param {string[]} userRoles - Array of user roles
 * @param {string[]} roles - Roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (userRoles, roles) => {
  if (!userRoles || !Array.isArray(userRoles)) return false
  return roles.some(role => userRoles.includes(role))
}

/**
 * Check if user is an admin
 * @param {string[]} userRoles - Array of user roles
 * @returns {boolean}
 */
export const isAdmin = (userRoles) => hasRole(userRoles, ROLES.ADMIN)

/**
 * Check if user is a client
 * @param {string[]} userRoles - Array of user roles
 * @returns {boolean}
 */
export const isClient = (userRoles) => hasRole(userRoles, ROLES.CLIENT)
