import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useOrderStats } from "../../hooks/useOrders";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import { ErrorState } from "../../components/common/EmptyState";
import { StatusBadge } from "../../components/common/Badge";
import { formatCurrency, formatDate } from "../../utils/formatters";

/**
 * Stats Card component
 */
const StatsCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  color = "primary",
}) => {
  const colors = {
    primary: "bg-primary-100 text-primary-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-secondary-500">{label}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          {subValue && <p className="text-xs text-secondary-400">{subValue}</p>}
        </div>
      </div>
    </Card>
  );
};

/**
 * Admin Dashboard Page
 */
const DashboardPage = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const {
    data: orderStats,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useOrderStats();

  const isLoading = productsLoading || ordersLoading;
  const isError = productsError || ordersError;

  if (isLoading) {
    return (
      <Loading message="Chargement du tableau de bord..." fullScreen={false} />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Erreur de chargement"
        description="Impossible de charger les données du tableau de bord."
      />
    );
  }

  // Calculate product stats
  const totalProducts = products?.length || 0;
  const lowStockProducts =
    products?.filter((p) => p.quantity <= 5 && p.quantity > 0).length || 0;
  const outOfStockProducts =
    products?.filter((p) => p.quantity === 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Dashboard Admin
        </h1>
        <p className="text-secondary-500 mt-1">
          Vue d'ensemble de votre boutique
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FiShoppingBag}
          label="Produits"
          value={totalProducts}
          subValue={`${lowStockProducts} stock faible`}
          color="primary"
        />
        <StatsCard
          icon={FiPackage}
          label="Commandes"
          value={orderStats?.total || 0}
          subValue={`${orderStats?.byStatus?.PENDING || 0} en cours`}
          color="blue"
        />
        <StatsCard
          icon={FiDollarSign}
          label="Chiffre d'affaires"
          value={formatCurrency(orderStats?.totalRevenue || 0)}
          color="green"
        />
        <StatsCard
          icon={FiTrendingUp}
          label="Livrées"
          value={orderStats?.byStatus?.DELIVERED || 0}
          color="yellow"
        />
      </div>

      {/* Recent orders and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Commandes récentes
            </h2>
            <Link
              to="/admin/orders"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Voir tout →
            </Link>
          </div>

          {orderStats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {orderStats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-secondary-900">
                      #{order.id?.slice(0, 8)}...
                    </p>
                    <p className="text-sm text-secondary-500">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary-900">
                      {formatCurrency(order.totalAmount || 0)}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-500 text-center py-4">
              Aucune commande récente
            </p>
          )}
        </Card>

        {/* Quick actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Actions rapides
          </h2>

          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">
                  Gérer les produits
                </p>
                <p className="text-sm text-secondary-500">
                  Ajouter, modifier ou supprimer des produits
                </p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">
                  Gérer les commandes
                </p>
                <p className="text-sm text-secondary-500">
                  Consulter et traiter les commandes
                </p>
              </div>
            </Link>
          </div>

          {/* Stock alerts */}
          {(lowStockProducts > 0 || outOfStockProducts > 0) && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">
                Alertes stock
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {outOfStockProducts > 0 && (
                  <li>• {outOfStockProducts} produit(s) en rupture de stock</li>
                )}
                {lowStockProducts > 0 && (
                  <li>• {lowStockProducts} produit(s) avec stock faible</li>
                )}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
