<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <div class="flex justify-between items-center p-6 border-b border-gray-200">
      <h3 class="text-xl font-bold text-black">{{ i18nStore.t('address.title') }}</h3>
      <button
        v-if="!editingAddressId"
        @click="showAddForm = !showAddForm"
        class="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
      >
        + {{ i18nStore.t('address.addNewAddress') }}
      </button>
    </div>

    <div class="p-6">
      <!-- Add New Address Form -->
      <div v-if="showAddForm" class="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 class="text-lg font-bold text-black mb-4">{{ i18nStore.t('address.formTitle') }}</h4>
        <form @submit.prevent="addNewAddress" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.recipientName') }} <span class="text-red-500">*</span></label>
            <input
              v-model="newAddress.fullName"
              type="text"
              placeholder="Enter recipient name"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.address') }} <span class="text-red-500">*</span></label>
            <textarea
              v-model="newAddress.address"
              placeholder="Enter full address"
              rows="3"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.phoneNumber') }} <span class="text-red-500">*</span></label>
            <input
              v-model="newAddress.phone"
              type="text"
              placeholder="Enter phone number"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.detail') }} (Optional)</label>
            <textarea
              v-model="newAddress.detail"
              placeholder="Additional details"
              rows="2"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            ></textarea>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input
                v-model="newAddress.isDefault"
                type="checkbox"
                class="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-black"
              />
              <span class="text-sm font-medium text-gray-700">{{ i18nStore.t('address.setDefault') }}</span>
            </label>
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
              class="px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-black transition"
            >
              {{ i18nStore.t('common.cancel') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Empty State -->
      <div v-if="addressList.length === 0 && !showAddForm" class="text-center py-8">
        <p class="text-gray-600">{{ i18nStore.t('common.empty') }}</p>
      </div>

      <!-- Address List -->
      <div v-else class="space-y-4">
        <div 
          v-for="address in addressList" 
          :key="address.id" 
          class="border border-gray-200 rounded-lg p-6 transition"
          :class="editingAddressId === address.id ? 'bg-gray-50 border-gray-300' : 'bg-white hover:bg-gray-50'"
        >
          <!-- View Mode -->
          <div v-if="editingAddressId !== address.id">
            <div class="flex justify-between items-start mb-4">
              <div class="flex gap-2 items-center">
                <span v-if="address.isDefault" class="px-3 py-1 bg-gray-300 text-gray-900 text-xs font-semibold rounded">
                  {{ i18nStore.t('address.setDefault') }}
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="startEdit(address)"
                  class="px-4 py-2 text-sm bg-gray-500 text-white font-semibold rounded-lg hover:bg-black transition"
                >
                  {{ i18nStore.t('common.edit') }}
                </button>
                <button
                  @click="deleteAddress(address.id)"
                  class="px-4 py-2 text-sm bg-gray-500 text-white font-semibold rounded-lg hover:bg-black transition"
                >
                  {{ i18nStore.t('common.delete') }}
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.recipientName') }}</p>
                <p class="text-gray-900 font-medium">{{ address.fullName }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.address') }}</p>
                <p class="text-gray-900">{{ address.address }}</p>
              </div>
              <div v-if="address.detail">
                <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.detail') }}</p>
                <p class="text-gray-900">{{ address.detail }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-600 mb-1">{{ i18nStore.t('address.phoneNumber') }}</p>
                <p class="text-gray-900">{{ address.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="space-y-4">
            <h4 class="text-lg font-bold text-black mb-4">{{ i18nStore.t('common.edit') }} {{ i18nStore.t('address.title') }}</h4>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.recipientName') }} <span class="text-red-500">*</span></label>
              <input
                v-model="editingAddress.fullName"
                type="text"
                placeholder="Enter recipient name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.address') }} <span class="text-red-500">*</span></label>
              <textarea
                v-model="editingAddress.address"
                placeholder="Enter full address"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.phoneNumber') }} <span class="text-red-500">*</span></label>
              <input
                v-model="editingAddress.phone"
                type="text"
                placeholder="Enter phone number"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('address.detail') }} (Optional)</label>
              <textarea
                v-model="editingAddress.detail"
                placeholder="Additional details"
                rows="2"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              ></textarea>
            </div>
            <div>
              <label class="flex items-center gap-2">
                <input
                  v-model="editingAddress.isDefault"
                  type="checkbox"
                  class="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <span class="text-sm font-medium text-gray-700">{{ i18nStore.t('address.setDefault') }}</span>
              </label>
            </div>

            <div v-if="addressError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {{ addressError }}
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="saveEdit"
                :disabled="isAddingAddress"
                class="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isAddingAddress ? i18nStore.t('address.updating') : i18nStore.t('common.save') }}
              </button>
              <button
                @click="cancelEdit"
                type="button"
                class="px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-black transition"
              >
                {{ i18nStore.t('common.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18nStore } from '@/stores/i18n.store'
import { apiClient } from '@/lib/api'
import type { UserAddress } from '@/modules/profile/types'

const i18nStore = useI18nStore()

const props = defineProps<{
  addresses?: UserAddress[]
}>()

const emit = defineEmits<{
  'address-added': []
}>()

const showAddForm = ref(false)
const isAddingAddress = ref(false)
const addressError = ref<string | null>(null)
const editingAddressId = ref<number | null>(null)

const addressList = ref<UserAddress[]>(props.addresses || [])

watch(() => props.addresses, (newAddresses) => {
  if (newAddresses) {
    addressList.value = newAddresses
  }
})

const newAddress = reactive({
  fullName: '',
  address: '',
  phone: '',
  detail: '',
  isDefault: false,
})

const editingAddress = reactive({
  fullName: '',
  address: '',
  phone: '',
  detail: '',
  isDefault: false,
})

const addNewAddress = async () => {
  isAddingAddress.value = true
  addressError.value = null

  try {
    if (!newAddress.fullName.trim() || !newAddress.address.trim() || !newAddress.phone.trim()) {
      throw new Error('Please fill in all required fields')
    }

    const result = await apiClient.createAddress({
      fullName: newAddress.fullName,
      address: newAddress.address,
      phone: newAddress.phone,
      detail: newAddress.detail || undefined,
      isDefault: newAddress.isDefault,
    })

    addressList.value.unshift(result)

    Object.assign(newAddress, {
      fullName: '',
      address: '',
      phone: '',
      detail: '',
      isDefault: false,
    })
    showAddForm.value = false
    emit('address-added')
  } catch (err: any) {
    addressError.value = err.message || i18nStore.t('address.failedAdded')
    console.error('Failed to add address:', err)
  } finally {
    isAddingAddress.value = false
  }
}

const startEdit = (address: UserAddress) => {
  editingAddressId.value = address.id
  editingAddress.fullName = address.fullName
  editingAddress.address = address.address
  editingAddress.phone = address.phone
  editingAddress.detail = address.detail || ''
  editingAddress.isDefault = address.isDefault
  addressError.value = null
}

const saveEdit = async () => {
  isAddingAddress.value = true
  addressError.value = null

  try {
    if (!editingAddress.fullName.trim() || !editingAddress.address.trim() || !editingAddress.phone.trim()) {
      throw new Error('Please fill in all required fields')
    }

    const result = await apiClient.updateAddress(editingAddressId.value!, {
      fullName: editingAddress.fullName,
      address: editingAddress.address,
      phone: editingAddress.phone,
      detail: editingAddress.detail || undefined,
      isDefault: editingAddress.isDefault,
    })

    const index = addressList.value.findIndex(a => a.id === editingAddressId.value)
    if (index !== -1) {
      addressList.value[index] = result
    }

    cancelEdit()
    emit('address-added')
  } catch (err: any) {
    addressError.value = err.message || 'Failed to update address'
    console.error('Failed to update address:', err)
  } finally {
    isAddingAddress.value = false
  }
}

const cancelEdit = () => {
  editingAddressId.value = null
  Object.assign(editingAddress, {
    fullName: '',
    address: '',
    phone: '',
    detail: '',
    isDefault: false,
  })
  addressError.value = null
}

const deleteAddress = async (id: number) => {
  if (confirm('Are you sure you want to delete this address?')) {
    try {
      await apiClient.deleteAddress(id)
      addressList.value = addressList.value.filter(a => a.id !== id)
    } catch (err: any) {
      console.error('Failed to delete address:', err)
      alert('Failed to delete address')
    }
  }
}
</script>
