import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '../lib/api'

interface User {
  id: number
  email: string
  name: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.login({ email, password })
      console.log('Login response:', response) // DEBUG
      
      if (!response?.access_token) {
        throw new Error('Token tidak diterima dari server')
      }
      
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      console.log('Token saved to localStorage:', response.access_token) // DEBUG
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      console.error('Login failed:', err) // DEBUG
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.register({ email, password, name })
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      console.error('Registration failed:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getCurrentUser = async () => {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      const userData = await apiClient.getCurrentUser()
      user.value = userData
      return userData
    } catch (err) {
      console.error('Failed to get current user:', err)
      logout()
      return null
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    getCurrentUser,
    logout,
  }
})
