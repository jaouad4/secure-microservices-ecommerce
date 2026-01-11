import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../utils/roles";

/**
 * Home Page - Landing page
 */
const HomePage = () => {
  const { authenticated, hasRole, login } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Hero section */}
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
          Bienvenue sur <span className="text-primary-600">E-Commerce</span>
        </h1>
        <p className="text-xl text-secondary-600 mb-8">
          Découvrez notre sélection de produits de qualité et profitez d'une
          expérience d'achat exceptionnelle.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {authenticated ? (
            <>
              <Link to="/catalog">
                <Button size="lg">Explorer le catalogue</Button>
              </Link>
              {hasRole(ROLES.ADMIN) && (
                <Link to="/admin">
                  <Button size="lg" variant="outline">
                    Dashboard Admin
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Button size="lg" onClick={login}>
                Commencer
              </Button>
              <Link to="/catalog">
                <Button size="lg" variant="outline">
                  Voir les produits
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛍️</span>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Large catalogue
          </h3>
          <p className="text-secondary-600">
            Des centaines de produits à découvrir dans notre boutique en ligne.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Paiement sécurisé
          </h3>
          <p className="text-secondary-600">
            Vos transactions sont protégées par les dernières technologies.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚚</span>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Livraison rapide
          </h3>
          <p className="text-secondary-600">
            Recevez vos commandes rapidement à l'adresse de votre choix.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
