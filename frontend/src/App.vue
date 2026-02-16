<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <nav class="w-full sticky top-0 z-40 py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 md:px-5 lg:px-8">
      <div class="flex items-center justify-center">
        <div class="rounded-lg sm:rounded-xl border border-gray-300/50 backdrop-blur-sm bg-gray-300/40 px-3.5 sm:px-4 md:px-5 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-3.5 md:gap-5 max-w-max">
          <div class="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center">
            <img src="/logo (3).png" alt="K Logo" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain" />
          </div>

          <div class="hidden sm:block w-px h-5 sm:h-5 md:h-6 bg-gray-300"></div>

          <button class="text-xs sm:text-sm md:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-md whitespace-nowrap">
            Kategori
          </button>

          <div class="hidden sm:block w-px h-4 sm:h-4 md:h-5 bg-gray-300"></div>

          <!-- Sign In Button -->
          <button
            @click="landingStore.openAuthModal('login')"
            class="text-xs sm:text-sm md:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-md whitespace-nowrap"
          >
            Sign In
          </button>

          <!-- Divider -->
          <div class="hidden sm:block w-px h-5 sm:h-5 md:h-6 bg-gray-300"></div>

          <!-- Log In Button -->
          <button
            @click="landingStore.openAuthModal('register')"
            class="text-xs sm:text-sm md:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-md whitespace-nowrap"
          >
            Log In
          </button>
        </div>
      </div>
    </nav>

    <nav class="w-full fixed left-0 right-0 bottom-4 sm:bottom-6 lg:bottom-8 z-20 py-1.5 sm:py-2 lg:py-2.5 px-2 sm:px-3 md:px-4 lg:px-6 pointer-events-none">
      <div class="flex items-center justify-center pointer-events-auto">
        <div class="rounded-lg sm:rounded-xl border border-gray-300/50 backdrop-blur-sm bg-gray-300/40 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-2.5 md:gap-3 max-w-xl w-full">
          <!-- Search Bar -->
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              class="w-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gray-100/50 rounded-md text-xs sm:text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder-gray-400 transition-all"
            />
            <svg class="absolute right-2 sm:right-2.5 md:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Divider -->
          <div class="w-px h-4 sm:h-4 md:h-5 bg-gray-300"></div>

          <!-- Cart Button -->
          <button
            @click="landingStore.toggleCart()"
            class="relative p-1 sm:p-1.5 md:p-2 hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-md transition-all duration-300 flex-shrink-0 group"
          >
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="landingStore.state.cartItems.length > 0" class="absolute -top-1 -right-1 sm:top-0 sm:right-0 bg-black text-white text-xs font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs">
              {{ landingStore.state.cartItems.length }}
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 w-full relative z-0 overflow-x-hidden">
      <router-view />
    </main>

    <!-- Auth Modal -->
    <AuthModal />

    <!-- Cart Sidebar -->
    <CartSidebar />
  </div>
</template>

<script setup lang="ts">
import { useLandingStore } from '@/modules/landing/stores/landing.store'
import AuthModal from '@/modules/landing/components/modals/AuthModal.vue'
import CartSidebar from '@/modules/landing/components/shared/CartSidebar.vue'

const landingStore = useLandingStore()
</script>
