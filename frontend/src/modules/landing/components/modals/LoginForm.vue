<template>
  <Form :validation-schema="loginValidationSchema" @submit="onSubmit" class="space-y-2.5 sm:space-y-3">
    <!-- Email Field -->
    <div>
      <Field name="email" v-slot="{ field }" class="space-y-1">
        <label class="block text-xs sm:text-sm font-medium text-gray-900">Email Address</label>
        <input
          type="email"
          v-bind="field"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-sm sm:text-base"
          placeholder="name@example.com"
        />
        <ErrorMessage name="email" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Password Field -->
    <div>
      <Field name="password" v-slot="{ field }" class="space-y-1">
        <label class="block text-xs sm:text-sm font-medium text-gray-900">Password</label>
        <input
          type="password"
          v-bind="field"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-sm sm:text-base"
          placeholder="••••••••"
        />
        <ErrorMessage name="password" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Error Message -->
    <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-700">
      {{ authStore.error }}
    </div>

    <!-- Remember Me & Forgot Password -->
    <div class="flex items-center justify-between text-xs sm:text-sm gap-2">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" class="w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300" />
        <span class="text-gray-700">Remember me</span>
      </label>
      <a href="#" class="text-black hover:text-gray-700 font-medium">Forgot password?</a>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="authStore.isLoading"
      class="w-full px-3 sm:px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
    </button>
  </Form>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { loginValidationSchema } from '../../utils/validationSchemas'
import { useAuthStore } from '../../../../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const onSubmit = async (values: Record<string, any>) => {
  try {
    const { email, password } = values as { email: string; password: string }
    await authStore.login(email, password)
    console.log('Login berhasil!')
    // Redirect ke home page setelah login
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
