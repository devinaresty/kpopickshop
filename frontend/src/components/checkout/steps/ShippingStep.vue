<template>
  <div class="space-y-6">
    <!-- Address -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Street Address <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.address"
        type="text"
        placeholder="Jl. Blabla no. 123"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
        @blur="validateField"
      />
      <span v-if="checkoutStore.errors['address']" class="text-sm text-red-500 mt-1 block">
        {{ checkoutStore.errors['address'] }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- City -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          City <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.city"
          type="text"
          placeholder="Jakarta"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
          @blur="validateField"
        />
        <span v-if="checkoutStore.errors['city']" class="text-sm text-red-500 mt-1 block">
          {{ checkoutStore.errors['city'] }}
        </span>
      </div>

      <!-- Province -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Province <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.province"
          type="text"
          placeholder="DKI Jakarta"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
          @blur="validateField"
        />
        <span v-if="checkoutStore.errors['province']" class="text-sm text-red-500 mt-1 block">
          {{ checkoutStore.errors['province'] }}
        </span>
      </div>

      <!-- Postal Code -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Postal Code <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.postalCode"
          type="text"
          placeholder="12345"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
          @blur="validateField"
        />
        <span v-if="checkoutStore.errors['postalCode']" class="text-sm text-red-500 mt-1 block">
          {{ checkoutStore.errors['postalCode'] }}
        </span>
      </div>
    </div>

    <!-- Country -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">Country</label>
      <input
        v-model="form.country"
        type="text"
        disabled
        class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCheckoutStore } from '@/stores/checkout.store'

const checkoutStore = useCheckoutStore()

const form = ref({
  address: checkoutStore.shipping.address,
  city: checkoutStore.shipping.city,
  province: checkoutStore.shipping.province,
  postalCode: checkoutStore.shipping.postalCode,
  country: checkoutStore.shipping.country,
})

watch(
  form,
  (newForm) => {
    checkoutStore.setShippingInfo(newForm)
  },
  { deep: true }
)

const validateField = () => {
  // Individual field validation if needed
}
</script>
