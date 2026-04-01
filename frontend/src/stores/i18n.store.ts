import { defineStore } from 'pinia'
import { ref } from 'vue'
import id from '@/locales/id.json'
import en from '@/locales/en.json'

export const useI18nStore = defineStore('i18n', () => {
  const currentLanguage = ref<'id' | 'en'>(
    (localStorage.getItem('language') as 'id' | 'en') || 'id'
  )
  
  const translations = {
    id,
    en
  }

  const setLanguage = (lang: 'id' | 'en') => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  const t = (key: string, defaultText: string = ''): string => {
    const keys = key.split('.')
    let value: any = translations[currentLanguage.value]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || defaultText
  }

  return {
    currentLanguage,
    setLanguage,
    t,
  }
})
