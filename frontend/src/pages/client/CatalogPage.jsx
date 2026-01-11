import { useProducts } from "../../hooks/useProducts";
import ProductList from "../../components/products/ProductList";
import Loading from "../../components/common/Loading";
import { ErrorState } from "../../components/common/EmptyState";

/**
 * Catalog Page - Displays all products for browsing
 */
const CatalogPage = () => {
  const { data: products, isLoading, isError, refetch } = useProducts();

  if (isLoading) {
    return <Loading message="Chargement des produits..." fullScreen={false} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Erreur de chargement"
        description="Impossible de charger les produits. Veuillez réessayer."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Catalogue</h1>
          <p className="text-secondary-500 mt-1">
            Découvrez notre sélection de produits
          </p>
        </div>
      </div>

      {/* Products list */}
      <ProductList products={products || []} loading={isLoading} />
    </div>
  );
};

export default CatalogPage;
