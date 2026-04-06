<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Products</h1>
      <button class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50" :disabled="isLoading">
        <span>+</span> Add Product
      </button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p class="mt-4 text-gray-500">Loading products...</p>
      </div>
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
      <p class="text-red-700 font-medium">{{ error }}</p>
      <button @click="loadProducts" class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
        Try Again
      </button>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
          <tr>
            <th class="p-4 border-b">Image</th>
            <th class="p-4 border-b">Name</th>
            <th class="p-4 border-b">Category</th>
            <th class="p-4 border-b">Price</th>
            <th class="p-4 border-b">Stock</th>
            <th class="p-4 border-b text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition">
            <td class="p-4">
              <img :src="product.imageUrl || '/placeholder.png'" class="w-12 h-12 object-cover rounded bg-gray-200" />
            </td>
            <td class="p-4 font-medium text-gray-900">{{ product.name }}</td>
            <td class="p-4 text-gray-500">{{ product.category?.name || '-' }}</td>
            <td class="p-4 text-gray-900">Rp {{ product.price.toLocaleString('id-ID') }}</td>
            <td class="p-4">
              <span :class="product.stock < 5 ? 'text-red-500 font-bold' : 'text-green-600'">{{ product.stock }}</span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button class="text-blue-600 hover:underline text-sm">Edit</button>
              <button class="text-red-600 hover:underline text-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="products.length === 0" class="p-8 text-center text-gray-500">
        No products found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/core/api'

const products = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const loadProducts = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const res = await apiClient.getProducts(0, 100)
    products.value = res.data || []
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to load products: ${errorMessage}`
    console.error('Product loading error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>