import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { setTokenGetter } from '../services/api'

/**
 * Hook to set up API authentication with the current token
 * This should be used at the app level to ensure all API calls are authenticated
 */
export const useApiAuth = () => {
  const { getToken, authenticated } = useAuth()

  useEffect(() => {
    if (authenticated) {
      setTokenGetter(getToken)
    } else {
      setTokenGetter(null)
    }
  }, [authenticated, getToken])
}

export default useApiAuth
