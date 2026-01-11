import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiLogIn } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../common/Button";
import Loading from "../common/Loading";

/**
 * Login page component
 * Displays login options and handles Keycloak authentication
 */
const Login = () => {
  const { initialized, authenticated, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (initialized && authenticated) {
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/catalog";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    }
  }, [initialized, authenticated, navigate]);

  if (!initialized) {
    return <Loading message="Initialisation..." />;
  }

  if (authenticated) {
    return <Loading message="Connexion réussie, redirection..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FiShoppingBag className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">E-Commerce</h1>
          <p className="text-secondary-500 mt-2">
            Gestion de produits et commandes
          </p>
        </div>

        {/* Login section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-secondary-900 mb-2">
              Bienvenue
            </h2>
            <p className="text-sm text-secondary-500">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <Button onClick={login} fullWidth size="lg" leftIcon={<FiLogIn />}>
            Se connecter avec Keycloak
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">
                Authentification sécurisée
              </span>
            </div>
          </div>

          <div className="bg-secondary-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-secondary-900 mb-2">
              Comptes de test
            </h3>
            <div className="space-y-2 text-sm text-secondary-600">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span>admin / admin</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Client:</span>
                <span>client / client</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-secondary-400">
          <p>© 2024 E-Commerce. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
