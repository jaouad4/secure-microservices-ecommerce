import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiCheck, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { useCreateOrder } from "../../hooks/useOrders";
import { useProducts } from "../../hooks/useProducts";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency } from "../../utils/formatters";
import toast from "react-hot-toast";

/**
 * Checkout Page - Final order validation
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totals, getOrderData, clearCart, isEmpty } = useCart();
  const createOrder = useCreateOrder();
  const { data: products } = useProducts();
  const [stockErrors, setStockErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  // Validate stock before order
  const validateStock = () => {
    if (!products) return true;

    const errors = [];
    items.forEach((item) => {
      const currentProduct = products.find((p) => p.id === item.product.id);
      if (currentProduct) {
        if (currentProduct.quantity < item.quantity) {
          errors.push({
            product: item.product,
            requested: item.quantity,
            available: currentProduct.quantity,
          });
        }
      }
    });

    setStockErrors(errors);
    return errors.length === 0;
  };

  const handleSubmitOrder = async () => {
    setIsValidating(true);

    // Validate stock first
    if (!validateStock()) {
      setIsValidating(false);
      toast.error("Stock insuffisant pour certains produits");
      return;
    }

    try {
      const orderData = getOrderData();
      await createOrder.mutateAsync(orderData);

      // Clear cart and redirect
      clearCart();
      navigate("/my-orders", {
        state: { orderSuccess: true },
      });
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsValidating(false);
    }
  };

  if (isEmpty) {
    return (
      <EmptyState
        title="Panier vide"
        description="Votre panier est vide. Ajoutez des produits avant de passer commande."
        action={() => navigate("/catalog")}
        actionLabel="Parcourir le catalogue"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          leftIcon={<FiArrowLeft />}
          onClick={() => navigate("/cart")}
        >
          Retour au panier
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Finaliser la commande
        </h1>
        <p className="text-secondary-500 mt-1">
          Vérifiez votre commande avant validation
        </p>
      </div>

      {/* Stock errors */}
      {stockErrors.length > 0 && (
        <Card className="p-4 border-2 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">
                Stock insuffisant
              </h3>
              <ul className="space-y-1">
                {stockErrors.map((error) => (
                  <li key={error.product.id} className="text-sm text-red-700">
                    <strong>{error.product.name}</strong>:
                    {` demandé ${error.requested}, disponible ${error.available}`}
                  </li>
                ))}
              </ul>
              <Link to="/cart" className="inline-block mt-3">
                <Button variant="outline" size="sm">
                  Modifier le panier
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order summary */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Récapitulatif de la commande
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-secondary-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-secondary-500">
                    {formatCurrency(item.product.price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-secondary-900">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-secondary-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-secondary-600">
              <span>Sous-total</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-secondary-600">
              <span>Livraison</span>
              <span className="text-green-600">Gratuite</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-secondary-900 pt-2 border-t border-secondary-200">
              <span>Total</span>
              <span className="text-primary-600">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Confirmation */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Confirmation
          </h2>

          <div className="space-y-4">
            <div className="bg-secondary-50 rounded-lg p-4">
              <h4 className="font-medium text-secondary-900 mb-2">
                Informations de livraison
              </h4>
              <p className="text-sm text-secondary-600">
                Les informations de livraison seront récupérées depuis votre
                compte.
              </p>
            </div>

            <div className="bg-secondary-50 rounded-lg p-4">
              <h4 className="font-medium text-secondary-900 mb-2">
                Mode de paiement
              </h4>
              <p className="text-sm text-secondary-600">
                Le paiement sera traité lors de la livraison.
              </p>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleSubmitOrder}
              loading={createOrder.isPending || isValidating}
              disabled={stockErrors.length > 0}
              leftIcon={<FiCheck />}
            >
              Confirmer la commande
            </Button>

            <p className="text-xs text-secondary-500 text-center">
              En confirmant votre commande, vous acceptez nos conditions
              générales de vente.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
