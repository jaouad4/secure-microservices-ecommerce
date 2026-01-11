import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { logger } from '../utils/logger'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'ecommerce_cart'

/**
 * Load cart from localStorage
 */
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    logger.error('Failed to load cart from storage', error)
    return []
  }
}

/**
 * Save cart to localStorage
 */
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    logger.error('Failed to save cart to storage', error)
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => loadCartFromStorage())

  /**
   * Add item to cart
   */
  const addItem = useCallback((product, quantity = 1) => {
    setItems(currentItems => {
      const existingIndex = currentItems.findIndex(item => item.product.id === product.id)
      
      let newItems
      if (existingIndex >= 0) {
        // Update quantity if item exists
        newItems = currentItems.map((item, index) => {
          if (index === existingIndex) {
            const newQuantity = item.quantity + quantity
            // Check stock limit
            if (newQuantity > product.quantity) {
              toast.error(`Stock insuffisant. Disponible: ${product.quantity}`)
              return item
            }
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        toast.success('Quantité mise à jour')
      } else {
        // Add new item
        if (quantity > product.quantity) {
          toast.error(`Stock insuffisant. Disponible: ${product.quantity}`)
          return currentItems
        }
        newItems = [...currentItems, { product, quantity }]
        toast.success('Produit ajouté au panier')
      }

      saveCartToStorage(newItems)
      logger.action('Cart item added', { productId: product.id, quantity })
      return newItems
    })
  }, [])

  /**
   * Remove item from cart
   */
  const removeItem = useCallback((productId) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.product.id !== productId)
      saveCartToStorage(newItems)
      logger.action('Cart item removed', { productId })
      toast.success('Produit retiré du panier')
      return newItems
    })
  }, [])

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems(currentItems => {
      const newItems = currentItems.map(item => {
        if (item.product.id === productId) {
          // Check stock limit
          if (quantity > item.product.quantity) {
            toast.error(`Stock insuffisant. Disponible: ${item.product.quantity}`)
            return item
          }
          return { ...item, quantity }
        }
        return item
      })
      saveCartToStorage(newItems)
      logger.action('Cart quantity updated', { productId, quantity })
      return newItems
    })
  }, [removeItem])

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
    logger.action('Cart cleared')
  }, [])

  /**
   * Get item quantity
   */
  const getItemQuantity = useCallback((productId) => {
    const item = items.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }, [items])

  /**
   * Check if item is in cart
   */
  const isInCart = useCallback((productId) => {
    return items.some(item => item.product.id === productId)
  }, [items])

  /**
   * Calculate totals
   */
  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    
    return {
      itemCount,
      subtotal,
      total: subtotal, // Could add taxes, shipping, etc.
    }
  }, [items])

  /**
   * Get cart data for order creation
   */
  const getOrderData = useCallback(() => {
    const products = {}
    items.forEach(item => {
      products[item.product.id] = item.quantity
    })
    return { products }
  }, [items])

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    totals,
    getOrderData,
    isEmpty: items.length === 0,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
