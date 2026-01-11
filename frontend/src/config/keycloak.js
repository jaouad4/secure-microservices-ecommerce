// Keycloak Configuration
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecommerce-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'ecommerce-client',
}

export default keycloakConfig
