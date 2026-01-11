// API Configuration
const apiConfig = {
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8888',
  timeout: 30000,
}

export default apiConfig
