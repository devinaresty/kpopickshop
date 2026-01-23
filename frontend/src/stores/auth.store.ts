import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      // TODO: Call API di sini
      // const response = await authApi.login(email, password)
      // token.value = response.token
      // user.value = response.user
      // localStorage.setItem('token', response.token)
      console.log('Login:', email, password)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout
  }
})
