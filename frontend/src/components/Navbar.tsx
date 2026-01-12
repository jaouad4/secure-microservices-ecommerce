import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, isClient, user, login, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/ja.png" alt="Logo" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-gray-800">Jaouad-Amine Store</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Produits
            </Link>

            {isAuthenticated && isClient && (
              <Link to="/orders" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Mes Commandes
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <Link to="/admin/products" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Gérer Produits
                </Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Toutes Commandes
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {(!isAuthenticated || isClient) && (
              <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600">
                <span className="material-icons text-2xl">shopping_cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-lg">person</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{user?.preferred_username}</p>
                    <p className="text-xs text-gray-500">
                      {isAdmin ? 'Admin' : isClient ? 'Client' : 'User'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
