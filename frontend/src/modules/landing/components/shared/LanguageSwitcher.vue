<template>
  <div class="flex gap-2 items-center">
    <button
      @click="() => i18nStore.setLanguage('id')"
      :class="[
        'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200',
        i18nStore.currentLanguage === 'id'
          ? 'bg-black text-white shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      Indonesia
    </button>
    
    <button
      @click="() => i18nStore.setLanguage('en')"
      :class="[
        'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200',
        i18nStore.currentLanguage === 'en'
          ? 'bg-black text-white shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      English
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/shared/stores'

const i18nStore = useI18nStore()
</script>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}

button:active {
  transform: scale(0.98);
}
</style>
