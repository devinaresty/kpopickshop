<template>
  <div class="bg-gray-100 min-h-screen">
    <HeroSection />

    <PopularAlbumArtistSection />

    <RecommendationSection />

    <footer class="bg-black text-white py-8 sm:py-12">
      <div class="max-w-full px-3 sm:px-4 lg:px-8">
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div>
            <div class="flex items-center overflow-visible mb-3 sm:mb-4">
              <img src="/logo (3).png" alt="K Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            </div>
            <p class="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Your ultimate K-pop destination for albums, merchandise, and exclusive collectibles.
            </p>
          </div>

          <div>
            <h4 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Shop</h4>
            <ul class="space-y-1 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><a href="#" class="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Albums</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Merchandise</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Posters</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul class="space-y-1 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Follow</h4>
            <div class="flex gap-3 sm:gap-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 17.5h-1.887v-5.368c0-1.304-.023-2.985-1.82-2.985-1.821 0-2.1 1.42-2.1 2.888v4.465h-1.879V9.011h1.805v1.528h.025c.252-.477.867-1.179 1.783-1.179 1.904 0 2.254 1.254 2.254 2.585v4.555zM5.337 7.433c-.604 0-1.089-.49-1.089-1.093 0-.603.485-1.093 1.089-1.093.604 0 1.089.49 1.089 1.093 0 .603-.485 1.093-1.089 1.093zm.922 10.067H4.414V9.011h1.845v8.489zM19.5 0h-15C2.012 0 0 2.013 0 4.5v15C0 21.988 2.012 24 4.5 24h15c2.488 0 4.5-2.012 4.5-4.5v-15C24 2.013 21.988 0 19.5 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 KPopick. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/modules/landing/components/sections/HeroSection.vue'
import PopularAlbumArtistSection from '@/modules/landing/components/sections/PopularAlbumArtistSection.vue'
import RecommendationSection from '@/modules/landing/components/sections/RecommendationSection.vue'
</script>
