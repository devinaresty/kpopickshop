<template>
  <section class="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
    <div class="max-w-7xl mx-auto">
      <!-- Section Title -->
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Popular Album Artist</h2>
      
      <!-- Section Description -->
      <p class="text-base sm:text-lg text-gray-600 mb-10 sm:mb-12">Artis paling dicari di KPopick</p>

      <!-- Artists Grid - Marquee Scrolling Layout -->
      <div class="space-y-8">
        <!-- Row 1 - Marquee scroll right (infinite) -->
        <div class="overflow-hidden">
          <div class="marquee marquee-right">
            <!-- Set asli -->
            <div class="marquee-content">
              <button
                v-for="artist in topRowArtists"
                :key="artist.id"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Duplikat untuk seamless loop -->
            <div class="marquee-content">
              <button
                v-for="artist in topRowArtists"
                :key="`dup-${artist.id}`"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Row 2 - Marquee scroll left (infinite) -->
        <div class="overflow-hidden">
          <div class="marquee marquee-left">
            <!-- Set asli -->
            <div class="marquee-content">
              <button
                v-for="artist in bottomRowArtists"
                :key="artist.id"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
              >
                {{ artist.name }}
              </button>
            </div>
            <!-- Duplikat untuk seamless loop -->
            <div class="marquee-content">
              <button
                v-for="artist in bottomRowArtists"
                :key="`dup-${artist.id}`"
                class="artist-pill px-6 py-2.5 rounded-full font-medium text-sm sm:text-base bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
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
import { ref, computed } from 'vue'

interface Artist {
  id: number
  name: string
}

// Artist data - shuffled combination of ILLIT & HEARTS2HEARTS
const allArtists = ref<Artist[]>([
  { id: 1, name: 'ILLIT' },
  { id: 2, name: 'HEARTS2HEARTS' },
  { id: 3, name: 'HEARTS2HEARTS' },
  { id: 4, name: 'ILLIT' },
  { id: 5, name: 'HEARTS2HEARTS' },
  { id: 6, name: 'ILLIT' },
  { id: 7, name: 'HEARTS2HEARTS' },
  { id: 8, name: 'ILLIT' },
  { id: 9, name: 'HEARTS2HEARTS' },
  { id: 10, name: 'ILLIT' },
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

// Split into 2 rows - 5 per row
const topRowArtists = computed((): Artist[] => {
  return shuffledArtists.value.slice(0, 5)
})
const bottomRowArtists = computed((): Artist[] => {
  return shuffledArtists.value.slice(5, 10)
})
</script>

<style scoped>
/* Marquee container setup */
.marquee {
  display: flex;
  gap: 0.75rem; /* sm:gap-3 */
  width: fit-content;
}

@media (min-width: 640px) {
  .marquee {
    gap: 1rem; /* sm:gap-4 */
  }
}

/* Marquee content wrapper - pills */
.marquee-content {
  display: flex;
  gap: inherit;
  flex-shrink: 0;
}

/* Row 1: Scroll to RIGHT (pills appear from left, disappear to right) */
.marquee-right {
  animation: scrollRight 20s linear infinite;
  will-change: transform;
}

@keyframes scrollRight {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Row 2: Scroll to LEFT (pills appear from right, disappear to left) */
.marquee-left {
  animation: scrollLeft 20s linear infinite;
  will-change: transform;
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(50%);
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

.artist-pill:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.artist-pill:active {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.artist-pill:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
