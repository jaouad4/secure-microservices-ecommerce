import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Keycloak from "keycloak-js";
import keycloakConfig from "../config/keycloak";
import { logger } from "../utils/logger";
import { ROLES } from "../utils/roles";

const AuthContext = createContext(null);

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Flag to prevent double initialization (React StrictMode calls useEffect twice)
let keycloakInitialized = false;

export const AuthProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);

  /**
   * Extract user info from Keycloak token
   */
  const extractUserInfo = useCallback(() => {
    if (keycloak.tokenParsed) {
      const userInfo = {
        id: keycloak.tokenParsed.sub,
        username: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        firstName: keycloak.tokenParsed.given_name,
        lastName: keycloak.tokenParsed.family_name,
        fullName: keycloak.tokenParsed.name,
      };
      setUser(userInfo);
      logger.info("User info extracted", userInfo);
    }
  }, []);

  /**
   * Extract roles from Keycloak token
   * Note: We parse the access token because realm_access.roles is in the access token
   */
  const extractRoles = useCallback(() => {
    // Try to get roles from ID token first, then access token
    let realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];

    // If no roles in ID token, try parsing the access token directly
    if (realmRoles.length === 0 && keycloak.token) {
      try {
        // Parse the access token (JWT format: header.payload.signature)
        const accessTokenPayload = JSON.parse(
          atob(keycloak.token.split(".")[1])
        );
        realmRoles = accessTokenPayload?.realm_access?.roles || [];
        console.log("Roles from access token:", realmRoles);
      } catch (e) {
        console.error("Error parsing access token:", e);
      }
    }

    // Debug logging
    console.log("ID Token parsed:", keycloak.tokenParsed);
    console.log("Final realm roles:", realmRoles);
    const appRoles = realmRoles.filter((role) =>
      Object.values(ROLES).includes(role)
    );
    console.log("Filtered app roles:", appRoles);

    setRoles(appRoles);
    logger.info("User roles extracted", appRoles);
  }, []);

  /**
   * Update token state
   */
  const updateToken = useCallback(() => {
    setToken(keycloak.token);
  }, []);

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed) {
        updateToken();
        logger.info("Token refreshed successfully");
      }
      return keycloak.token;
    } catch (error) {
      logger.error("Failed to refresh token", error);
      logout();
      throw error;
    }
  }, []);

  /**
   * Clear stale OAuth parameters from URL
   */
  const clearOAuthParams = () => {
    const url = new URL(window.location.href);
    const oauthParams = [
      "code",
      "state",
      "session_state",
      "error",
      "error_description",
    ];
    let hasParams = false;

    oauthParams.forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        hasParams = true;
      }
    });

    if (hasParams) {
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
    }
  };

  /**
   * Initialize Keycloak
   */
  useEffect(() => {
    const initKeycloak = async () => {
      // Prevent double initialization
      if (keycloakInitialized) {
        console.log("Keycloak already initialized, skipping...");
        // If already initialized, just update state from keycloak instance
        setAuthenticated(keycloak.authenticated || false);
        if (keycloak.authenticated) {
          updateToken();
          extractUserInfo();
          extractRoles();
        }
        setInitialized(true);
        return;
      }

      keycloakInitialized = true;

      try {
        logger.info("Initializing Keycloak...");
        console.log("Keycloak config:", keycloakConfig);

        const auth = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          checkLoginIframe: false,
          enableLogging: true,
        });

        console.log("Keycloak init result:", auth);
        console.log("Keycloak authenticated:", keycloak.authenticated);
        console.log("Keycloak token:", keycloak.token ? "present" : "missing");

        setAuthenticated(auth);

        if (auth) {
          // Clear OAuth params from URL after successful auth
          clearOAuthParams();
          updateToken();
          extractUserInfo();
          extractRoles();
          logger.info("User authenticated successfully");
          console.log("Auth success - token parsed:", keycloak.tokenParsed);
        } else {
          logger.info("User not authenticated");
        }

        setInitialized(true);
      } catch (error) {
        logger.error("Keycloak initialization failed", error);
        console.error("Keycloak init error details:", error);

        // Clear stale OAuth params that may be causing issues
        clearOAuthParams();

        // Clear any stale Keycloak session storage
        const keycloakKeys = Object.keys(sessionStorage).filter(
          (key) => key.startsWith("kc-") || key.includes("keycloak")
        );
        keycloakKeys.forEach((key) => sessionStorage.removeItem(key));

        setInitialized(true);
      }
    };

    initKeycloak();

    // Set up token refresh
    const refreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak
          .updateToken(60)
          .then((refreshed) => {
            if (refreshed) {
              updateToken();
              logger.debug("Token auto-refreshed");
            }
          })
          .catch(() => {
            logger.warn("Failed to auto-refresh token");
          });
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(refreshInterval);
    };
  }, [extractUserInfo, extractRoles, updateToken]);

  /**
   * Login function
   */
  const login = useCallback(() => {
    logger.action("User login initiated");
    keycloak.login({
      redirectUri: window.location.origin + "/catalog",
    });
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    logger.action("User logout initiated");
    keycloak.logout({
      redirectUri: window.location.origin + "/",
    });
  }, []);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role) => {
      return roles.includes(role);
    },
    [roles]
  );

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback(
    (requiredRoles) => {
      return requiredRoles.some((role) => roles.includes(role));
    },
    [roles]
  );

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return hasRole(ROLES.ADMIN);
  }, [hasRole]);

  /**
   * Check if user is client
   */
  const isClient = useCallback(() => {
    return hasRole(ROLES.CLIENT);
  }, [hasRole]);

  /**
   * Get current valid token (refreshes if needed)
   */
  const getToken = useCallback(async () => {
    if (!keycloak.authenticated) {
      return null;
    }

    // Check if token needs refresh (expires in less than 30 seconds)
    if (keycloak.isTokenExpired(30)) {
      return await refreshToken();
    }

    return keycloak.token;
  }, [refreshToken]);

  const value = {
    initialized,
    authenticated,
    user,
    token,
    roles,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isClient,
    getToken,
    refreshToken,
    keycloak,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
