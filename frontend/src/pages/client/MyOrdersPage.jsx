import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiPackage, FiRefreshCw } from "react-icons/fi";
import { useMyOrders } from "../../hooks/useOrders";
import OrderList from "../../components/orders/OrderList";
import Loading from "../../components/common/Loading";
import { ErrorState } from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

/**
 * My Orders Page - Displays user's order history
 */
const MyOrdersPage = () => {
  const { data: orders, isLoading, isError, refetch } = useMyOrders();
  const location = useLocation();

  // Show success message if redirected from checkout
  useEffect(() => {
    if (location.state?.orderSuccess) {
      toast.success("Votre commande a été passée avec succès !");
      // Clean up state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (isLoading) {
    return (
      <Loading message="Chargement de vos commandes..." fullScreen={false} />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Erreur de chargement"
        description="Impossible de charger vos commandes. Veuillez réessayer."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Mes Commandes
          </h1>
          <p className="text-secondary-500 mt-1">Historique de vos commandes</p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          leftIcon={<FiRefreshCw />}
        >
          Actualiser
        </Button>
      </div>

      {/* Orders list */}
      <OrderList
        orders={orders || []}
        loading={isLoading}
        emptyMessage="Vous n'avez pas encore de commandes"
      />
    </div>
  );
};

export default MyOrdersPage;
