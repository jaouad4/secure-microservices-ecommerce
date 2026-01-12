import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated, isClient, isAdmin, login } = useAuth();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError('Produit introuvable');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (product && isClient) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const canAddToCart = isAuthenticated && isClient && product && product.quantity > 0;
  const isOutOfStock = product?.quantity === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Produit introuvable</h2>
        <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Retour aux produits
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux produits
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 h-80 md:h-auto bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <svg className={`w-32 h-32 text-indigo-300 ${product.imageUrl ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="text-3xl font-bold text-indigo-600 mb-6">
              {product.price.toFixed(2)} DH
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Rupture de stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  En stock ({product.quantity} disponibles)
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Aucune description disponible pour ce produit.'}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {!isAdmin && (
              <div className="space-y-4">
                {!isOutOfStock && isAuthenticated && isClient && (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Quantité:</span>
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        className="px-3 py-2 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-md bg-gray-300 text-gray-500 font-medium cursor-not-allowed"
                  >
                    Produit indisponible
                  </button>
                ) : !isAuthenticated ? (
                  <button
                    onClick={login}
                    className="w-full py-3 px-6 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                  >
                    Se connecter pour commander
                  </button>
                ) : isClient ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className={`w-full py-3 px-6 rounded-md font-medium transition ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {addedToCart ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
                  </button>
                ) : (
                  <p className="text-center text-gray-500 py-3">
                    Les administrateurs ne peuvent pas passer de commandes
                  </p>
                )}
              </div>
            )}

            {/* Success message */}
            {addedToCart && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm text-center">
                Produit ajouté au panier ! 
                <button 
                  onClick={() => navigate('/cart')}
                  className="ml-2 underline font-medium"
                >
                  Voir le panier
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
