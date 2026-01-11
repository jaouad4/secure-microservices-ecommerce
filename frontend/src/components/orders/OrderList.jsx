import { Link } from "react-router-dom";
import { FiEye, FiCalendar, FiPackage } from "react-icons/fi";
import Card from "../common/Card";
import Button from "../common/Button";
import { StatusBadge } from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { formatCurrency, formatDate } from "../../utils/formatters";

/**
 * Order Card component
 */
const OrderCard = ({ order, showDetails = true }) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Order info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-secondary-900">
              Commande #{order.id?.slice(0, 8)}...
            </h3>
            <StatusBadge status={order.status} />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(order.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiPackage className="w-4 h-4" />
              <span>{order.orderLines?.length || 0} article(s)</span>
            </div>
          </div>
        </div>

        {/* Price and action */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(order.totalAmount || 0)}
          </span>

          {showDetails && (
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline" size="sm" leftIcon={<FiEye />}>
                Détails
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * Order List component
 */
const OrderList = ({
  orders = [],
  loading = false,
  emptyMessage = "Aucune commande",
}) => {
  if (!loading && orders.length === 0) {
    return (
      <EmptyState
        icon={FiPackage}
        title={emptyMessage}
        description="Vous n'avez pas encore passé de commande."
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
export { OrderCard };
