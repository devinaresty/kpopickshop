<template>
  <section class="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
    <div class="max-w-7xl mx-auto">
      <!-- Section Title -->
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Popular Artists</h2>
      
      <!-- Section Description -->
      <p class="text-lg sm:text-xl text-gray-600 mb-12">Temukan K-pop artist favorit Anda</p>

      <!-- Artists Zigzag Layout - Multiple Rows -->
      <div class="space-y-4 sm:space-y-6 lg:space-y-8">
        <!-- Row 1 (ODD) - Artists align to right with right-to-left animation -->
        <div class="flex justify-end flex-wrap gap-2 sm:gap-3">
          <button
            v-for="(artist, index) in topRowArtists"
            :key="artist.id"
            class="artist-pill px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm lg:text-base bg-white border border-gray-200 shadow-sm cursor-pointer"
            :style="{
              animation: `driftInRight 1.2s ease-out ${index * 0.15}s both`,
            }"
          >
            {{ artist.name }}
          </button>
        </div>

        <!-- Row 2 (EVEN) - Artists align to left with left-to-right animation -->
        <div class="flex justify-start flex-wrap gap-2 sm:gap-3">
          <button
            v-for="(artist, index) in bottomRowArtists"
            :key="artist.id"
            class="artist-pill px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm lg:text-base bg-white border border-gray-200 shadow-sm cursor-pointer"
            :style="{
              animation: `driftInLeft 1.2s ease-out ${index * 0.15}s both`,
            }"
          >
            {{ artist.name }}
          </button>
        </div>

        <!-- Row 3 (ODD) - Artists align to right -->
        <div class="flex justify-end flex-wrap gap-2 sm:gap-3">
          <button
            v-for="(artist, index) in topRowArtists2"
            :key="`top2-${artist.id}`"
            class="artist-pill px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm lg:text-base bg-white border border-gray-200 shadow-sm cursor-pointer"
            :style="{
              animation: `driftInRight 1.2s ease-out ${index * 0.15}s both`,
            }"
          >
            {{ artist.name }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Artist {
  id: number
  name: string
}

// Extended artist list with variety - can be shuffled
const allArtists = ref<Artist[]>([
  { id: 1, name: 'ILLIT' },
  { id: 2, name: 'HEARTS2HEARTS' },
  { id: 3, name: 'IVE' },
  { id: 4, name: 'LE SSERAFIM' },
  { id: 5, name: 'NEWJEANS' },
  { id: 6, name: 'STRAY KIDS' },
  { id: 7, name: 'SEVENTEEN' },
  { id: 8, name: 'TWICE' },
  { id: 9, name: 'BLACKPINK' },
  { id: 10, name: 'BTS' },
  { id: 11, name: 'ENHYPEN' },
  { id: 12, name: 'FIFTY FIFTY' },
])

// Helper function to shuffle array
const shuffleArray = (arr: Artist[]): Artist[] => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

// Get shuffled artists
const shuffledArtists = computed((): Artist[] => shuffleArray(allArtists.value))

// Split into rows: 5-6 per row for minimal 5 requirement
// Row 1 (top, right-aligned)
const topRowArtists = computed((): Artist[] => {
  return shuffledArtists.value.slice(0, 5)
})

// Row 2 (middle, left-aligned)
const bottomRowArtists = computed((): Artist[] => {
  return shuffledArtists.value.slice(5, 10)
})

// Row 3 (bottom, right-aligned)
const topRowArtists2 = computed((): Artist[] => {
  return shuffledArtists.value.slice(10, 12)
})
</script>

<style scoped>
/* Subtle drift animation - slide in from right with gentle motion */
@keyframes driftInRight {
  0% {
    opacity: 0;
    transform: translateX(40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Subtle drift animation - slide in from left with gentle motion */
@keyframes driftInLeft {
  0% {
    opacity: 0;
    transform: translateX(-40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Artist pill styling - compact and refined */
.artist-pill {
  transition: all 0.3s ease-out;
  white-space: nowrap;
  display: inline-block;
  /* Ensure animation is not overridden */
  animation-fill-mode: both;
}

/* Subtle hover effect - only shadow and slight lift, no color change */
.artist-pill:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

/* Active/pressed state - subtle visual feedback */
.artist-pill:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
}

/* Focus state for accessibility */
.artist-pill:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Ensure border color is subtle gray */
.artist-pill {
  border-color: #e5e7eb;
}
</style>
