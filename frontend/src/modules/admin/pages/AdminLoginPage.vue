<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-md p-8">
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Admin Login
          </h1>
          <p class="text-gray-600 text-sm">
            Sign in to your admin account
          </p>
        </div>

        <Form :validation-schema="loginValidationSchema" @submit="onSubmit" class="space-y-4">
              
              <div>
                <label class="block text-xs font-medium text-gray-900 mb-1.5">
                  Email
                </label>
                <Field name="email" v-slot="{ field, meta }">
                  <input
                    type="email"
                    v-bind="field"
                    placeholder="Email Address"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                    :class="{ 'border-red-500': meta.touched && !meta.valid }"
                  />
                  <ErrorMessage name="email" class="text-xs text-red-500 mt-1 block" />
                </Field>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-900 mb-1.5">
                  Password
                </label>
                <Field name="password" v-slot="{ field, meta }">
                  <div class="relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-bind="field"
                      placeholder="••••••••"
                      class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                      :class="{ 'border-red-500': meta.touched && !meta.valid }"
                    />
                    <button
                      type="button"
                      @click="togglePasswordVisibility"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                      <svg
                        v-if="!showPassword"
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <ErrorMessage name="password" class="text-xs text-red-500 mt-1 block" />
                </Field>
              </div>

              <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {{ authStore.error }}
              </div>

              <div class="flex justify-end">
                <a href="#" class="text-xs font-medium text-gray-900 hover:text-gray-700 transition-colors">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                :disabled="authStore.isLoading"
                class="w-full px-4 py-2.5 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
              </button>

              <div class="text-center text-xs">
                <span class="text-gray-500">Don't have an account?</span>
                <button
                  type="button"
                  @click="navigateToSignUp"
                  class="font-semibold text-gray-900 hover:text-gray-700 transition-colors bg-none border-none cursor-pointer"
                >
                  Sign Up
                </button>
              </div>

            </Form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { loginValidationSchema } from '@/modules/admin/utils'
import { useAuthStore } from '@/shared/stores'

const router = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated && authStore.user?.role === 'ADMIN') {
    window.location.href = '/admin/dashboard'
  }
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const navigateToSignUp = () => {
  router.push({ name: 'admin-signup' })
}

const onSubmit = async (values: Record<string, any>) => {
  try {
    const { email, password } = values as { email: string; password: string }
    
    console.log('[AdminLoginPage] Attempting login with:', email)
    await authStore.login(email, password)
    
    console.log('[AdminLoginPage] Login response:', {
      user: authStore.user,
      role: authStore.user?.role,
      token: authStore.token ? 'exists' : 'missing'
    })
    
    const userRole = authStore.user?.role?.toUpperCase()
    
    console.log('[AdminLoginPage] Role check:', {
      userRole: authStore.user?.role,
      upperCase: userRole,
      isAdmin: userRole === 'ADMIN',
      fullUser: JSON.stringify(authStore.user)
    })
    
    if (userRole === 'ADMIN') {
      console.log('[AdminLoginPage] ✅ Admin login successful, role:', authStore.user?.role)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      await router.push({ name: 'admin-dashboard' })
    } else {
      console.warn('[AdminLoginPage] ❌ User is not an admin, role:', authStore.user?.role, 'Type:', typeof authStore.user?.role)
      authStore.error = 'You do not have admin access. Please contact the administrator.'
      authStore.logout()
    }
  } catch (error) {
    console.error('[AdminLoginPage] Login error:', error)
  }
}
</script>
