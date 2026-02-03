<template>
  <section class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-7xl mx-auto">
      <!-- Section Title -->
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Popular Artists</h2>
      
      <!-- Section Description -->
      <p class="text-lg sm:text-xl text-gray-600 mb-10">Temukan K-pop artist favorit Anda</p>

      <!-- Artists Pills/Capsules Grid -->
      <div class="flex flex-wrap gap-3 sm:gap-4 justify-start">
        <!-- Artist Pills -->
        <button
          v-for="artist in displayedArtists"
          :key="artist.id"
          @click="handleArtistClick(artist)"
          class="artist-pill px-6 py-2.5 rounded-full font-medium text-base transition-all duration-300 ease-out"
        >
          {{ artist.name }}
        </button>
      </div>

      <!-- Loading State (optional) -->
      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-500">Loading artists...</p>
      </div>

      <!-- Empty State (optional) -->
      <div v-if="!isLoading && displayedArtists.length === 0" class="text-center py-8">
        <p class="text-gray-500">No artists found</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '@/lib/api'

interface Artist {
  id: number
  name: string
  slug: string
  description?: string
}

// Router and state
const router = useRouter()
const isLoading = ref(false)
const allArtists = ref<Artist[]>([])

// Get max 8 artists for display
const displayedArtists = computed(() => {
  return allArtists.value.slice(0, 8)
})

// Fetch artists on mount
onMounted(async () => {
  try {
    isLoading.value = true
    // TODO: Replace with actual API call to get artist categories
    // Current approach: fetch all categories and filter for artists
    const categories = await apiClient.getCategories()
    
    // Filter to get only artist-related categories
    // This depends on your backend structure - adjust as needed
    const artists = categories.filter((cat: any) => {
      return cat.slug?.includes('group') || cat.parent_slug?.includes('group')
    })
    
    allArtists.value = artists.slice(0, 8)
  } catch (error) {
    console.error('Failed to fetch artists:', error)
  } finally {
    isLoading.value = false
  }
})

// Handle artist click - navigate to search with filter
const handleArtistClick = (artist: Artist) => {
  router.push({
    name: 'search',
    query: { 
      artist: artist.slug,
      type: 'artist'
    }
  })
}
</script>

<style scoped>
/* Artist pill base styling */
.artist-pill {
  background-color: #f3f4f6;
  color: #111827;
  border: 2px solid transparent;
  
  /* Smooth animations */
  transition: all 0.3s ease-out;
}

/* Hover state - dark background with white text */
.artist-pill:hover {
  background-color: #111827;
  color: white;
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.15);
  transform: translateY(-2px);
}

/* Active/Focus state for accessibility */
.artist-pill:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth scale animation on click */
.artist-pill:active {
  transform: translateY(-1px) scale(0.98);
}
</style>
