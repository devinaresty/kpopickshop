<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-center p-6 border-b border-gray-200">
      <h3 class="text-xl font-bold text-black">{{ i18nStore.t('address.title') }}</h3>
      <button
        @click="showAddForm = !showAddForm"
        class="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
      >
        + {{ showAddForm ? i18nStore.t('common.cancel') : i18nStore.t('address.addNewAddress') }}
      </button>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Add Form -->
      <div v-if="showAddForm" class="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 class="text-lg font-bold text-black mb-4">{{ i18nStore.t('address.formTitle') }}</h4>
        <form @submit.prevent="addNewAddress" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.streetAddress') }} <span class="text-red-500">*</span></label>
              <input
                v-model="newAddress.street"
                type="text"
                placeholder="Enter street address"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.city') }} <span class="text-red-500">*</span></label>
              <input
                v-model="newAddress.city"
                type="text"
                placeholder="Enter city"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.province') }} <span class="text-red-500">*</span></label>
              <input
                v-model="newAddress.province"
                type="text"
                placeholder="Enter province"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.postalCode') }} <span class="text-red-500">*</span></label>
              <input
                v-model="newAddress.postalCode"
                type="text"
                placeholder="Enter postal code"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.phoneNumber') }} <span class="text-red-500">*</span></label>
              <input
                v-model="newAddress.phone"
                type="text"
                placeholder="Enter phone number"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
            <div class="col-span-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="newAddress.isDefault"
                  type="checkbox"
                  class="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <span class="text-sm font-medium text-gray-700">{{ i18nStore.t('address.setDefault') }}</span>
              </label>
            </div>
          </div>

          <div v-if="addressError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ addressError }}
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="isAddingAddress"
              class="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isAddingAddress ? i18nStore.t('address.adding') : i18nStore.t('address.addButton') }}
            </button>
            <button
              type="button"
              @click="showAddForm = false"
              class="px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              {{ i18nStore.t('common.cancel') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Address List -->
      <div v-if="addressList.length === 0 && !showAddForm" class="text-center py-8">
        <p class="text-gray-600">{{ i18nStore.t('common.empty') }}</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="address in addressList" :key="address.id" class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <!-- Header with default badge and edit button -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex gap-2 items-center">
              <span v-if="address.isDefault" class="px-3 py-1 bg-gray-300 text-gray-900 text-xs font-semibold rounded">
                {{ i18nStore.t('address.setDefault') }}
              </span>
            </div>
            <button
              @click="editAddress(address)"
              class="px-4 py-2 text-sm bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
            >
              {{ i18nStore.t('common.edit') }}
            </button>
          </div>

          <!-- Address Details -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.streetAddress') }}</p>
              <p class="text-gray-900 font-medium">{{ address.street }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.city') }}</p>
              <p class="text-gray-900 font-medium">{{ address.city }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.province') }}</p>
              <p class="text-gray-900 font-medium">{{ address.province }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.postalCode') }}</p>
              <p class="text-gray-900 font-medium">{{ address.postalCode }}</p>
            </div>
          </div>

          <!-- Phone -->
          <div class="border-t border-gray-300 pt-3">
            <p class="text-sm text-gray-600">{{ address.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18nStore } from '@/stores/i18n.store'
import type { UserAddress } from '@/modules/profile/types'

const i18nStore = useI18nStore()

const props = defineProps<{
  addresses?: UserAddress[]
}>()

const showAddForm = ref(false)
const isAddingAddress = ref(false)
const addressError = ref<string | null>(null)

const addressList = ref<UserAddress[]>(props.addresses || [])

const newAddress = reactive({
  street: '',
  city: '',
  province: '',
  postalCode: '',
  phone: '',
  isDefault: false,
})

const addNewAddress = async () => {
  isAddingAddress.value = true
  addressError.value = null

  try {
    // TODO: Call API to save address
    // For now just clear the form
    Object.assign(newAddress, {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      isDefault: false,
    })
    showAddForm.value = false
    alert(i18nStore.t('address.successAdded'))
  } catch (err: any) {
    addressError.value = err.message || i18nStore.t('address.failedAdded')
  } finally {
    isAddingAddress.value = false
  }
}

const editAddress = (_address: UserAddress) => {
  // TODO: Implement edit functionality
  alert('Edit feature coming soon')
}
</script>
