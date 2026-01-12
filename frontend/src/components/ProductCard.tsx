import type { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showAdminActions?: boolean;
}

const ProductCard = ({ product, onEdit, onDelete, showAdminActions = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
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
        <svg className={`w-20 h-20 text-indigo-300 ${product.imageUrl ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{product.name}</h3>
        
        {/* Price */}
        <p className="text-xl font-bold text-indigo-600 text-center mb-3">{product.price.toFixed(2)} DH</p>

        {/* Stock indicator */}
        <div className="flex justify-center mb-4">
          {isOutOfStock ? (
            <span className="text-red-500 text-sm font-medium">Rupture de stock</span>
          ) : (
            <span className="text-green-600 text-sm font-medium">En stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {showAdminActions && isAdmin ? (
            <>
              <button
                onClick={() => onEdit?.(product)}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition text-sm font-medium"
              >
                Modifier
              </button>
              <button
                onClick={() => onDelete?.(product)}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition text-sm font-medium"
              >
                Supprimer
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium"
            >
              Voir détails
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
