import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

/**
 * Query keys for orders
 */
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (filters) => [...orderKeys.lists(), filters],
  myOrders: () => [...orderKeys.all, 'my-orders'],
  details: () => [...orderKeys.all, 'detail'],
  detail: (id) => [...orderKeys.details(), id],
  stats: () => [...orderKeys.all, 'stats'],
}

/**
 * Hook to fetch all orders (Admin)
 */
export const useOrders = (options = {}) => {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: orderService.getAllOrders,
    ...options,
  })
}

/**
 * Hook to fetch user's orders
 */
export const useMyOrders = (options = {}) => {
  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: orderService.getMyOrders,
    ...options,
  })
}

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (id, options = {}) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Hook to fetch order statistics (Admin)
 */
export const useOrderStats = (options = {}) => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: orderService.getOrderStats,
    ...options,
  })
}

/**
 * Hook to create an order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
      toast.success('Commande créée avec succès')
    },
    onError: (error) => {
      // Error already handled in service
    },
  })
}

/**
 * Hook to update order status (Admin)
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
      toast.success('Statut de la commande mis à jour')
    },
    onError: (error) => {
      // Error already handled in service
    },
  })
}

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
      toast.success('Commande annulée')
    },
    onError: (error) => {
      // Error already handled in service
    },
  })
}

export default useOrders
