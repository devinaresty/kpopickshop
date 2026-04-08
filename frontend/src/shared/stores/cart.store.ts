import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/modules/landing/types'

const CART_STORAGE_KEY = 'kpopick_cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const loadCartFromStorage = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (err) {
    }
  }

  const saveCartToStorage = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
    } catch (err) {
    }
  }

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
    console.log('Added to cart:', product.name, 'Quantity:', quantity) 
  }

  const removeFromCart = (productId: string | number) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
    saveCartToStorage()
  }

  const updateQuantity = (productId: string | number, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCartToStorage()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveCartToStorage()
  }

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })

  const cartItems = computed(() => items.value)

  const isEmpty = computed(() => items.value.length === 0)

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
