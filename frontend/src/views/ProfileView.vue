<template>
  <div class="pt-2 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>

      <template v-else-if="profile">
        <ProfileHeaderBar :profile="profile" />

        <div class="mb-6 bg-white border border-gray-200 rounded-t-lg">
          <div class="flex border-b border-gray-200">
            <button
              @click="activeTab = 'personal'"
              :class="[
                'flex-1 px-6 py-4 font-semibold text-center transition',
                activeTab === 'personal'
                  ? 'text-black border-b-2 border-black bg-white'
                  : 'text-gray-600 hover:text-black'
              ]"
            >
              {{ i18nStore.t('personalProfile.title') }}
            </button>
            <button
              @click="activeTab = 'address'"
              :class="[
                'flex-1 px-6 py-4 font-semibold text-center transition',
                activeTab === 'address'
                  ? 'text-black border-b-2 border-black bg-white'
                  : 'text-gray-600 hover:text-black'
              ]"
            >
              {{ i18nStore.t('personalProfile.listAddress') }}
            </button>
            <button
              @click="activeTab = 'transaction'"
              :class="[
                'flex-1 px-6 py-4 font-semibold text-center transition',
                activeTab === 'transaction'
                  ? 'text-black border-b-2 border-black bg-white'
                  : 'text-gray-600 hover:text-black'
              ]"
            >
              {{ i18nStore.t('personalProfile.transactions') }}
            </button>
          </div>
        </div>

        <div class="bg-white border border-t-0 border-gray-200 rounded-b-lg">
          <div v-if="activeTab === 'personal'">
            <PersonalProfileTab
              :profile="profile"
              :is-saving="isSaving"
              :error="error"
              :success-message="successMessage"
              @save="handleSaveProfile"
            />
          </div>

          <div v-if="activeTab === 'address'">
            <ListAddressTab :addresses="userAddresses" @address-added="loadAddresses" />
          </div>

          <div v-if="activeTab === 'transaction'">
            <TransactionListTab :transactions="userTransactions" />
          </div>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">Unable to load profile</p>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAuthStore, useProfileStore, useI18nStore } from '@/shared/stores'
import { apiClient } from '@/core/api'
import type { ProfileFormData, UserAddress, Transaction } from '@/modules/profile/types'
import ProfileHeaderBar from '@/components/profile/ProfileHeaderBar.vue'
import PersonalProfileTab from '@/components/profile/PersonalProfileTab.vue'
import ListAddressTab from '@/components/profile/ListAddressTab.vue'
import TransactionListTab from '@/components/profile/TransactionListTab.vue'
import Footer from '@/modules/landing/components/shared/Footer.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const i18nStore = useI18nStore()

const profile = computed(() => profileStore.profile)
const isLoading = computed(() => profileStore.isLoading)
const isSaving = computed(() => profileStore.isSaving)
const error = computed(() => profileStore.error)
const successMessage = computed(() => profileStore.successMessage)

const activeTab = ref<'personal' | 'address' | 'transaction'>('personal')
const userAddresses = ref<UserAddress[]>([])
const userTransactions = ref<Transaction[]>([])

const loadAddresses = async () => {
  try {
    const addresses = await apiClient.getAddresses()
    userAddresses.value = addresses
  } catch (err) {
    console.error('Failed to load addresses:', err)
  }
}

onMounted(async () => {
  if (authStore.user) {
    profileStore.profile = authStore.user as any
  } else {
    await profileStore.loadProfile()
  }
  await loadAddresses()
})

const handleSaveProfile = (data: ProfileFormData & { photoUrl?: string }) => {
  profileStore.updateProfile(data)
}
</script>
