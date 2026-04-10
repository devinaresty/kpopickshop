import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/core/api'
import { getAuthStorageKey, getStoredUser, getAuthToken, clearAuthByRole } from '@/shared/config/auth.config'

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

function restoreUser(): User | null {
  return getStoredUser() as User | null
}

function restoreToken(): string | null {
  return getAuthToken()
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(restoreUser())
  const token = ref<string | null>(restoreToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  
  const currentRole = computed(() => user.value?.role || 'USER')
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isUser = computed(() => user.value?.role === 'USER')

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
      
      // Gunakan unique keys dari auth.config
      const keys = getAuthStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      localStorage.setItem(keys.role, response.user.role)
      
      console.log(`✅ User Login - Token stored in ${keys.token}`)
      
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
      
      // Gunakan unique keys dari auth.config
      const keys = getAuthStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      localStorage.setItem(keys.role, response.user.role)
      
      console.log(`✅ User Register - Token stored in ${keys.token}`)
      
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
      
      // Gunakan unique keys dari auth.config
      const keys = getAuthStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      localStorage.setItem(keys.role, response.user.role)
      
      console.log(`✅ Admin Register - Token stored in ${keys.token}`)
      
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
      
      const keys = getAuthStorageKey(userData.role)
      localStorage.setItem(keys.user, JSON.stringify(userData))
      
      return userData
    } catch (err) {
      logout()
      return null
    }
  }

  const logout = () => {
    const role = user.value?.role || 'USER'
    clearAuthByRole(role)
    
    console.log(`🚪 Logout ${role} - Session cleared`)
    
    user.value = null
    token.value = null
    error.value = null
  }

  const logoutAdmin = () => {
    clearAuthByRole('ADMIN')
    
    console.log(`🚪 Logout Admin - Session cleared`)
    
    user.value = null
    token.value = null
    error.value = null
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    currentRole,
    isAdmin,
    isUser,
    login,
    register,
    adminRegister,
    getCurrentUser,
    logout,
    logoutAdmin,
  }
})
