<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          First Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.firstName"
          type="text"
          placeholder="John"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
          @blur="validateField"
        />
        <span v-if="checkoutStore.errors['firstName']" class="text-sm text-red-500 mt-1 block">
          {{ checkoutStore.errors['firstName'] }}
        </span>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Last Name
        </label>
        <input
          v-model="form.lastName"
          type="text"
          placeholder="Doe"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
          @blur="validateField"
        />
        <span v-if="checkoutStore.errors['lastName']" class="text-sm text-red-500 mt-1 block">
          {{ checkoutStore.errors['lastName'] }}
        </span>
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Email <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        placeholder="john@example.com"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
        @blur="validateField"
      />
      <span v-if="checkoutStore.errors['email']" class="text-sm text-red-500 mt-1 block">
        {{ checkoutStore.errors['email'] }}
      </span>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Phone Number <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.phone"
        type="tel"
        placeholder="+62 812-3456-7890"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
        @blur="validateField"
      />
      <span v-if="checkoutStore.errors['phone']" class="text-sm text-red-500 mt-1 block">
        {{ checkoutStore.errors['phone'] }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCheckoutStore } from '@/shared/stores'

const checkoutStore = useCheckoutStore()

const form = ref({
  firstName: checkoutStore.consumer.firstName,
  lastName: checkoutStore.consumer.lastName,
  email: checkoutStore.consumer.email,
  phone: checkoutStore.consumer.phone,
})

watch(
  form,
  (newForm) => {
    checkoutStore.setConsumerInfo(newForm)
  },
  { deep: true }
)

const validateField = () => {
}
</script>
