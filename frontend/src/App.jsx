import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layout
import Layout from "./components/common/Layout";
import Loading from "./components/common/Loading";

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";

// Pages
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForbiddenPage from "./pages/ForbiddenPage";

// Client Pages
import CatalogPage from "./pages/client/CatalogPage";
import ProductDetailPage from "./pages/client/ProductDetailPage";
import CartPage from "./pages/client/CartPage";
import CheckoutPage from "./pages/client/CheckoutPage";
import MyOrdersPage from "./pages/client/MyOrdersPage";

// Admin Pages
import DashboardPage from "./pages/admin/DashboardPage";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";

// Utils
import { ROLES } from "./utils/roles";

function App() {
  const { initialized } = useAuth();

  if (!initialized) {
    return <Loading message="Initialisation de l'application..." />;
  }

  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Forbidden page */}
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* Layout wrapper for all content */}
      <Route element={<Layout />}>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Catalog */}
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<ProductDetailPage />} />

        {/* Client Routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
