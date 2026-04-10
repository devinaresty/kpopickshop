<template>
  <footer class="bg-gray-200 text-gray-900 py-8 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        <div>
          <div class="flex items-center overflow-visible mb-8 sm:mb-10 -m-2 sm:-m-3">
            <img src="/logo6.png" alt="K Logo" class="w-32 h-32 sm:w-48 sm:h-48 object-contain" />
          </div>
          <p class="text-gray-600 text-xs sm:text-sm leading-relaxed">
            {{ i18nStore.t('footer.description') }}
          </p>
        </div>

        <div>
          <h4 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-gray-900">{{ i18nStore.t('footer.shopHighlight') }}</h4>
          <ul class="space-y-1 sm:space-y-2 text-gray-600 text-xs sm:text-sm">
            <li v-for="category in shopCategories" :key="category">
              <button
                @click="navigateToCategory(category)"
                class="hover:text-gray-900 transition-colors text-left"
              >
                {{ category }}
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-gray-900">{{ i18nStore.t('footer.aboutUs') }}</h4>
          <ul class="space-y-1 sm:space-y-2 text-gray-600 text-xs sm:text-sm">
            <li><span class="hover:text-gray-900 transition-colors cursor-pointer">{{ i18nStore.t('footer.aboutUsLink') }}</span></li>
            <li><span class="hover:text-gray-900 transition-colors cursor-pointer">{{ i18nStore.t('footer.privacy') }}</span></li>
            <li><span class="hover:text-gray-900 transition-colors cursor-pointer">{{ i18nStore.t('footer.terms') }}</span></li>
            <li><span class="hover:text-gray-900 transition-colors cursor-pointer">{{ i18nStore.t('footer.contact') }}</span></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-gray-900">{{ i18nStore.t('footer.payment') }}</h4>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10h8v2h-8v-2z"/>
              </svg>
              <span class="text-xs sm:text-sm text-gray-600">{{ i18nStore.t('footer.bankTransfer') }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H4v-6h16v6zm0-8H4v-2h16v2z"/>
              </svg>
              <span class="text-xs sm:text-sm text-gray-600">{{ i18nStore.t('footer.creditCard') }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 6h-2c0-2.76-2.24-5-5-5s-5 2.24-5 5H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-3c1.66 0 3 1.34 3 3h-6c0-1.66 1.34-3 3-3zm0 6c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
              </svg>
              <span class="text-xs sm:text-sm text-gray-600">{{ i18nStore.t('footer.eWallet') }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm12-1h2v2h-2v-2zm2 3h-2v2h2v-2zm-4 0h2v2h-2v-2zm2-4h-2v2h2v-2z"/>
              </svg>
              <span class="text-xs sm:text-sm text-gray-600">{{ i18nStore.t('footer.qrPayments') }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6h-2V4c0-.9-.9-1.72-1.97-1.72h-2.6c-2.05 0-3.71 1.66-3.71 3.72v2H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4-2h2.6c.89 0 1.97.82 1.97 1.72v2h-4.6V4c0-.9 1.08-1.72 1.97-1.72zM7 8h10v2H7V8z"/>
              </svg>
              <span class="text-xs sm:text-sm text-gray-600">{{ i18nStore.t('footer.directDebit') }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-sm sm:text-base text-gray-900">{{ i18nStore.t('footer.follow') }}</h4>
          </div>
          <div class="flex gap-3 sm:gap-4 mb-8">
            <a
              href="https://www.instagram.com/kpopick_?igsh=MXFycmM0aDZtMzI2cw=="
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-600 hover:text-pink-600 transition-colors duration-200"
              title="Instagram"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
              </svg>
            </a>

            <a
              href="https://wa.me/message/PHCNPEWTVEVZD1"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-600 hover:text-green-600 transition-colors duration-200"
              title="WhatsApp"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.07 4.93L19.07 4.93c-1.79-1.79-4.17-2.77-6.7-2.77c-5.23 0-9.48 4.25-9.48 9.48c0 1.67.44 3.3 1.28 4.75L3 21.11l4.9-1.29c1.39.76 2.96 1.16 4.57 1.16h0h0c5.23 0 9.48-4.25 9.48-9.48C21.95 9.1 20.86 6.72 19.07 4.93zM12.47 19.58h0c-1.43 0-2.83-.38-4.04-1.1l-0.29-0.17l-3.01.79l0.81-2.95l-0.19-0.3C4.4 14.34 4 13.42 4 12.48c0-4.29 3.49-7.78 7.78-7.78c2.08 0 4.03 0.81 5.49 2.27c1.46 1.46 2.27 3.4 2.27 5.49C20.25 16.09 16.76 19.58 12.47 19.58zM16.51 14.15c-0.23-0.12-1.38-0.68-1.6-0.75c-0.22-0.07-0.39-0.11-0.55 0.11c-0.17 0.22-0.64 0.75-0.79 0.9c-0.14 0.15-0.29 0.17-0.52 0.05c-0.23-0.12-0.98-0.36-1.87-1.16c-0.69-0.62-1.16-1.38-1.29-1.6c-0.14-0.23-0.02-0.34 0.1-0.46c0.1-0.1 0.23-0.26 0.35-0.39c0.12-0.13 0.16-0.22 0.23-0.37c0.08-0.15 0.04-0.28-0.02-0.4c-0.06-0.12-0.55-1.33-0.75-1.82c-0.2-0.47-0.4-0.41-0.55-0.42c-0.14-0.01-0.3-0.01-0.46-0.01c-0.16 0-0.41 0.06-0.63 0.28c-0.22 0.22-0.86 0.84-0.86 2.05c0 1.21 0.88 2.38 1 2.54c0.12 0.15 1.68 2.57 4.07 3.61c0.57 0.24 1.01 0.39 1.35 0.5c0.57 0.18 1.09 0.15 1.5 0.09c0.46-0.07 1.41-0.58 1.61-1.13c0.2-0.56 0.2-1.04 0.14-1.13C16.8 14.32 16.74 14.27 16.51 14.15z"/>
              </svg>
            </a>
          </div>

          <div class="flex gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div class="border-t border-gray-300 pt-6 sm:pt-8 text-center text-gray-600 text-xs sm:text-sm">
        <p>{{ i18nStore.t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/shared/stores'
import LanguageSwitcher from './LanguageSwitcher.vue'

const router = useRouter()
const i18nStore = useI18nStore()

const shopCategories = ref([
  'Albums',
  'Lightstick',
  'Photobook',
  'Accessories'
])

const navigateToCategory = (category: string) => {
  router.push({
    name: 'search',
    query: { category: category.toLowerCase() }
  })
}
</script>
