import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../common/Loading";

/**
 * Protected Route component
 * Handles authentication and role-based access control
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { initialized, authenticated, roles, login } = useAuth();
  const location = useLocation();

  // Wait for Keycloak to initialize
  if (!initialized) {
    return <Loading message="Vérification de l'authentification..." />;
  }

  // If not authenticated, redirect to login
  if (!authenticated) {
    // Store the intended destination
    sessionStorage.setItem("redirectAfterLogin", location.pathname);

    // Trigger Keycloak login
    login();

    return <Loading message="Redirection vers la page de connexion..." />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) => roles.includes(role));

    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to catalog
      return <Navigate to="/catalog" state={{ from: location }} replace />;
    }
  }

  // User is authenticated and has required role (if any)
  return <Outlet />;
};

export default ProtectedRoute;
