<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-black text-black mb-2">Search Results</h1>
        <p class="text-gray-600">Found results for your search</p>
      </div>

      <!-- Search Bar -->
      <div class="mb-8">
        <input 
          type="text" 
          placeholder="Search K-pop products, artists, albums..." 
          class="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-lg"
        />
      </div>

      <!-- Results Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div class="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="p-4">
            <p class="text-xs text-gray-500 mb-1">Albums</p>
            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">Product Name</h3>
            <div class="flex justify-between items-center">
              <span class="font-bold text-black">$25.99</span>
              <span class="text-xs text-gray-600">In Stock</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-600 text-lg">Try adjusting your search terms</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Search View
</script>
