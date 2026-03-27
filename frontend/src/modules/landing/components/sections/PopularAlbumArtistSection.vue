<template>
  <section class="py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16">
    <div class="max-w-7xl mx-auto">
      <!-- Section Title -->
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Popular Album Artist</h2>
      
      <!-- Section Description -->
      <p class="text-base sm:text-lg text-gray-600 mb-10 sm:mb-12">Artis paling dicari di KPopick</p>

      <!-- Artists Grid - Marquee Scrolling Layout -->
      <div class="space-y-16">
        <!-- Row 1 - Marquee scroll LEFT to RIGHT (infinite) -->
        <div class="overflow-hidden rounded-lg">
          <div 
            class="marquee marquee-left-to-right"
          >
            <!-- Set 1 -->
            <div class="marquee-content">
              <button
                v-for="artist in topRowArtists"
                :key="`1-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Set 2 - Duplikat -->
            <div class="marquee-content">
              <button
                v-for="artist in topRowArtists"
                :key="`2-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Set 3 - Duplikat extra untuk seamless -->
            <div class="marquee-content">
              <button
                v-for="artist in topRowArtists"
                :key="`3-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Set 4 - Duplikat extra untuk seamless sempurna -->
            <div class="marquee-content">
              <button
                v-for="artist in topRowArtists"
                :key="`4-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Row 2 - Marquee scroll RIGHT to LEFT (infinite) -->
        <div class="overflow-hidden rounded-lg">
          <div 
            class="marquee marquee-right-to-left"
          >
            <!-- Set 1 -->
            <div class="marquee-content">
              <button
                v-for="artist in bottomRowArtists"
                :key="`1-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Set 2 - Duplikat -->
            <div class="marquee-content">
              <button
                v-for="artist in bottomRowArtists"
                :key="`2-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Set 3 - Duplikat extra untuk seamless -->
            <div class="marquee-content">
              <button
                v-for="artist in bottomRowArtists"
                :key="`3-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Set 4 - Duplikat extra untuk seamless sempurna -->
            <div class="marquee-content">
              <button
                v-for="artist in bottomRowArtists"
                :key="`4-${artist.id}`"
                @click="selectArtist(artist.name)"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Hover state untuk pause animation - DIHAPUS (tidak perlu lagi)
// const isTopRowHovered = ref(false)
// const isBottomRowHovered = ref(false)

interface Artist {
  id: number
  name: string
}

// Core artists - fixed list tanpa random
const coreArtists: Artist[] = [
  { id: 1, name: 'ILLIT' },
  { id: 2, name: 'HEARTS2HEARTS' },
  { id: 3, name: 'AESPA' },
]

// Create rows dengan fixed order (BUKAN random)
const topRowArtists = computed((): Artist[] => coreArtists)
const bottomRowArtists = computed((): Artist[] => [...coreArtists].reverse())

// Navigate to search page with artist filter
const selectArtist = (artistName: string) => {
  router.push({
    name: 'search',
    query: { artist: artistName.toLowerCase() }
  })
}
</script>

<style scoped>
/* Marquee container setup - FLEX dengan duplikasi data (ABCD ABCD ABCD ABCD) */
.marquee {
  display: flex;
  gap: 0.75rem; /* gap-3 */
  width: auto;
  min-width: 100%;
  animation-play-state: running;
}

@media (min-width: 640px) {
  .marquee {
    gap: 1rem; /* gap-4 */
  }
}

/* Marquee content wrapper - pills */
.marquee-content {
  display: flex;
  gap: inherit;
  flex-shrink: 0;
  /* Pastikan tidak ada gap antar duplikasi */
  margin: 0;
  padding: 0;
}

/* Row 1: Scroll LEFT to RIGHT (pills appear dari kanan, disappear ke kiri)
   Data: ABCD ABCD ABCD ABCD (4 set) - start dari posisi negatif untuk seamless
*/
.marquee-left-to-right {
  animation: scrollLeftToRight 45s linear infinite;
  will-change: transform;
}

@keyframes scrollLeftToRight {
  0% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(0);
  }
}

/* Row 2: Scroll RIGHT to LEFT (pills appear dari kiri, disappear ke kanan)
   Data: ABCD ABCD ABCD ABCD (4 set) - bergerak ke arah NEGATIF (kanan ke kiri)
*/
.marquee-right-to-left {
  animation: scrollRightToLeft 45s linear infinite;
  will-change: transform;
}

@keyframes scrollRightToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-25%);
  }
}

/* Artist pill styling */
.artist-pill {
  white-space: nowrap;
  display: inline-block;
  transition: box-shadow 0.3s ease-out;
  color: inherit;
  background-color: white;
  border-color: #e5e7eb;
}

.artist-pill:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
