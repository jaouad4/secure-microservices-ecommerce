import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useProduct } from "../../hooks/useProducts";
import { useCart } from "../../contexts/CartContext";
import Loading from "../../components/common/Loading";
import { ErrorState } from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { StockBadge } from "../../components/common/Badge";
import { formatCurrency } from "../../utils/formatters";

/**
 * Product Detail Page
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { addItem, getItemQuantity, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const cartQuantity = getItemQuantity(id);
  const inCart = isInCart(id);
  const maxQuantity = product ? product.quantity - cartQuantity : 0;

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addItem(product, quantity);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return <Loading message="Chargement du produit..." fullScreen={false} />;
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Produit non trouvé"
        description="Le produit demandé n'existe pas ou a été supprimé."
        onRetry={refetch}
      />
    );
  }

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        leftIcon={<FiArrowLeft />}
        onClick={() => navigate(-1)}
      >
        Retour au catalogue
      </Button>

      {/* Product detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product image */}
        <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl aspect-square flex items-center justify-center">
          <div className="w-32 h-32 bg-white/50 rounded-full flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-secondary-900">
                {product.name}
              </h1>
              <StockBadge quantity={product.quantity} />
            </div>

            <p className="text-3xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Description
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              {product.description ||
                "Aucune description disponible pour ce produit."}
            </p>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-secondary-600">Stock disponible</span>
              <span className="font-semibold text-secondary-900">
                {product.quantity} unité{product.quantity > 1 ? "s" : ""}
              </span>
            </div>

            {inCart && (
              <div className="flex items-center justify-between mb-4 bg-primary-50 p-3 rounded-lg">
                <span className="text-primary-700">Déjà dans le panier</span>
                <span className="font-semibold text-primary-700">
                  {cartQuantity} unité{cartQuantity > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {!isOutOfStock && maxQuantity > 0 && (
              <div className="space-y-4">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-secondary-600">Quantité:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity}
                      className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleAddToCart}
                  leftIcon={<FiShoppingCart />}
                >
                  Ajouter au panier
                </Button>
              </div>
            )}

            {isOutOfStock && (
              <div className="text-center py-4">
                <p className="text-red-600 font-medium">
                  Ce produit est actuellement en rupture de stock
                </p>
              </div>
            )}

            {!isOutOfStock && maxQuantity === 0 && (
              <div className="text-center py-4">
                <p className="text-yellow-600 font-medium">
                  Vous avez ajouté le maximum disponible à votre panier
                </p>
                <Link to="/cart">
                  <Button variant="outline" className="mt-2">
                    Voir le panier
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
