<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <h2 class="text-2xl font-bold text-black mb-6">Edit Profile</h2>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-sm text-green-700">{{ successMessage }}</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Full Name -->
      <div>
        <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
          Full Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Enter your full name"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
          required
        />
      </div>

      <!-- Email (Read-only) -->
      <div>
        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          :value="profile?.email || ''"
          type="email"
          disabled
          placeholder="Email"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
        />
        <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </div>

      <!-- Phone Number -->
      <div>
        <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          placeholder="Enter your phone number"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
        />
      </div>

      <!-- Address -->
      <div>
        <label for="address" class="block text-sm font-semibold text-gray-700 mb-2">
          Address
        </label>
        <textarea
          id="address"
          v-model="form.address"
          placeholder="Enter your address"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="handleCancel"
          class="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSaving"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="ml-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="isSaving"
        >
          <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UserProfile, ProfileFormData } from '@/modules/profile/types'

interface Props {
  profile: UserProfile | null
  isSaving: boolean
  error: string | null
  successMessage: string | null
}

interface Emits {
  (e: 'save', data: ProfileFormData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref<ProfileFormData>({
  name: '',
  phone: '',
  address: '',
})

// Sync form with profile data
watch(
  () => props.profile,
  (newProfile) => {
    if (newProfile) {
      form.value = {
        name: newProfile.name || '',
        phone: newProfile.phone || '',
        address: newProfile.address || '',
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.name.trim()) {
    return
  }
  emit('save', form.value)
}

const handleCancel = () => {
  // Reset form to current profile
  if (props.profile) {
    form.value = {
      name: props.profile.name || '',
      phone: props.profile.phone || '',
      address: props.profile.address || '',
    }
  }
  emit('cancel')
}
</script>
