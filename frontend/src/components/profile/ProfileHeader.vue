<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
    <div class="flex items-center gap-6">
      <!-- Avatar -->
      <div class="w-24 h-24 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <!-- User Info -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-black mb-1">{{ profile?.name || 'User Profile' }}</h1>
        <p class="text-gray-600 mb-4">{{ profile?.email }}</p>
        
        <!-- Role Badge -->
        <div class="inline-block">
          <span
            :class="[
              'text-xs font-semibold px-3 py-1 rounded-full',
              profile?.role === 'ADMIN'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            ]"
          >
            {{ profile?.role === 'ADMIN' ? 'Administrator' : 'Regular User' }}
          </span>
        </div>
      </div>

      <!-- Member Since -->
      <div class="text-right">
        <p class="text-xs text-gray-600 mb-1">Member Since</p>
        <p class="text-sm font-semibold text-gray-900">
          {{ profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '@/modules/profile/types'

interface Props {
  profile: UserProfile | null
}

defineProps<Props>()
</script>
