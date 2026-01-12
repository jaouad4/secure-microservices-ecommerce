import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import keycloak from '../config/keycloak';
import type { UserInfo } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  roles: string[];
  isAdmin: boolean;
  isClient: boolean;
  login: () => void;
  logout: () => void;
  token: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const extractRoles = useCallback((): string[] => {
    const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
    return realmRoles;
  }, []);

  const extractUserInfo = useCallback((): UserInfo | null => {
    if (!keycloak.tokenParsed) return null;
    
    return {
      sub: keycloak.tokenParsed.sub || '',
      name: keycloak.tokenParsed.name,
      preferred_username: keycloak.tokenParsed.preferred_username,
      email: keycloak.tokenParsed.email,
      roles: extractRoles(),
    };
  }, [extractRoles]);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
          checkLoginIframe: false,
        });

        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          setUser(extractUserInfo());
          setRoles(extractRoles());
        }
      } catch (error) {
        console.error('Keycloak initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();

    // Token refresh
    const refreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(60).catch(() => {
          console.log('Failed to refresh token');
        });
      }
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, [extractRoles, extractUserInfo]);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const isAdmin = roles.includes('ADMIN');
  const isClient = roles.includes('CLIENT');

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        roles,
        isAdmin,
        isClient,
        login,
        logout,
        token: keycloak.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
