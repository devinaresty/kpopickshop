import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/core/api'

interface User {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  phone?: string
  address?: string
  photoUrl?: string
  createdAt: string
  updatedAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const storedUser = localStorage.getItem('user')
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.login({ email, password })
      
      if (!response?.access_token) {
        throw new Error('Token tidak diterima dari server')
      }
      
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      error.value = null
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.register({ email, password, name })
      
      if (!response?.access_token) {
        throw new Error('Token tidak diterima dari server')
      }
      
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      error.value = null
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const adminRegister = async (email: string, password: string, name: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.adminRegister({ email, password, name })
      
      if (!response?.access_token) {
        throw new Error('Token tidak diterima dari server')
      }
      
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      error.value = null
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Admin registration failed'
      error.value = errorMessage
      throw new Error(errorMessage)
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
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (err) {
      logout()
      return null
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    adminRegister,
    getCurrentUser,
    logout,
  }
})
