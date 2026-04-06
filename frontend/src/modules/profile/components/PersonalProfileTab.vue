<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <div class="flex justify-between items-center p-6 border-b border-gray-200">
      <h3 class="text-xl font-bold text-black">{{ i18nStore.t('personalProfile.title') }}</h3>
      <button
        @click="isEditing = !isEditing"
        class="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
      >
        {{ isEditing ? i18nStore.t('common.cancel') : i18nStore.t('common.edit') }}
      </button>
    </div>

    <div class="p-6">
      <template v-if="!isEditing">
        <div class="grid grid-cols-2 gap-8">
          <div class="flex flex-col items-center">
            <div class="w-40 h-40 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center overflow-hidden mb-6 shadow-md border-4 border-gray-100">
              <img v-if="profile?.photoUrl" :src="profile.photoUrl" :alt="profile.name" class="w-full h-full object-cover">
              <svg v-else class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="w-full">
              <label class="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  @change="handlePhotoUpload"
                  class="hidden"
                  :disabled="isUploadingPhoto"
                />
                <div class="w-full px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'opacity-50 cursor-not-allowed': isUploadingPhoto }">
                  {{ isUploadingPhoto ? i18nStore.t('personalProfile.uploading') : i18nStore.t('personalProfile.choosePhoto') }}
                </div>
              </label>
            </div>

            <p class="text-xs text-gray-600 mt-4 text-center">
              {{ i18nStore.t('personalProfile.fileSizeInfo') }}
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('personalProfile.fullName') }}</label>
              <div class="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
                {{ profile?.name }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('personalProfile.dateOfBirth') }}</label>
              <div class="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
                {{ profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('id-ID') : '-' }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('common.email') }}</label>
              <div class="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
                {{ profile?.email }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('personalProfile.phoneNumber') }}</label>
              <div class="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium">
                {{ profile?.phone || '-' }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="grid grid-cols-2 gap-8">
          <div class="flex flex-col items-center">
            <div class="relative w-40 h-40 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center overflow-hidden mb-6 shadow-md border-4 border-gray-100 group cursor-pointer">
              <img v-if="formData.photoPreview || profile?.photoUrl" :src="formData.photoPreview || profile?.photoUrl" :alt="profile?.name" class="w-full h-full object-cover">
              <svg v-else class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              
              <button
                v-if="formData.photoPreview"
                @click.stop="deletePhoto"
                type="button"
                class="absolute inset-0 w-full h-full bg-gray-800 bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Remove photo"
              >
                <span class="text-white font-semibold text-sm">{{ i18nStore.t('personalProfile.removePhoto') }}</span>
              </button>
            </div>

            <div class="w-full">
              <label class="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  @change="handlePhotoUpload"
                  class="hidden"
                  :disabled="isUploadingPhoto"
                />
                <div class="w-full px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'opacity-50 cursor-not-allowed': isUploadingPhoto }">
                  {{ isUploadingPhoto ? 'Uploading...' : '+ Choose Photo' }}
                </div>
              </label>
            </div>

            <p class="text-xs text-gray-600 mt-4 text-center">
              Besar file: maksimum 10.000.000 bytes (10 Megabytes). Ekstensi file yang diperbolehkan: JPG, JPEG, PNG
            </p>
          </div>
>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('personalProfile.fullName') }} <span class="text-red-500">*</span></label>
              <input
                v-model="formData.name"
                type="text"
                :placeholder="i18nStore.t('personalProfile.fullName')"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('personalProfile.dateOfBirth') }}</label>
              <input
                v-model="formData.dateOfBirth"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('common.email') }}</label>
              <input
                v-model="formData.email"
                type="email"
                :placeholder="i18nStore.t('common.email')"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ i18nStore.t('personalProfile.phoneNumber') }}</label>
              <input
                v-model="formData.phone"
                type="text"
                :placeholder="i18nStore.t('personalProfile.phoneNumber')"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ error }}
          </div>
          <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {{ successMessage }}
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            @click="saveProfile"
            :disabled="isSaving"
            class="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? i18nStore.t('personalProfile.saving') : i18nStore.t('personalProfile.saveChanges') }}
          </button>
          <button
            @click="isEditing = false"
            class="px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            {{ i18nStore.t('common.cancel') }}
          </button>
        </div>
      </template>
    </div>
  </div>

  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
      <h3 class="text-lg font-bold text-gray-900 mb-2">{{ i18nStore.t('personalProfile.deletePhotoConfirmTitle') }}</h3>
      <p class="text-gray-600 mb-6">{{ i18nStore.t('personalProfile.deletePhotoConfirm') }}</p>
      <div class="flex gap-3">
        <button
          @click="showDeleteConfirm = false"
          class="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          {{ i18nStore.t('common.cancel') }}
        </button>
        <button
          @click="confirmDeletePhoto"
          class="flex-1 px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
        >
          {{ i18nStore.t('personalProfile.deletePhoto') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useProfileStore, useI18nStore } from '@/shared/stores'
import type { UserProfile, ProfileFormData } from '@/modules/profile/types'

const profileStore = useProfileStore()
const i18nStore = useI18nStore()

const props = defineProps<{
  profile: UserProfile | null
  isSaving: boolean
  error: string | null
  successMessage: string | null
}>()

const emit = defineEmits<{
  save: [data: ProfileFormData & { photoUrl?: string; email?: string }]
}>()

const isEditing = ref(false)
const isUploadingPhoto = ref(false)
const showDeleteConfirm = ref(false)

const formData = reactive({
  name: props.profile?.name || '',
  email: props.profile?.email || '',
  phone: props.profile?.phone || '',
  dateOfBirth: props.profile?.dateOfBirth || '',
  photoPreview: props.profile?.photoUrl || '',
})

watch(() => props.successMessage, (newVal) => {
  if (newVal) {
    isEditing.value = false
  }
})

const handlePhotoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    alert(i18nStore.t('personalProfile.fileTooLarge'))
    return
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    alert(i18nStore.t('personalProfile.invalidFileFormat'))
    return
  }

  isUploadingPhoto.value = true

  try {
    await new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.photoPreview = e.target?.result as string
        resolve()
      }
      reader.readAsDataURL(file)
    })

    console.log('Photo preview created, uploading to server...')

    const response = await profileStore.uploadProfilePhoto(file)
    
    if (response && response.photoUrl) {
      console.log('Photo uploaded successfully:', response.photoUrl)
      formData.photoPreview = response.photoUrl
    } else {
      console.warn('Upload response missing photoUrl:', response)
      throw new Error('Server response tidak mengandung photoUrl')
    }
  } catch (err: any) {
    console.error('Photo upload error:', err)
    alert(i18nStore.t('personalProfile.failedUpload') + ': ' + (err.message || 'Unknown error'))
  } finally {
    isUploadingPhoto.value = false
  }
}

const deletePhoto = () => {
  showDeleteConfirm.value = true
}

const confirmDeletePhoto = async () => {
  showDeleteConfirm.value = false
  
  try {
    await profileStore.deleteProfilePhoto()
    formData.photoPreview = null as any
  } catch (err: any) {
    console.error('Delete photo error:', err)
    alert(i18nStore.t('personalProfile.failedDelete') + ': ' + (err.message || 'Unknown error'))
  }
}

const saveProfile = () => {
  if (!formData.name.trim()) {
    alert(i18nStore.t('personalProfile.nameRequired'))
    return
  }

  if (!formData.email.trim()) {
    alert(i18nStore.t('personalProfile.emailRequired'))
    return
  }

  const photoUrl = formData.photoPreview ? formData.photoPreview : undefined

  emit('save', {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: '', 
    dateOfBirth: formData.dateOfBirth,
    photoUrl: photoUrl,
  })
  
  isEditing.value = false
}
</script>
