import { useState, useMemo } from "react";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";
import ProductCard from "./ProductCard";
import Input from "../common/Input";
import EmptyState from "../common/EmptyState";
import { debounce } from "../../utils/formatters";

/**
 * Product List component
 * Displays a grid of products with search and filter functionality
 */
const ProductList = ({ products = [], loading = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description &&
          product.description.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  if (!loading && products.length === 0) {
    return (
      <EmptyState
        title="Aucun produit"
        description="Il n'y a pas de produits disponibles pour le moment."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Rechercher un produit..."
            leftIcon={<FiSearch />}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-500">
            {filteredProducts.length} produit
            {filteredProducts.length !== 1 ? "s" : ""}
          </span>

          <div className="flex border border-secondary-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "text-secondary-500 hover:bg-secondary-100"
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-primary-100 text-primary-600"
                  : "text-secondary-500 hover:bg-secondary-100"
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Aucun résultat"
          description={`Aucun produit ne correspond à "${searchQuery}"`}
        />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
