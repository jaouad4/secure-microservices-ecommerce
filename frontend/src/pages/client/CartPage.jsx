import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import Cart, { CartSummary } from "../../components/orders/Cart";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

/**
 * Cart Page - Shows current cart items
 */
const CartPage = () => {
  const { isEmpty, totals } = useCart();

  if (isEmpty) {
    return (
      <div className="max-w-2xl mx-auto">
        <EmptyState
          icon={FiShoppingBag}
          title="Votre panier est vide"
          description="Parcourez notre catalogue et ajoutez des produits à votre panier."
          action={() => {}}
          actionLabel=""
        />
        <div className="text-center mt-4">
          <Link to="/catalog">
            <Button leftIcon={<FiShoppingBag />}>Parcourir le catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Mon Panier</h1>
        <p className="text-secondary-500 mt-1">
          {totals.itemCount} article{totals.itemCount > 1 ? "s" : ""} dans votre
          panier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <Cart />
        </div>

        {/* Cart summary */}
        <div className="space-y-4">
          <CartSummary />

          <Link to="/checkout">
            <Button fullWidth size="lg" rightIcon={<FiArrowRight />}>
              Passer la commande
            </Button>
          </Link>

          <Link to="/catalog">
            <Button variant="outline" fullWidth>
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
