import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/core/api'
import { useAuthStore } from './auth.store'
import type { UserProfile, UpdateProfileDto } from '@/modules/profile/types'

export const useProfileStore = defineStore('profile', () => {
  const authStore = useAuthStore()
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isUploadingPhoto = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const isProfileComplete = computed(() => {
    return profile.value && profile.value.name && profile.value.email
  })

  const loadProfile = async () => {
    isLoading.value = true
    error.value = null
    try {
      const userData = await apiClient.getCurrentUser()
      profile.value = userData
    } catch (err: any) {
      error.value = err.message || 'Failed to load profile'
      console.error('Load profile error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: UpdateProfileDto & { photoUrl?: string }) => {
    isSaving.value = true
    error.value = null
    successMessage.value = null
    try {
      if (profile.value) {
        profile.value.name = data.name || profile.value.name
        profile.value.email = data.email || profile.value.email
        profile.value.phone = data.phone || profile.value.phone
        profile.value.address = data.address || profile.value.address
        profile.value.dateOfBirth = data.dateOfBirth || profile.value.dateOfBirth
        if (data.photoUrl !== undefined) {
          profile.value.photoUrl = data.photoUrl || undefined
        }
      }
      
      if (authStore.user && profile.value) {
        authStore.user.name = profile.value.name
        authStore.user.email = profile.value.email
        authStore.user.phone = profile.value.phone
        authStore.user.photoUrl = profile.value.photoUrl
      }
      
      successMessage.value = 'Profile updated successfully'
    } catch (err: any) {
      error.value = err.message || 'Failed to update profile'
      console.error('Update profile error:', err)
    } finally {
      isSaving.value = false
    }
  }

  const uploadProfilePhoto = async (file: File) => {
    isUploadingPhoto.value = true
    error.value = null
    successMessage.value = null
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('ADMIN_TOKEN') || localStorage.getItem('USER_TOKEN')
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
      const url = `${baseUrl}/auth/upload-profile-photo`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result && (result.photoUrl || result.data?.photoUrl)) {
        const photoUrl = result.photoUrl || result.data?.photoUrl
        
        if (profile.value) {
          profile.value.photoUrl = photoUrl
        }
        
        if (authStore.user) {
          (authStore.user as any).photoUrl = photoUrl
        }

        successMessage.value = 'Profile photo uploaded successfully'
        console.log('Profile photo uploaded:', photoUrl)
        
        return result.data || result
      } else {
        console.warn('Response does not contain photoUrl:', result)
        throw new Error('Server response tidak mengandung photoUrl. Response: ' + JSON.stringify(result))
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to upload profile photo'
      console.error('Upload profile photo error:', err)
      throw err
    } finally {
      isUploadingPhoto.value = false
    }
  }

  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  const deleteProfilePhoto = async () => {
    isSaving.value = true
    error.value = null
    successMessage.value = null
    
    try {
      const token = localStorage.getItem('ADMIN_TOKEN') || localStorage.getItem('USER_TOKEN')
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
      const url = `${baseUrl}/auth/delete-profile-photo`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const result = await response.json()

      // Update profile with deleted photo
      if (profile.value) {
        profile.value.photoUrl = undefined
      }
      
      // Also update auth store user
      if (authStore.user) {
        (authStore.user as any).photoUrl = undefined
      }

      successMessage.value = 'Profile photo deleted successfully'
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to delete profile photo'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    profile,
    isLoading,
    isSaving,
    isUploadingPhoto,
    error,
    successMessage,

    isProfileComplete,

    loadProfile,
    updateProfile,
    uploadProfilePhoto,
    deleteProfilePhoto,
    clearMessages,
  }
})
