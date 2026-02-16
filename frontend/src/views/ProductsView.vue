<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-black text-black mb-2">Products</h1>
        <p class="text-gray-600">Browse all our K-pop products</p>
      </div>

      <!-- Filters and Search -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
            <option>All Categories</option>
            <option>Albums</option>
            <option>Merchandise</option>
            <option>Posters</option>
          </select>
        </div>

        <!-- Price Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
            <option>All Prices</option>
            <option>Under $25</option>
            <option>$25 - $50</option>
            <option>$50 - $100</option>
            <option>Over $100</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Popular</option>
          </select>
        </div>

        <!-- Search -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <input 
            type="text" 
            placeholder="Search products..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 12" :key="i" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
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

      <!-- Pagination -->
      <div class="mt-12 flex justify-center gap-2">
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Previous</button>
        <button class="px-4 py-2 bg-black text-white rounded-lg">1</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">2</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">3</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Products View
</script>
