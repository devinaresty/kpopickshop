<template>
  <!-- Modal Backdrop -->
  <div
    v-if="landingStore.state.isAuthModalOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
    @click="landingStore.closeAuthModal()"
  />

  <!-- Modal -->
  <div
    v-if="landingStore.state.isAuthModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-[420px] w-full animate-in fade-in zoom-in duration-300"
      @click.stop
    >
      <!-- Close Button -->
      <div class="flex justify-end p-3 sm:p-4 border-b border-gray-100">
        <button
          @click="landingStore.closeAuthModal()"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-5 sm:p-6">
        <!-- Logo/Title -->
        <div class="flex items-center justify-center mb-4 sm:mb-5">
          <img src="/logo (3).png" alt="K Logo" class="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
        </div>

        <!-- Login Form -->
        <LoginForm v-if="landingStore.state.authModalMode === 'login'" />

        <!-- Sign Up Form -->
        <SignUpForm v-else />

        <!-- Toggle Button -->
        <div class="mt-3 sm:mt-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
            {{ landingStore.state.authModalMode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
          </p>
          <button
            @click="landingStore.toggleAuthMode()"
            class="text-xs sm:text-sm font-semibold text-black hover:text-gray-700 transition-colors underline underline-offset-2"
          >
            {{ landingStore.state.authModalMode === 'login' ? 'Create one' : 'Sign In' }}
          </button>
        </div>

        <!-- See Other Options -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <button
            v-if="!landingStore.state.isOtherOptionsModalOpen"
            @click="landingStore.openOtherOptionsModal()"
            class="w-full text-sm text-center text-gray-600 hover:text-black transition-colors font-medium"
          >
            See Other Login Options
          </button>

          <!-- Social Options -->
          <div
            v-else
            class="space-y-3 animate-in fade-in duration-200"
          >
            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-sm font-medium">Google</span>
            </button>

            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.17-6.763-5.91 6.763h-3.308l7.73-8.835L2.56 2.25h6.6l4.69 6.168L17.76 2.25h.484zm-1.161 17.52h1.833L7.084 5.126H5.117L17.083 19.77z"/>
              </svg>
              <span class="text-sm font-medium">X</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLandingStore } from '../../stores/landing.store'
import LoginForm from './LoginForm.vue'
import SignUpForm from './SignUpForm.vue'

const landingStore = useLandingStore()
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: fade-in 0.2s ease-out;
}

.fade-in {
  animation: fade-in 0.2s ease-out;
}

.zoom-in {
  animation: zoom-in 0.3s ease-out;
}

.duration-300 {
  animation-duration: 0.3s;
}

.duration-200 {
  animation-duration: 0.2s;
}
</style>
