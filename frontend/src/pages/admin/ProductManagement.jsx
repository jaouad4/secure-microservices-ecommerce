import { useState, useMemo } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/useProducts";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal, { ConfirmModal } from "../../components/common/Modal";
import Loading from "../../components/common/Loading";
import { ErrorState } from "../../components/common/EmptyState";
import EmptyState from "../../components/common/EmptyState";
import ProductForm from "../../components/products/ProductForm";
import { StockBadge } from "../../components/common/Badge";
import { formatCurrency, debounce } from "../../utils/formatters";

/**
 * Product Management Page (Admin)
 */
const ProductManagement = () => {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleCreateProduct = async (data) => {
    try {
      await createProduct.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleUpdateProduct = async (data) => {
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, data });
      setEditingProduct(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return <Loading message="Chargement des produits..." fullScreen={false} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erreur de chargement"
        description="Impossible de charger les produits."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Gestion des Produits
          </h1>
          <p className="text-secondary-500 mt-1">
            {products?.length || 0} produit(s) au total
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            leftIcon={<FiRefreshCw />}
          >
            Actualiser
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<FiPlus />}
          >
            Nouveau produit
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="w-full sm:w-80">
        <Input
          placeholder="Rechercher un produit..."
          leftIcon={<FiSearch />}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Products table */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          description={
            searchQuery
              ? `Aucun produit ne correspond à "${searchQuery}"`
              : "Commencez par ajouter un produit."
          }
          action={() => setIsCreateModalOpen(true)}
          actionLabel="Ajouter un produit"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">📦</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-secondary-500">
                            ID: {product.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-secondary-900">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StockBadge quantity={product.quantity} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nouveau produit"
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={createProduct.isPending}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Modifier le produit"
      >
        {editingProduct && (
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => setEditingProduct(null)}
            loading={updateProduct.isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${deletingProduct?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        loading={deleteProduct.isPending}
      />
    </div>
  );
};

export default ProductManagement;
