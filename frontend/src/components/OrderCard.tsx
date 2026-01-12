import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
}

const statusColors: Record<string, string> = {
  CREATED: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  CREATED: 'Créée',
  PENDING: 'En cours',
  DELIVERED: 'Livrée',
  CANCELED: 'Annulée',
};

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Commande</span>
          <p className="font-mono text-sm font-medium text-gray-800">#{order.id.substring(0, 8)}...</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Date</span>
          <p className="font-medium text-gray-800">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="p-4">
        {/* Order Lines */}
        <div className="space-y-3 mb-4">
          {order.orderLines.map((line) => (
            <div key={line.id} className="flex justify-between items-center text-sm">
              <div className="flex-1">
                <span className="font-medium text-gray-800">{line.product.name}</span>
                <span className="text-gray-500 ml-2">x{line.quantity}</span>
              </div>
              <span className="text-gray-800">{line.totalLinePrice.toFixed(2)} DH</span>
            </div>
          ))}
        </div>

        {/* Total & Status */}
        <div className="flex justify-between items-center pt-3 border-t">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
          <div className="text-right">
            <span className="text-sm text-gray-500">Total</span>
            <p className="text-lg font-bold text-indigo-600">{order.totalAmount.toFixed(2)} DH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
