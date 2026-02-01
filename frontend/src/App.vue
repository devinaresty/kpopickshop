<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Top Navbar - Logo, Kategori, Sign In, Log In -->
    <nav class="w-full sticky top-0 z-40 py-3 sm:py-4 px-3 sm:px-4 lg:px-8">
      <div class="flex items-center justify-center">
        <div class="rounded-2xl border border-gray-300/50 backdrop-blur-sm bg-gray-300/40 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4 sm:gap-6 lg:gap-8 max-w-max">
          <!-- Logo with Image -->
          <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <img src="/logo (3).png" alt="K Logo" class="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
          </div>

          <!-- Divider -->
          <div class="hidden sm:block w-px h-6 bg-gray-300"></div>

          <!-- Kategori Button -->
          <button class="text-xs sm:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 py-1.5 rounded-lg whitespace-nowrap">
            Kategori
          </button>

          <!-- Divider -->
          <div class="hidden sm:block w-px h-6 bg-gray-300"></div>

          <!-- Sign In Button -->
          <button
            @click="landingStore.openAuthModal('login')"
            class="text-xs sm:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            Sign In
          </button>

          <!-- Divider -->
          <div class="hidden sm:block w-px h-6 bg-gray-300"></div>

          <!-- Log In Button -->
          <button
            @click="landingStore.openAuthModal('register')"
            class="text-xs sm:text-sm font-medium text-gray-800 hover:text-white hover:bg-gray-900 hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all duration-300 px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            Log In
          </button>
        </div>
      </div>
    </nav>

    <!-- Second Navbar - Search & Cart (Center) - Fixed Position -->
    <nav class="w-full fixed left-0 right-0 top-[85%] z-40 py-3 sm:py-4 px-3 sm:px-4 lg:px-8 pointer-events-none">
      <div class="flex items-center justify-center pointer-events-auto">
        <div class="rounded-2xl border border-gray-300/50 backdrop-blur-sm bg-gray-300/40 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 max-w-2xl w-full">
          <!-- Search Bar -->
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              class="w-full px-4 py-2 bg-gray-100/50 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/10 placeholder-gray-400 transition-all"
            />
            <svg class="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Divider -->
          <div class="w-px h-6 bg-gray-300"></div>

          <!-- Cart Button -->
          <button
            @click="landingStore.toggleCart()"
            class="relative p-2 hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-lg transition-all duration-300 flex-shrink-0 group"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="landingStore.state.cartItems.length > 0" class="absolute top-0 right-0 bg-black text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
              {{ landingStore.state.cartItems.length }}
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 w-full">
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
