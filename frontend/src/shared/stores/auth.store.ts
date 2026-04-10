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

// Helper: Get appropriate storage key based on role
function getStorageKey(role: string): { token: string; user: string } {
  return role === 'ADMIN' 
    ? { token: 'ADMIN_TOKEN', user: 'ADMIN_USER' }
    : { token: 'USER_TOKEN', user: 'USER_USER' }
}

// Helper: Restore appropriate user based on stored role
function restoreUser(): User | null {
  const adminUser = localStorage.getItem('ADMIN_USER')
  const userUser = localStorage.getItem('USER_USER')
  
  if (adminUser) {
    try {
      return JSON.parse(adminUser)
    } catch (e) {
      console.error('Failed to parse admin user:', e)
    }
  }
  
  if (userUser) {
    try {
      return JSON.parse(userUser)
    } catch (e) {
      console.error('Failed to parse user:', e)
    }
  }
  
  return null
}

// Helper: Restore appropriate token
function restoreToken(): string | null {
  return localStorage.getItem('ADMIN_TOKEN') || localStorage.getItem('USER_TOKEN')
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
      
      // Store in role-specific storage key
      const keys = getStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      
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
      
      // Store in role-specific storage key
      const keys = getStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      
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
      
      // Store in role-specific storage key (admin)
      const keys = getStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      
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
      
      // Update stored user based on role
      const keys = getStorageKey(userData.role)
      localStorage.setItem(keys.user, JSON.stringify(userData))
      
      return userData
    } catch (err) {
      logout()
      return null
    }
  }

  const logout = () => {
    // Determine which tokens to clear based on current user role
    const role = user.value?.role || 'USER'
    const keys = getStorageKey(role)
    
    // Clear only the tokens for this role
    localStorage.removeItem(keys.token)
    localStorage.removeItem(keys.user)
    
    // Clear memory refs
    user.value = null
    token.value = null
    error.value = null
  }

  const logoutAdmin = () => {
    // Force logout of admin session only
    localStorage.removeItem('ADMIN_TOKEN')
    localStorage.removeItem('ADMIN_USER')
    
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
