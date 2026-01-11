import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiPackage,
  FiSettings,
  FiLogOut,
  FiLogIn,
  FiMenu,
  FiX,
  FiUser,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useApiAuth } from "../../hooks/useApiAuth";
import { ROLES } from "../../utils/roles";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, roles, logout, login, isAdmin, authenticated } = useAuth();
  const { totals } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug logging
  console.log("Layout - authenticated:", authenticated);
  console.log("Layout - user:", user);
  console.log("Layout - roles:", roles);

  // Set up API authentication
  useApiAuth();

  const isAdminUser = isAdmin();

  // Navigation items - public items visible to everyone
  const publicNavItems = [
    { name: "Catalogue", href: "/catalog", icon: FiShoppingBag },
  ];

  // Navigation items - only visible when authenticated
  const authClientNavItems = [
    {
      name: "Mon Panier",
      href: "/cart",
      icon: FiShoppingCart,
      badge: totals.itemCount,
    },
    { name: "Mes Commandes", href: "/my-orders", icon: FiPackage },
  ];

  const adminNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FiGrid },
    { name: "Produits", href: "/admin/products", icon: FiShoppingBag },
    { name: "Commandes", href: "/admin/orders", icon: FiList },
  ];

  // Build navigation based on authentication and role
  let navItems = [...publicNavItems];
  if (authenticated) {
    if (isAdminUser) {
      navItems = [
        ...adminNavItems,
        { divider: true },
        ...publicNavItems,
        ...authClientNavItems,
      ];
    } else {
      navItems = [...publicNavItems, ...authClientNavItems];
    }
  }

  const isActive = (href) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-secondary-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-secondary-900">E-Shop</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="my-4 border-t border-secondary-200">
                  <span className="block mt-4 px-3 text-xs font-semibold text-secondary-400 uppercase">
                    Client
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-secondary-600 hover:bg-secondary-100"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section - only show when authenticated */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200 bg-white">
          {authenticated ? (
            <>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {user?.fullName || user?.username || "Utilisateur"}
                  </p>
                  <p className="text-xs text-secondary-500 truncate">
                    {roles.includes(ROLES.ADMIN) ? "Administrateur" : "Client"}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <FiLogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Se connecter</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center space-x-4">
            {/* Cart icon for mobile */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-secondary-100 lg:hidden"
            >
              <FiShoppingCart className="w-6 h-6 text-secondary-600" />
              {totals.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totals.itemCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
