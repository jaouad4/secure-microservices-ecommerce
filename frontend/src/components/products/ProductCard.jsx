import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import Card from "../common/Card";
import Button from "../common/Button";
import { StockBadge } from "../common/Badge";
import { useCart } from "../../contexts/CartContext";
import { formatCurrency, truncateText } from "../../utils/formatters";

/**
 * Product Card component for the catalog
 */
const ProductCard = ({ product }) => {
  const { addItem, isInCart, getItemQuantity } = useCart();
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const isOutOfStock = product.quantity === 0;

  return (
    <Card hover className="flex flex-col h-full overflow-hidden">
      {/* Product Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <Link
            to={`/catalog/${product.id}`}
            className="block hover:text-primary-600 transition-colors"
          >
            <h3 className="font-semibold text-secondary-900 text-lg mb-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-secondary-500 text-sm mb-3">
            {truncateText(product.description, 80) ||
              "Aucune description disponible"}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
            <StockBadge quantity={product.quantity} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link to={`/catalog/${product.id}`} className="flex-1">
            <Button variant="outline" fullWidth size="sm" leftIcon={<FiEye />}>
              Détails
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            leftIcon={<FiShoppingCart />}
            className="flex-1"
          >
            {inCart ? `(${cartQuantity})` : "Ajouter"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
