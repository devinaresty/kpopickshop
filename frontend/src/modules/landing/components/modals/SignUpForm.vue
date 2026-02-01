<template>
  <Form :validation-schema="signupValidationSchema" @submit="onSubmit" class="space-y-2.5 sm:space-y-3">
    <!-- Full Name Field -->
    <div>
      <Field name="fullName" as="div" class="space-y-1">
        <label class="block text-xs sm:text-sm font-medium text-gray-900">Full Name</label>
        <input
          type="text"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-sm sm:text-base"
          placeholder="John Doe"
        />
        <ErrorMessage name="fullName" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Email Field -->
    <div>
      <Field name="email" as="div" class="space-y-1">
        <label class="block text-xs sm:text-sm font-medium text-gray-900">Email Address</label>
        <input
          type="email"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-sm sm:text-base"
          placeholder="name@example.com"
        />
        <ErrorMessage name="email" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Password Field -->
    <div>
      <Field name="password" as="div" class="space-y-1">
        <label class="block text-xs sm:text-sm font-medium text-gray-900">Password</label>
        <input
          type="password"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-sm sm:text-base"
          placeholder="••••••••"
        />
        <ErrorMessage name="password" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Confirm Password Field -->
    <div>
      <Field name="confirmPassword" as="div" class="space-y-1">
        <label class="block text-xs sm:text-sm font-medium text-gray-900">Confirm Password</label>
        <input
          type="password"
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all text-sm sm:text-base"
          placeholder="••••••••"
        />
        <ErrorMessage name="confirmPassword" class="text-xs text-red-500" />
      </Field>
    </div>

    <!-- Terms Agreement -->
    <label class="flex items-start gap-2 cursor-pointer text-xs sm:text-sm">
      <input type="checkbox" class="w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300 mt-1" />
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
      class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base"
    >
      Create Account
    </button>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import { signupValidationSchema } from '../../utils/validationSchemas'

const onSubmit = async (values: any) => {
  try {
    // TODO: Call register API
    console.log('Sign up attempt:', values)
  } catch (error) {
    console.error('Sign up error:', error)
  }
}
</script>
