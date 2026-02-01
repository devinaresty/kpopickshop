<template>
  <nav class="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
    <!-- Main Navbar Container -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center w-8 h-8 sm:w-10 sm:h-10 overflow-visible">
          <img src="/logo (3).png" alt="K Logo" class="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
        </div>

        <!-- Search Bar - Center (Hidden on mobile) -->
        <div class="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div class="relative w-full">
            <input
              type="text"
              placeholder="Search"
              class="w-full px-4 py-2 rounded-full bg-gray-100/80 border border-gray-200/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:bg-white transition-all duration-300"
            />
            <svg
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 sm:gap-4 lg:gap-6">
        <!-- Categories with HoverCard -->
          <HoverCard>
            <HoverCardTrigger as-child>
              <button class="hidden sm:block text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Categories
              </button>
            </HoverCardTrigger>
            <HoverCardContent class="w-56 sm:w-64 p-3 sm:p-4 bg-white rounded-lg shadow-lg border border-gray-100">
              <div class="space-y-2">
                <div
                  v-for="category in ['K-Pop Albums', 'Merchandise', 'Concert Tickets', 'Posters', 'Lightsticks']"
                  :key="category"
                  class="px-3 sm:px-4 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors text-xs sm:text-sm"
                >
                  {{ category }}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <!-- Sign In with HoverCard -->
          <HoverCard>
            <HoverCardTrigger as-child>
              <button class="hidden sm:block text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Sign In
              </button>
            </HoverCardTrigger>
            <HoverCardContent class="w-48 sm:w-56 p-3 sm:p-4 bg-white rounded-lg shadow-lg border border-gray-100">
              <button
                @click="landingStore.openAuthModal('register')"
                class="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-black hover:bg-gray-50 rounded transition-colors"
              >
                Create Account
              </button>
            </HoverCardContent>
          </HoverCard>

          <!-- Log In with HoverCard -->
          <HoverCard>
            <HoverCardTrigger as-child>
              <button class="hidden sm:block text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Log In
              </button>
            </HoverCardTrigger>
            <HoverCardContent class="w-48 sm:w-56 p-3 sm:p-4 bg-white rounded-lg shadow-lg border border-gray-100">
              <button
                @click="landingStore.openAuthModal('login')"
                class="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-black hover:bg-gray-50 rounded transition-colors"
              >
                Login to Account
              </button>
            </HoverCardContent>
          </HoverCard>

          <!-- Cart with HoverCard (Icon) -->
          <HoverCard>
            <HoverCardTrigger as-child>
              <button
                @click="landingStore.toggleCart()"
                class="relative p-2 text-gray-600 hover:text-black transition-colors"
              >
                <svg
                  class="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span
                  v-if="landingStore.state.cartItems.length"
                  class="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {{ landingStore.state.cartItems.length }}
                </span>
              </button>
            </HoverCardTrigger>
            <HoverCardContent class="w-48 sm:w-56 p-3 sm:p-4 bg-white rounded-lg shadow-lg border border-gray-100">
              <p class="text-xs sm:text-sm text-gray-600">
                {{ landingStore.state.cartItems.length === 0 ? 'Your cart is empty' : `${landingStore.state.cartItems.length} item(s)` }}
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useLandingStore } from '@/modules/landing/stores/landing.store'

const landingStore = useLandingStore()
</script>

<style scoped>
/* Modern Blur Navbar */
@supports (backdrop-filter: blur(10px)) {
  nav {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
  }
}
</style>
