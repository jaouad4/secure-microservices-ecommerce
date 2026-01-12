import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useState } from 'react';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { isAuthenticated, isClient, login } = useAuth();
  const navigate = useNavigate();
  const [isOrdering, setIsOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    if (!isClient) {
      setError("Seuls les clients peuvent passer des commandes");
      return;
    }

    setIsOrdering(true);
    setError(null);

    try {
      const orderRequest = {
        products: items.reduce((acc, item) => {
          acc[item.product.id] = item.quantity;
          return acc;
        }, {} as Record<string, number>),
      };

      await orderService.createOrder(orderRequest);
      clearCart();
      navigate('/orders', { state: { message: 'Commande passée avec succès !' } });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la commande. Vérifiez la disponibilité des produits.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
        <p className="text-gray-600 mb-6">Découvrez nos produits et commencez vos achats</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Votre Panier</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center p-4 border-b last:border-b-0">
            {/* Product Image */}
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-md flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            {/* Product Info */}
            <div className="flex-1 ml-4">
              <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
              <p className="text-indigo-600 font-medium">{item.product.price.toFixed(2)} DH</p>
              <p className="text-sm text-gray-500">Stock disponible: {item.product.quantity}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.quantity}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50"
              >
                +
              </button>
            </div>

            {/* Line Total */}
            <div className="ml-6 text-right">
              <p className="font-bold text-gray-800">{(item.product.price * item.quantity).toFixed(2)} DH</p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="ml-4 text-red-500 hover:text-red-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Sous-total</span>
          <span className="font-medium">{totalPrice.toFixed(2)} DH</span>
        </div>
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-indigo-600">{totalPrice.toFixed(2)} DH</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Vider le panier
          </button>
          <button
            onClick={handleCheckout}
            disabled={isOrdering}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium disabled:opacity-50"
          >
            {isOrdering ? 'Commande en cours...' : isAuthenticated ? 'Commander' : 'Se connecter pour commander'}
          </button>
        </div>

        {!isAuthenticated && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Vous devez être connecté en tant que client pour passer une commande
          </p>
        )}
      </div>
    </div>
  );
};

export default CartPage;
