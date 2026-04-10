<template>
  <div>
    <AdminTopbar 
      title="Products"
    />

    <div class="p-8">
      <div v-if="isLoading" class="flex items-center justify-center py-32">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-900 border-t-gray-300"></div>
        <p class="mt-6 text-gray-700 font-semibold text-lg">Loading products...</p>
      </div>
    </div>

      <div v-else-if="error" class="p-6 bg-red-50 border-l-4 border-red-600 rounded-lg mb-6 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 mt-0.5">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-red-800 font-bold">Failed to load products</p>
            <p class="text-red-700 text-sm mt-1">{{ error }}</p>
            <button @click="loadProducts" class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold text-sm">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 class="text-base font-bold text-gray-900">Product List</h2>
              <p class="text-xs text-gray-500 mt-0.5">Manage and organize your products</p>
            </div>
            <button @click="openAddProductModal" class="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-250 disabled:opacity-50 shadow-md" :disabled="isLoading">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add Product
            </button>
          </div>

        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-widest border-b border-gray-200">
            <tr class="h-12">
              <th class="px-5 py-3 text-center">Image</th>
              <th class="px-5 py-3 text-left">Name</th>
              <th class="px-5 py-3 text-left">Category</th>
              <th class="px-5 py-3 text-left">Price</th>
              <th class="px-5 py-3 text-center">Stock</th>
              <th class="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50 transition-colors duration-150 h-18">
              <td class="px-5 py-3 flex items-center justify-center">
                <div class="flex-shrink-0">
                  <img :src="product.imageUrl || '/placeholder.png'" class="w-14 h-14 object-cover rounded-lg bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-shadow" />
                </div>
              </td>
              
              <td class="px-5 py-3 align-middle">
                <p class="font-semibold text-gray-900 text-xs line-clamp-2 max-w-xs">{{ product.name }}</p>
              </td>
              
              <td class="px-5 py-3 align-middle">
                <p class="text-gray-700 text-xs font-medium">{{ product.category?.name || '-' }}</p>
              </td>
              
              <td class="px-5 py-3 align-middle text-left">
                <p class="text-gray-900 text-xs font-bold">Rp {{ formatPrice(product.price) }}</p>
              </td>
              
              <td class="px-5 py-3 align-middle text-center">
                <span :class="[
                  'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border',
                  product.stock < 5
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-green-50 text-green-700 border-green-200'
                ]">
                  {{ product.stock }}
                </span>
              </td>
              
              <td class="px-5 py-3 align-middle text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditProductModal(product)" class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300">
                    Edit
                  </button>
                  <button @click="openDeleteConfirm(product.id, product.name)" :disabled="isSaving" class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="products.length === 0" class="py-16 px-8 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 mb-4">
            <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
            </svg>
          </div>
          <p class="text-gray-700 font-semibold text-lg">No products found</p>
          <p class="text-gray-500 text-sm mt-2">Start by clicking "Add Product" to create your first product</p>
        </div>

        <div v-if="products.length > 0" class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
          <div class="text-sm text-gray-600 font-medium">
            Showing <span class="font-bold text-gray-900">{{ startIndex + 1 }}</span> to <span class="font-bold text-gray-900">{{ Math.min(endIndex, products.length) }}</span> of <span class="font-bold text-gray-900">{{ products.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              class="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="text-sm font-bold text-gray-900 bg-gray-100 px-3.5 py-1.5 rounded-lg">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>

      <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ isEditMode ? 'Edit Product' : 'Add Product' }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ isEditMode ? 'Update product information' : 'Add a new product to your store' }}</p>
            </div>
            <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">Product Name *</label>
              <input 
                v-model="formData.name" 
                type="text" 
                placeholder="Enter product name" 
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">Description</label>
              <textarea 
                v-model="formData.description" 
                placeholder="Enter product description" 
                rows="3"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">Price (Rp) *</label>
              <input 
                :value="formData.price ? formatPriceInput(formData.price.toString()) : ''"
                @input="(e) => {
                  const target = e.target as HTMLInputElement
                  formData.price = parsePriceInput(target.value)
                  target.value = formatPriceInput(target.value)
                }"
                type="text" 
                placeholder="Enter price (e.g., 12.000.000)" 
                min="1000"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              <p class="text-xs text-gray-500 mt-1">You can type with or without dots</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">Stock *</label>
              <input 
                v-model.number="formData.stock" 
                type="number" 
                placeholder="Enter stock quantity" 
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">Category *</label>
              <select 
                v-model.number="formData.categoryId" 
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">Product Image</label>
              
              <div v-if="formData.imageUrl || imagePreview" class="mb-3 relative rounded-lg overflow-hidden border-2 border-gray-200">
                <img 
                  :src="imagePreview || formData.imageUrl" 
                  class="w-full h-32 object-cover"
                />
                <button 
                  v-if="imageFile"
                  @click="clearImage"
                  type="button"
                  class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <input 
                ref="fileInput"
                type="file" 
                accept="image/*"
                @change="onImageSelected"
                class="hidden"
              />
              <button 
                @click="() => fileInput?.click()"
                type="button"
                :disabled="isUploading"
                class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 bg-gray-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ imageFile ? 'Change Image' : 'Choose Image' }}
              </button>
              <p v-if="imageFile" class="text-xs text-gray-600 mt-2 font-medium">{{ imageFile.name }}</p>
            </div>
          </div>

          <div class="p-6 border-t border-gray-100 flex gap-3 justify-end bg-white rounded-b-2xl">
            <button 
              @click="closeProductModal" 
              class="px-5 py-2.5 border-2 border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              @click="submitProductForm" 
              :disabled="isSaving || isUploading"
              class="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 hover:shadow-lg disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
            >
              {{ isSaving || isUploading ? 'Saving...' : isEditMode ? 'Update' : 'Add' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100">
          <div class="p-6 border-b border-gray-100 rounded-t-2xl bg-gradient-to-r from-red-50 to-white">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2m0-12a9 9 0 110-18 9 9 0 0118 0z" />
                </svg>
              </div>
              Delete Product
            </h3>
          </div>

          <div class="p-6">
            <p class="text-gray-700 text-sm leading-relaxed">
              Are you sure you want to delete <span class="font-bold text-gray-900">{{ productToDelete.name }}</span>? This action cannot be undone.
            </p>
          </div>

          <div class="p-6 border-t border-gray-100 flex gap-3 justify-end bg-white rounded-b-2xl">
            <button 
              @click="closeDeleteConfirm" 
              :disabled="isSaving"
              class="px-5 py-2.5 border-2 border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete" 
              :disabled="isSaving"
              class="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 hover:shadow-lg disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
            >
              {{ isSaving ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '@/core/api'
import AdminTopbar from '@/modules/admin/components/AdminTopbar.vue'

const products = ref<any[]>([])
const categories = ref<any[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)

const showProductModal = ref(false)
const isEditMode = ref(false)

const showDeleteConfirm = ref(false)
const productToDelete = ref<{ id: string; name: string }>({ id: '', name: '' })

const currentPage = ref(1)
const itemsPerPage = ref(10)

const formData = ref<any>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
  imageUrl: ''
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value
})

const paginatedProducts = computed(() => {
  return products.value.slice(startIndex.value, endIndex.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const openAddProductModal = () => {
  isEditMode.value = false
  formData.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: ''
  }
  imageFile.value = null
  imagePreview.value = ''
  showProductModal.value = true
}

const openEditProductModal = (product: any) => {
  isEditMode.value = true
  formData.value = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId
  }
  ;(formData.value as any).id = product.id
  ;(formData.value as any).imageUrl = product.imageUrl || product.image
  imagePreview.value = product.imageUrl || product.image || ''
  imageFile.value = null
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  formData.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: ''
  }
  imageFile.value = null
  imagePreview.value = ''
}

const onImageSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    imageFile.value = file
    
    const reader = new FileReader()
    reader.onload = () => {
      imagePreview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/[\s_]+/g, '-') 
    .replace(/^-+|-+$/g, '') 
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.floor(price))
}

