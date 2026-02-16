import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/modules/landing/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

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
      }
      console.log('Updated quantity for product:', productId, 'New quantity:', quantity) // DEBUG
    }
  }

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    items.value = []
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

  return {
    items,
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
