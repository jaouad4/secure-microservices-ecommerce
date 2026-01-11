import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import productService from '../services/productService'
import toast from 'react-hot-toast'

/**
 * Query keys for products
 */
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
}

/**
 * Hook to fetch all products
 */
export const useProducts = (options = {}) => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: productService.getAllProducts,
    ...options,
  })
}

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (id, options = {}) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Hook to search products
 */
export const useSearchProducts = (query, options = {}) => {
  return useQuery({
    queryKey: productKeys.list({ search: query }),
    queryFn: () => productService.searchProducts(query),
    enabled: query?.length > 0,
    ...options,
  })
}

/**
 * Hook to create a product (Admin)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success('Produit créé avec succès')
    },
    onError: (error) => {
      // Error already handled in service
    },
  })
}

/**
 * Hook to update a product (Admin)
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
      toast.success('Produit mis à jour avec succès')
    },
    onError: (error) => {
      // Error already handled in service
    },
  })
}

/**
 * Hook to delete a product (Admin)
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.removeQueries({ queryKey: productKeys.detail(id) })
      toast.success('Produit supprimé avec succès')
    },
    onError: (error) => {
      // Error already handled in service
    },
  })
}

/**
 * Hook to check stock availability
 */
export const useCheckStock = (productId, quantity, options = {}) => {
  return useQuery({
    queryKey: [...productKeys.detail(productId), 'stock', quantity],
    queryFn: () => productService.checkStock(productId, quantity),
    enabled: !!productId && quantity > 0,
    ...options,
  })
}

export default useProducts
