import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/modules/landing/types'

const CART_STORAGE_KEY = 'kpopick_cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  /**
   * Load cart from localStorage
   */
  const loadCartFromStorage = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
        console.log('Cart loaded from localStorage:', items.value.length, 'items')
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err)
    }
  }

  /**
   * Save cart to localStorage
   */
  const saveCartToStorage = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
      console.log('Cart saved to localStorage:', items.value.length, 'items')
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err)
    }
  }

  /**
   * Add product to cart or increase quantity if already exists
   */
  const addToCart = (product: CartItem, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        ...product,
        quantity
      })
    }
    saveCartToStorage()
    console.log('Added to cart:', product.name, 'Quantity:', quantity) // DEBUG
  }

  /**
   * Remove product from cart by id
   */
  const removeFromCart = (productId: string | number) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      const removedItem = items.value[index]
      if (removedItem) {
        console.log('Removed from cart:', removedItem.name) // DEBUG
      }
      items.value.splice(index, 1)
    }
    saveCartToStorage()
  }

  /**
   * Update quantity of cart item
   */
  const updateQuantity = (productId: string | number, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCartToStorage()
      }
      console.log('Updated quantity for product:', productId, 'New quantity:', quantity) // DEBUG
    }
  }

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    items.value = []
    saveCartToStorage()
    console.log('Cart cleared') // DEBUG
  }

  /**
   * Calculate total price of cart
   */
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  /**
   * Calculate total number of items in cart
   */
  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })

  /**
   * Get all cart items
   */
  const cartItems = computed(() => items.value)

  /**
   * Check if cart is empty
   */
  const isEmpty = computed(() => items.value.length === 0)

  // Load cart from localStorage on store initialization
  loadCartFromStorage()

  return {
    items,
    loadCartFromStorage,
    saveCartToStorage,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    itemCount,
    cartItems,
    isEmpty
  }
})
