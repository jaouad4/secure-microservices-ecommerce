import { useState, useMemo } from "react";
import { FiSearch, FiRefreshCw, FiEye, FiFilter } from "react-icons/fi";
import { useOrders } from "../../hooks/useOrders";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input, { Select } from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loading from "../../components/common/Loading";
import { ErrorState } from "../../components/common/EmptyState";
import EmptyState from "../../components/common/EmptyState";
import OrderDetails from "../../components/orders/OrderDetails";
import { StatusBadge } from "../../components/common/Badge";
import { formatCurrency, formatDate, debounce } from "../../utils/formatters";

/**
 * Order Management Page (Admin)
 */
const OrderManagement = () => {
  const { data: orders, isLoading, isError, refetch } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let filtered = [...orders];

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) =>
        order.id.toLowerCase().includes(query)
      );
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
  }, [orders, searchQuery, statusFilter]);

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  // Order status options
  const statusOptions = [
    { value: "CREATED", label: "Créée" },
    { value: "PENDING", label: "En cours" },
    { value: "DELIVERED", label: "Livrée" },
    { value: "CANCELED", label: "Annulée" },
  ];

  // Stats
  const stats = useMemo(() => {
    if (!orders) return {};
    return {
      total: orders.length,
      created: orders.filter((o) => o.status === "CREATED").length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      canceled: orders.filter((o) => o.status === "CANCELED").length,
    };
  }, [orders]);

  if (isLoading) {
    return <Loading message="Chargement des commandes..." fullScreen={false} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erreur de chargement"
        description="Impossible de charger les commandes."
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
            Gestion des Commandes
          </h1>
          <p className="text-secondary-500 mt-1">
            {orders?.length || 0} commande(s) au total
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          leftIcon={<FiRefreshCw />}
        >
          Actualiser
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter("")}
          className={`p-4 rounded-lg text-left transition-all ${
            !statusFilter
              ? "bg-primary-100 border-2 border-primary-500"
              : "bg-white border border-secondary-200 hover:bg-secondary-50"
          }`}
        >
          <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
          <p className="text-sm text-secondary-500">Toutes</p>
        </button>
        <button
          onClick={() => setStatusFilter("CREATED")}
          className={`p-4 rounded-lg text-left transition-all ${
            statusFilter === "CREATED"
              ? "bg-blue-100 border-2 border-blue-500"
              : "bg-white border border-secondary-200 hover:bg-secondary-50"
          }`}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.created}</p>
          <p className="text-sm text-secondary-500">Créées</p>
        </button>
        <button
          onClick={() => setStatusFilter("PENDING")}
          className={`p-4 rounded-lg text-left transition-all ${
            statusFilter === "PENDING"
              ? "bg-yellow-100 border-2 border-yellow-500"
              : "bg-white border border-secondary-200 hover:bg-secondary-50"
          }`}
        >
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-secondary-500">En cours</p>
        </button>
        <button
          onClick={() => setStatusFilter("DELIVERED")}
          className={`p-4 rounded-lg text-left transition-all ${
            statusFilter === "DELIVERED"
              ? "bg-green-100 border-2 border-green-500"
              : "bg-white border border-secondary-200 hover:bg-secondary-50"
          }`}
        >
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-sm text-secondary-500">Livrées</p>
        </button>
        <button
          onClick={() => setStatusFilter("CANCELED")}
          className={`p-4 rounded-lg text-left transition-all ${
            statusFilter === "CANCELED"
              ? "bg-red-100 border-2 border-red-500"
              : "bg-white border border-secondary-200 hover:bg-secondary-50"
          }`}
        >
          <p className="text-2xl font-bold text-red-600">{stats.canceled}</p>
          <p className="text-sm text-secondary-500">Annulées</p>
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Rechercher par ID..."
            leftIcon={<FiSearch />}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            placeholder="Tous les statuts"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Orders table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="Aucune commande"
          description={
            searchQuery || statusFilter
              ? "Aucune commande ne correspond aux critères"
              : "Aucune commande pour le moment."
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        #{order.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-600">
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-600">
                        {order.orderLines?.length || 0} article(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {formatCurrency(order.totalAmount || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title={`Détails de la commande #${viewingOrder?.id?.slice(0, 8)}...`}
        size="lg"
      >
        {viewingOrder && <OrderDetails order={viewingOrder} />}
      </Modal>
    </div>
  );
};

export default OrderManagement;
