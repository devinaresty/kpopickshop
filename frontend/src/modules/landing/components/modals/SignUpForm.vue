<template>
  <Form :validation-schema="signupValidationSchema" @submit="onSubmit" class="space-y-2">
    <!-- Full Name Field -->
    <div>
      <Field name="name" v-slot="{ field }" class="space-y-0.5">
        <label class="block text-xs font-medium text-gray-900">Full Name</label>
        <input
          type="text"
          v-bind="field"
          class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-xs"
          placeholder="John Doe"
        />
        <ErrorMessage name="name" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Email Field -->
    <div>
      <Field name="email" v-slot="{ field }" class="space-y-0.5">
        <label class="block text-xs font-medium text-gray-900">Email Address</label>
        <input
          type="email"
          v-bind="field"
          class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-xs"
          placeholder="name@example.com"
        />
        <ErrorMessage name="email" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Password Field -->
    <div>
      <Field name="password" v-slot="{ field }" class="space-y-0.5">
        <label class="block text-xs font-medium text-gray-900">Password</label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-bind="field"
            class="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-xs"
            placeholder="••••••••"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            <!-- Eye Icon (Open) -->
            <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <!-- Eye Icon (Closed) -->
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.391m5.005-2.905A9.005 9.005 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.006 10.006 0 01-9.542 7" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
            </svg>
          </button>
        </div>
        <ErrorMessage name="password" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Confirm Password Field -->
    <div>
      <Field name="confirmPassword" v-slot="{ field }" class="space-y-0.5">
        <label class="block text-xs font-medium text-gray-900">Confirm Password</label>
        <div class="relative">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-bind="field"
            class="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-xs"
            placeholder="••••••••"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            <!-- Eye Icon (Open) -->
            <svg v-if="showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <!-- Eye Icon (Closed) -->
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.391m5.005-2.905A9.005 9.005 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.006 10.006 0 01-9.542 7" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
            </svg>
          </button>
        </div>
        <ErrorMessage name="confirmPassword" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Error Message -->
    <div v-if="authStore.error" class="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
      {{ authStore.error }}
    </div>

    <!-- Terms Agreement -->
    <label class="flex items-start gap-2 cursor-pointer text-xs">
      <input type="checkbox" class="w-3 h-3 rounded border-2 border-gray-400 cursor-pointer appearance-none checked:bg-black checked:border-black transition-all mt-0.5" style="accent-color: black;" />
      <span class="text-gray-700">
        I agree to the
        <a href="#" class="font-medium text-black hover:text-gray-700">Terms of Service</a>
        and
        <a href="#" class="font-medium text-black hover:text-gray-700">Privacy Policy</a>
      </span>
    </label>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="authStore.isLoading"
      class="w-full px-3 py-1.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
    </button>
  </Form>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { signupValidationSchema } from '../../utils/validationSchemas'
import { useAuthStore } from '../../../../stores/auth.store'
import { useLandingStore } from '../../stores/landing.store'

import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const landingStore = useLandingStore()
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)

const onSubmit = async (values: Record<string, any>) => {
  // Prevent multiple submissions
  if (isSubmitting.value || authStore.isLoading) {
    console.warn('Submission already in progress')
    return
  }
  
  isSubmitting.value = true
  try {
    const { name, email, password } = values as {
      name: string
      email: string
      password: string
      confirmPassword: string
    }
    
    // Perform registration
    await authStore.register(email, password, name)
    console.log('Sign up berhasil!')
    
    // Close modal setelah sign up berhasil
    landingStore.closeAuthModal()
    
    // Add delay to ensure state update before redirect
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // Redirect ke home page setelah sign up
    try {
      await router.push({ name: 'home' })
    } catch (routeError) {
      console.error('Router error:', routeError)
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Sign up error:', error)
    // Store error is already set in auth.store, modal stays open for retry
    // Error message will be displayed in the form
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
input[type="checkbox"] {
  cursor: pointer;
  accent-color: black;
}

input[type="checkbox"]:checked {
  background-color: black !important;
  border-color: black !important;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="white" d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>') !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: 85% 85% !important;
}
</style>
