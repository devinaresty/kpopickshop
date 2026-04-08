<template>
  <div class="mb-8 bg-gray-200 rounded-lg p-6 flex items-center gap-6">
    <div class="flex-shrink-0">
      <div class="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center overflow-hidden border-3 border-white shadow-md">
        <img v-if="profile?.photoUrl" :src="profile.photoUrl" :alt="profile.name" class="w-full h-full object-cover">
        <svg v-else class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div class="flex-1">
      <h2 class="text-2xl font-bold text-black">{{ profile?.name }}</h2>
      <p class="text-gray-600 text-sm">{{ profile?.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '@/modules/profile/types'

defineProps<{
  profile: UserProfile | null
}>()
</script>
