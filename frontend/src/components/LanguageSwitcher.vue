<template>
  <div class="flex items-center gap-2">
    <button
      @click="setLanguage('id')"
      :class="[
        'px-4 py-2 font-semibold rounded-lg transition-all duration-200',
        currentLanguage === 'id'
          ? 'bg-black text-white shadow-md'
          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
      ]"
    >
      Indonesia
    </button>
    <button
      @click="setLanguage('en')"
      :class="[
        'px-4 py-2 font-semibold rounded-lg transition-all duration-200',
        currentLanguage === 'en'
          ? 'bg-black text-white shadow-md'
          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
      ]"
    >
      English
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n.store'
import { computed } from 'vue'

const i18nStore = useI18nStore()

const currentLanguage = computed(() => i18nStore.currentLanguage)

const setLanguage = (lang: 'id' | 'en') => {
  i18nStore.setLanguage(lang)
}
</script>
