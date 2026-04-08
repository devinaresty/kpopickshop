<template>
  <div class="bg-white border-b border-gray-200 flex items-center justify-between px-8 py-3 fixed top-0 left-64 right-0 z-20 h-16">
    <!-- Left Side - Page Title Only -->
    <div class="flex-1">
      <h1 class="text-lg font-bold text-gray-900">{{ title }}</h1>
    </div>

    <!-- Middle - Action Slots -->
    <div v-if="$slots.actions" class="flex items-center gap-3 flex-shrink-0">
      <slot name="actions"></slot>
    </div>

    <!-- Right Side - Profile Avatar Only -->
    <div class="flex items-center ml-auto flex-shrink-0">
      <!-- User Avatar - Polished circle -->
      <div class="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-250 flex-shrink-0 border border-gray-300 shadow-sm">
        {{ userInitial }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/shared/stores'

interface Props {
  title: string
}

defineProps<Props>()

const authStore = useAuthStore()

const userInitial = computed(() => {
  const name = authStore.user?.name || 'Admin'
  return name.charAt(0).toUpperCase()
})
</script>
