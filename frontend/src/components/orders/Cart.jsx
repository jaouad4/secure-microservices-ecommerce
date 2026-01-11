import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatters";

/**
 * Single Cart Item component
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const totalPrice = product.price * quantity;
  const isMaxQuantity = quantity >= product.quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-secondary-100">
      {/* Product Image Placeholder */}
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">📦</span>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-secondary-900 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-secondary-500">
          {formatCurrency(product.price)} / unité
        </p>
        {product.quantity <= 5 && (
          <p className="text-xs text-yellow-600 mt-1">
            Stock limité: {product.quantity} restant
            {product.quantity > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-100 transition-colors"
        >
          <FiMinus className="w-4 h-4" />
        </button>

        <span className="w-12 text-center font-medium text-secondary-900">
          {quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(1)}
          disabled={isMaxQuantity}
          className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Total price */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-secondary-900">
          {formatCurrency(totalPrice)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeItem(product.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <FiTrash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

/**
 * Cart component with all items
 */
const Cart = () => {
  const { items, totals, clearCart, isEmpty } = useCart();

  if (isEmpty) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Cart items */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Clear cart button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          leftIcon={<FiTrash2 />}
        >
          Vider le panier
        </Button>
      </div>
    </div>
  );
};

/**
 * Cart Summary component
 */
export const CartSummary = () => {
  const { totals } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">
        Récapitulatif
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between text-secondary-600">
          <span>Articles ({totals.itemCount})</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>

        <div className="flex justify-between text-secondary-600">
          <span>Livraison</span>
          <span className="text-green-600">Gratuite</span>
        </div>

        <div className="border-t border-secondary-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-secondary-900">
            <span>Total</span>
            <span className="text-primary-600">
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
