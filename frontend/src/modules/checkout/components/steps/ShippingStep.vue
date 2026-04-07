<template>
  <div class="space-y-6">
    <div v-if="savedAddresses.length > 0" class="space-y-4">
      <h3 class="text-lg font-bold text-gray-900">{{ i18nStore.t('checkout.selectShippingAddress') }}</h3>
      
      <div v-if="!selectedAddress" class="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <button
          v-for="addr in savedAddresses"
          :key="addr.id"
          @click="selectAddress(addr)"
          type="button"
          class="w-full text-left p-4 border-2 border-gray-300 rounded-lg transition hover:border-black"
        >
          <div class="font-semibold text-gray-900">{{ addr.fullName }}</div>
          <div class="text-sm text-gray-600 mt-1">{{ addr.address }}</div>
          <div class="text-sm text-gray-600">{{ addr.phone }}</div>
          <span v-if="addr.isDefault" class="inline-block text-xs mt-2 px-2 py-1 bg-gray-200 text-gray-900 rounded">Default</span>
        </button>
      </div>

      <div v-if="selectedAddress" class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-600 mb-1">Recipient</p>
            <p class="text-gray-900 font-semibold mb-3">{{ selectedAddress.fullName }}</p>
            
            <p class="text-sm font-semibold text-gray-600 mb-1">Address</p>
            <p class="text-gray-900 mb-3">{{ selectedAddress.address }}</p>

            <p class="text-sm font-semibold text-gray-600 mb-1">Phone</p>
            <p class="text-gray-900">{{ selectedAddress.phone }}</p>
          </div>

          <button
            @click="selectedAddress = null"
            type="button"
            class="px-4 py-2 text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition whitespace-nowrap ml-4"
          >
            Change
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <p class="text-gray-900 font-semibold mb-2">No Addresses Found</p>
      <p class="text-gray-600 mb-4">Please add an address in your profile first</p>
      <a
        href="/profile"
        class="inline-block px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
      >
        Go to Profile
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCheckoutStore, useI18nStore } from '@/shared/stores'
import { apiClient } from '@/core/api'

interface Address {
  id: number
  userId?: number
  fullName: string
  address: string
  phone: string
  detail?: string
  latitude?: number
  longitude?: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

const checkoutStore = useCheckoutStore()
const i18nStore = useI18nStore()
const savedAddresses = ref<Address[]>([])
const selectedAddress = ref<Address | null>(null)

const loadAddresses = async () => {
  try {
    const addresses = await apiClient.getAddresses()
    savedAddresses.value = addresses
    
    const defaultAddr = addresses.find(a => a.isDefault)
    if (defaultAddr) {
      selectAddress(defaultAddr)
    }
  } catch (err) {
    console.error('Failed to load addresses:', err)
  }
}

const selectAddress = (addr: Address) => {
  selectedAddress.value = addr
  
  checkoutStore.setShippingInfo({
    address: `${addr.fullName}, ${addr.address}`,
    city: '',
    province: '',
    postalCode: '',
  })
}

onMounted(() => {
  loadAddresses()
})
</script>