const formatPriceInput = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parsePriceInput = (formatted: string): number => {
  return parseInt(formatted.replace(/\D/g, ''), 10) || 0
}

const uploadImage = async (): Promise<string | null> => {
  if (!imageFile.value) {
    return (formData.value as any).imageUrl || null
  }

  isUploading.value = true
  const formDataImage = new FormData()
  formDataImage.append('file', imageFile.value)

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('ADMIN_TOKEN') || localStorage.getItem('USER_TOKEN')
    const response = await fetch(`${baseUrl}/products/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': '69420'
      },
      body: formDataImage,
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Upload failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log('Upload response:', data)
    
    if (data.data?.imageUrl) {
      return data.data.imageUrl
    } else if (data.imageUrl) {
      return data.imageUrl
    } else if (data.url) {
      return data.url
    }
    
    throw new Error('No imageUrl in response')
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    error.value = `Image upload failed: ${errorMessage}`
    console.error('Image upload error:', err)
    return null
  } finally {
    isUploading.value = false
  }
}

const submitProductForm = async () => {
  if (!formData.value.name || !formData.value.price || !formData.value.stock || !formData.value.categoryId) {
    alert('Please fill in all required fields')
    return
  }

  isSaving.value = true
  error.value = null

  try {
    if (imageFile.value) {
      const imageUrl = await uploadImage()
      if (!imageUrl) {
        return 
      }
      ;(formData.value as any).imageUrl = imageUrl
    }

    const slug = generateSlug(formData.value.name)

    if (isEditMode.value) {
      const productId = (formData.value as any).id
      await apiClient.updateProduct(productId, {
        name: formData.value.name,
        slug: slug,
        description: formData.value.description,
        price: formData.value.price,
        stock: formData.value.stock,
        categoryId: formData.value.categoryId,
        imageUrl: (formData.value as any).imageUrl,
        isPromoted: false
      })
    } else {
      await apiClient.createProduct({
        name: formData.value.name,
        slug: slug,
        description: formData.value.description,
        price: formData.value.price,
        stock: formData.value.stock,
        categoryId: formData.value.categoryId,
        imageUrl: (formData.value as any).imageUrl,
        isPromoted: false
      })
    }

    await loadProducts()
    closeProductModal()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to ${isEditMode.value ? 'update' : 'create'} product: ${errorMessage}`
    console.error('Product save error:', err)
  } finally {
    isSaving.value = false
  }
}

const openDeleteConfirm = (productId: string, productName: string) => {
  productToDelete.value = { id: productId, name: productName }
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  productToDelete.value = { id: '', name: '' }
}

const confirmDelete = async () => {
  if (!productToDelete.value.id) {
    return
  }

  isSaving.value = true
  error.value = null

  try {
    await apiClient.deleteProduct(productToDelete.value.id)
    await loadProducts()
    closeDeleteConfirm()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to delete product: ${errorMessage}`
    console.error('Product delete error:', err)
  } finally {
    isSaving.value = false
  }
}

const loadProducts = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const res = await apiClient.getProducts(0, 100)
    products.value = res.data || []
    currentPage.value = 1
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to load products: ${errorMessage}`
    console.error('Product loading error:', err)
  } finally {
    isLoading.value = false
  }
}

const loadCategories = async () => {
  try {
    const res = await apiClient.getCategories()
    categories.value = res || []
  } catch (err) {
    console.error('Category loading error:', err)
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>
