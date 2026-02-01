import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LandingState } from '../domain/landing.types'

export const useLandingStore = defineStore('landing', () => {
  const state = ref<LandingState>({
    isAuthModalOpen: false,
    authModalMode: 'login',
    isOtherOptionsModalOpen: false,
    isCartOpen: false,
    cartItems: []
  })

  // Auth Modal Actions
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    state.value.authModalMode = mode
    state.value.isAuthModalOpen = true
  }

  const closeAuthModal = () => {
    state.value.isAuthModalOpen = false
    state.value.isOtherOptionsModalOpen = false
  }

  const toggleAuthMode = () => {
    state.value.authModalMode = state.value.authModalMode === 'login' ? 'register' : 'login'
  }

  // Other Options Modal
  const openOtherOptionsModal = () => {
    state.value.isOtherOptionsModalOpen = true
  }

  const closeOtherOptionsModal = () => {
    state.value.isOtherOptionsModalOpen = false
  }

  // Cart Actions
  const toggleCart = () => {
    state.value.isCartOpen = !state.value.isCartOpen
  }

  const closeCart = () => {
    state.value.isCartOpen = false
  }

  return {
    state,
    openAuthModal,
    closeAuthModal,
    toggleAuthMode,
    openOtherOptionsModal,
    closeOtherOptionsModal,
    toggleCart,
    closeCart
  }
})
