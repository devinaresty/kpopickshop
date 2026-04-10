<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div class="flex justify-between items-center px-8 py-7 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <h3 class="text-2xl font-bold text-gray-900">{{ i18nStore.t('personalProfile.title') }}</h3>
      <button
        @click="isEditing = !isEditing"
        class="px-5 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-150 shadow-sm"
      >
        {{ isEditing ? i18nStore.t('common.cancel') : i18nStore.t('common.edit') }}
      </button>
    </div>

    <div class="px-6 py-6">
      <template v-if="!isEditing">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex flex-col items-center">
            <div class="w-48 h-48 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center overflow-hidden mb-8 shadow-lg border-4 border-white hover:shadow-xl transition-shadow">
              <img v-if="profile?.photoUrl" :src="profile.photoUrl" :alt="profile.name" class="w-full h-full object-cover">
              <svg v-else class="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="w-full space-y-3">
              <label class="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  @change="handlePhotoUpload"
                  class="hidden"
                  :disabled="isUploadingPhoto"
                />
                <div class="w-full px-5 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-150 cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  :class="{ 'opacity-50 cursor-not-allowed': isUploadingPhoto }">
                  {{ isUploadingPhoto ? i18nStore.t('personalProfile.uploading') : i18nStore.t('personalProfile.choosePhoto') }}
                </div>
              </label>
            </div>

            <p class="text-xs text-gray-500 mt-5 text-center leading-relaxed">
              {{ i18nStore.t('personalProfile.fileSizeInfo') }}
            </p>
          </div>

          <div class="space-y-3">
            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{{ i18nStore.t('personalProfile.fullName') }}</label>
              <div class="text-base font-semibold text-gray-900">
                {{ profile?.name }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{{ i18nStore.t('personalProfile.dateOfBirth') }}</label>
              <div class="text-base font-semibold text-gray-900">
                {{ profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('id-ID') : '-' }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{{ i18nStore.t('common.email') }}</label>
              <div class="text-base font-semibold text-gray-900">
                {{ profile?.email }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{{ i18nStore.t('personalProfile.phoneNumber') }}</label>
              <div class="text-base font-semibold text-gray-900">
                {{ profile?.phone || '-' }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center overflow-hidden mb-8 shadow-lg border-4 border-white hover:shadow-xl transition-all group cursor-pointer">
              <img v-if="formData.photoPreview || profile?.photoUrl" :src="formData.photoPreview || profile?.photoUrl" :alt="profile?.name" class="w-full h-full object-cover">
              <svg v-else class="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              
              <button
                v-if="formData.photoPreview"
                @click.stop="deletePhoto"
                type="button"
                class="absolute inset-0 w-full h-full bg-gray-900 bg-opacity-70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Remove photo"
              >
                <span class="text-white font-semibold text-sm">{{ i18nStore.t('personalProfile.removePhoto') }}</span>
              </button>
            </div>

            <div class="w-full space-y-3">
              <label class="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  @change="handlePhotoUpload"
                  class="hidden"
                  :disabled="isUploadingPhoto"
                />
                <div class="w-full px-5 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-150 cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  :class="{ 'opacity-50 cursor-not-allowed': isUploadingPhoto }">
                  {{ isUploadingPhoto ? i18nStore.t('personalProfile.uploading') : i18nStore.t('personalProfile.choosePhoto') }}
                </div>
              </label>
            </div>

            <p class="text-xs text-gray-500 mt-5 text-center leading-relaxed">
              {{ i18nStore.t('personalProfile.fileSizeInfo') }}
            </p>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{{ i18nStore.t('personalProfile.fullName') }} <span class="text-red-500">*</span></label>
              <input
                v-model="formData.name"
                type="text"
                :placeholder="i18nStore.t('personalProfile.fullName')"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{{ i18nStore.t('personalProfile.dateOfBirth') }}</label>
              <input
                v-model="formData.dateOfBirth"
                type="date"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{{ i18nStore.t('common.email') }}</label>
              <input
                v-model="formData.email"
                type="email"
                :placeholder="i18nStore.t('common.email')"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{{ i18nStore.t('personalProfile.phoneNumber') }}</label>
              <input
                v-model="formData.phone"
                type="text"
                :placeholder="i18nStore.t('personalProfile.phoneNumber')"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            {{ error }}
          </div>
          <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
            {{ successMessage }}
          </div>
        </div>

        <div class="mt-6">
          <button
            @click="saveProfile"
            :disabled="isSaving"
            class="w-full px-5 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {{ isSaving ? i18nStore.t('personalProfile.saving') : i18nStore.t('personalProfile.saveChanges') }}
          </button>
        </div>
      </template>
    </div>
  </div>

  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full">
      <h3 class="text-xl font-bold text-gray-900 mb-3">{{ i18nStore.t('personalProfile.deletePhotoConfirmTitle') }}</h3>
      <p class="text-gray-600 text-sm mb-8 leading-relaxed">{{ i18nStore.t('personalProfile.deletePhotoConfirm') }}</p>
      <div class="flex gap-3">
        <button
          @click="showDeleteConfirm = false"
          class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-150"
        >
          {{ i18nStore.t('common.cancel') }}
        </button>
        <button
          @click="confirmDeletePhoto"
          class="flex-1 px-4 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-150 shadow-sm"
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
