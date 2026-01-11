import { FiCalendar, FiPackage, FiUser } from "react-icons/fi";
import Card from "../common/Card";
import { StatusBadge } from "../common/Badge";
import { formatCurrency, formatDate } from "../../utils/formatters";

/**
 * Order Details component
 */
const OrderDetails = ({ order }) => {
  if (!order) return null;

  return (
    <div className="space-y-6">
      {/* Order header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-secondary-900 mb-2">
              Commande #{order.id?.slice(0, 8)}...
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                <span>{formatDate(order.date)}</span>
              </div>
              {order.customer && (
                <div className="flex items-center gap-1">
                  <FiUser className="w-4 h-4" />
                  <span>{order.customer}</span>
                </div>
              )}
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </Card>

      {/* Order items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Produits commandés
        </h3>

        <div className="space-y-4">
          {order.orderLines?.map((line, index) => (
            <div
              key={line.id || index}
              className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg"
            >
              {/* Product image placeholder */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPackage className="w-6 h-6 text-primary-600" />
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-secondary-900">
                  {line.product?.name ||
                    `Produit #${line.productId || line.id}`}
                </h4>
                <p className="text-sm text-secondary-500">
                  {formatCurrency(line.price || line.product?.price || 0)} ×{" "}
                  {line.quantity}
                </p>
              </div>

              {/* Line total */}
              <div className="text-right">
                <p className="font-semibold text-secondary-900">
                  {formatCurrency(
                    line.totalLinePrice || line.price * line.quantity || 0
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order total */}
        <div className="border-t border-secondary-200 mt-6 pt-6">
          <div className="flex justify-between items-center">
            <span className="text-secondary-600">Sous-total</span>
            <span className="text-secondary-900">
              {formatCurrency(order.totalAmount || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-secondary-600">Livraison</span>
            <span className="text-green-600">Gratuite</span>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-200">
            <span className="text-lg font-bold text-secondary-900">Total</span>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(order.totalAmount || 0)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
