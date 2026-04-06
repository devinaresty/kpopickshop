<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4 sm:px-4 lg:px-6">
    <div class="w-full max-w-4xl">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        <div class="lg:col-span-2 flex flex-col justify-center lg:pr-8">
          <div class="w-full">
            
            <div class="mb-6">
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Welcome back
              </h1>
              <p class="text-gray-600 text-sm sm:text-base whitespace-nowrap">
                Continue with one of the following options
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

              <button
                type="button"
                disabled
                class="w-full px-4 py-2.5 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Coming soon"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span class="text-gray-400 text-xs">Continue with Google</span>
              </button>

              <div class="text-center text-xs">
                <span class="text-gray-500">Don't have an account?</span>
                <a href="#" class="font-semibold text-gray-900 hover:text-gray-700 transition-colors">Sign Up</a>
              </div>

            </Form>

          </div>
        </div>

        <div class="lg:col-span-3 flex items-center justify-center lg:pl-8 py-8 lg:py-0">
          <div class="w-full h-96 lg:h-screen lg:max-h-[550px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-2xl border border-gray-300/50 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
            <div class="text-center px-6">
              <div class="mb-4">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-gray-600 text-2xl font-semibold mb-2">Admin Panel</p>
              <p class="text-gray-500 text-sm">Tempatkan gambar dashboard atau brand di sini</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { loginValidationSchema } from '@/modules/landing/utils/validationSchemas'
import { useAuthStore } from '@/shared/stores'

const router = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated && authStore.user?.role === 'ADMIN') {
    router.push({ name: 'admin-dashboard' })
  }
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const onSubmit = async (values: Record<string, any>) => {
  try {
    const { email, password } = values as { email: string; password: string }
    
    await authStore.login(email, password)
    
    if (authStore.user?.role === 'ADMIN') {
      console.log('Admin login successful!')
      await router.push({ name: 'admin-dashboard' })
    } else {
      authStore.error = 'You do not have admin access. Please contact the administrator.'
      authStore.logout()
      console.warn('User is not an admin')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>

<style scoped>
input {
  transition: all 0.2s ease;
}

input:focus {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}
</style>
