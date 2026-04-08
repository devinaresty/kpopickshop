<template>
  <section class="py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Popular Album Artist</h2>
      
      <p class="text-base sm:text-lg text-gray-600 mb-10 sm:mb-12">Artis paling dicari di KPopick</p>

      <div class="space-y-16">
        <div class="overflow-hidden rounded-lg">
          <div 
            class="marquee marquee-left-to-right">
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


interface Artist {
  id: number
  name: string
}

const coreArtists: Artist[] = [
  { id: 1, name: 'ILLIT' },
  { id: 2, name: 'HEARTS2HEARTS' },
  { id: 3, name: 'AESPA' },
]

const topRowArtists = computed((): Artist[] => coreArtists)
const bottomRowArtists = computed((): Artist[] => [...coreArtists].reverse())

const selectArtist = (artistName: string) => {
  router.push({
    name: 'search',
    query: { artist: artistName.toLowerCase() }
  })
}
</script>

<style scoped>
.marquee {
  display: flex;
  gap: 0.75rem; 
  width: auto;
  min-width: 100%;
  animation-play-state: running;
}

@media (min-width: 640px) {
  .marquee {
    gap: 1rem;
  }
}

.marquee-content {
  display: flex;
  gap: inherit;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
}

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
