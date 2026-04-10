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

function getStorageKey(role: string): { token: string; user: string } {
  return role === 'ADMIN' 
    ? { token: 'ADMIN_TOKEN', user: 'ADMIN_USER' }
    : { token: 'USER_TOKEN', user: 'USER_USER' }
}

function restoreUser(): User | null {
  const currentRole = localStorage.getItem('CURRENT_ROLE')
  
  if (currentRole === 'ADMIN') {
    const adminUser = localStorage.getItem('ADMIN_USER')
    if (adminUser) {
      try {
        return JSON.parse(adminUser)
      } catch (e) {
        console.error('Failed to parse admin user:', e)
      }
    }
  } else if (currentRole === 'USER') {
    const userUser = localStorage.getItem('USER_USER')
    if (userUser) {
      try {
        return JSON.parse(userUser)
      } catch (e) {
        console.error('Failed to parse user:', e)
      }
    }
  }
  
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

function restoreToken(): string | null {
  // Check which role is currently active
  const currentRole = localStorage.getItem('CURRENT_ROLE')
  
  if (currentRole === 'ADMIN') {
    return localStorage.getItem('ADMIN_TOKEN')
  } else if (currentRole === 'USER') {
    return localStorage.getItem('USER_TOKEN')
  }
  
  // Fallback: check both if CURRENT_ROLE is not set
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
      
      const keys = getStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      localStorage.setItem('CURRENT_ROLE', response.user.role)
      
      // Clear opposite role to prevent conflicts
      if (response.user.role === 'USER') {
        localStorage.removeItem('ADMIN_TOKEN')
        localStorage.removeItem('ADMIN_USER')
      } else if (response.user.role === 'ADMIN') {
        localStorage.removeItem('USER_TOKEN')
        localStorage.removeItem('USER_USER')
      }
      
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
      
      const keys = getStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      localStorage.setItem('CURRENT_ROLE', response.user.role)
      
      // Clear opposite role to prevent conflicts
      if (response.user.role === 'USER') {
        localStorage.removeItem('ADMIN_TOKEN')
        localStorage.removeItem('ADMIN_USER')
      } else if (response.user.role === 'ADMIN') {
        localStorage.removeItem('USER_TOKEN')
        localStorage.removeItem('USER_USER')
      }
      
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
      
      const keys = getStorageKey(response.user.role)
      localStorage.setItem(keys.token, response.access_token)
      localStorage.setItem(keys.user, JSON.stringify(response.user))
      localStorage.setItem('CURRENT_ROLE', response.user.role)
      
      // Clear opposite role to prevent conflicts
      if (response.user.role === 'USER') {
        localStorage.removeItem('ADMIN_TOKEN')
        localStorage.removeItem('ADMIN_USER')
      } else if (response.user.role === 'ADMIN') {
        localStorage.removeItem('USER_TOKEN')
        localStorage.removeItem('USER_USER')
      }
      
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
      
      const keys = getStorageKey(userData.role)
      localStorage.setItem(keys.user, JSON.stringify(userData))
      
      return userData
    } catch (err) {
      logout()
      return null
    }
  }

  const logout = () => {
    const role = user.value?.role || 'USER'
    const keys = getStorageKey(role)
    
    localStorage.removeItem(keys.token)
    localStorage.removeItem(keys.user)
    localStorage.removeItem('CURRENT_ROLE')
    
    user.value = null
    token.value = null
    error.value = null
  }

  const logoutAdmin = () => {
    localStorage.removeItem('ADMIN_TOKEN')
    localStorage.removeItem('ADMIN_USER')
    localStorage.removeItem('CURRENT_ROLE')
    
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
