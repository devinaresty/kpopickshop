<template>
  <div>
    <AdminTopbar 
      title="Categories"
    />

    <div class="p-8">
      <div v-if="isLoading" class="flex items-center justify-center py-32">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
          <p class="mt-4 text-gray-500 font-medium">Loading categories...</p>
        </div>
      </div>

      <div v-else-if="error" class="p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
        <p class="text-red-800 font-semibold mb-2">Failed to load categories</p>
        <p class="text-red-700 text-sm mb-4">{{ error }}</p>
        <button @click="loadCategories" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
          Try Again
        </button>
      </div>

      <div v-else>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Add Category Section -->
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 class="text-base font-bold text-gray-900">Category List</h2>
            <button @click="openAddCategoryModal" class="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-250 disabled:opacity-50 shadow-md" :disabled="isLoading">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add Category
            </button>
          </div>

          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr class="h-12">
                <th class="px-4 py-3 text-center">ID</th>
                <th class="px-4 py-3 text-left">Name</th>
                <th class="px-4 py-3 text-left">Description</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50 transition h-12">
                <td class="px-5 py-3 align-middle text-center text-xs text-gray-500">{{ category.id }}</td>
                <td class="px-5 py-3 align-middle text-xs font-medium text-gray-900">{{ category.name }}</td>
                <td class="px-5 py-3 align-middle text-xs text-gray-600">{{ category.description || '-' }}</td>
                <td class="px-5 py-3 align-middle text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button @click="openEditCategoryModal(category)" class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300">
                      Edit
                    </button>
                    <button @click="openDeleteConfirm(category.id, category.name)" :disabled="isSaving" class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 disabled:opacity-50">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="categories.length === 0" class="p-8 text-center text-gray-500">
            No categories found
          </div>

          <div v-if="categories.length > 0" class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
            <div class="text-sm text-gray-600">
              Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, categories.length) }} of {{ categories.length }} categories
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="previousPage" 
                :disabled="currentPage === 1"
                class="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="text-sm font-medium text-gray-700 px-2">Page {{ currentPage }} of {{ totalPages }}</span>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">{{ isEditMode ? 'Edit Category' : 'Add Category' }}</h3>
          <button @click="closeCategoryModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-1">Category Name *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="Enter category name" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 mb-1">Description</label>
            <textarea 
              v-model="formData.description" 
              placeholder="Enter category description" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button 
            @click="closeCategoryModal" 
            class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="submitCategoryForm" 
            :disabled="isSaving"
            class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {{ isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Delete Category</h3>
        </div>

        <div class="p-6">
          <p class="text-gray-700 text-sm">
            Are you sure you want to delete <span class="font-semibold">{{ categoryToDelete.name }}</span>? This action cannot be undone.
          </p>
        </div>

        <div class="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button 
            @click="closeDeleteConfirm" 
            :disabled="isSaving"
            class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete" 
            :disabled="isSaving"
            class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {{ isSaving ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '@/core/api'
import AdminTopbar from '@/modules/admin/components/AdminTopbar.vue'

const categories = ref<any[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)

const showCategoryModal = ref(false)
const isEditMode = ref(false)

const showDeleteConfirm = ref(false)
const categoryToDelete = ref<{ id: string; name: string }>({ id: '', name: '' })

const currentPage = ref(1)
const itemsPerPage = ref(10)

const formData = ref<any>({
  name: '',
  description: ''
})

const totalPages = computed(() => {
  return Math.ceil(categories.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value
})

const paginatedCategories = computed(() => {
  return categories.value.slice(startIndex.value, endIndex.value)
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

const openAddCategoryModal = () => {
  isEditMode.value = false
  formData.value = {
    name: '',
    description: ''
  }
  showCategoryModal.value = true
}

const openEditCategoryModal = (category: any) => {
  isEditMode.value = true
  formData.value = {
    name: category.name,
    description: category.description || ''
  }
  ;(formData.value as any).id = category.id
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  formData.value = {
    name: '',
    description: ''
  }
}

const openDeleteConfirm = (categoryId: string, categoryName: string) => {
  categoryToDelete.value = { id: categoryId, name: categoryName }
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  categoryToDelete.value = { id: '', name: '' }
}

const submitCategoryForm = async () => {
  if (!formData.value.name || formData.value.name.trim().length < 3) {
    error.value = 'Category name must be at least 3 characters'
    return
  }

  // Auto-generate slug from name
  const slug = formData.value.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)

  if (slug.length < 3) {
    error.value = 'Category name must contain at least 3 valid characters'
    return
  }

  isSaving.value = true
  error.value = null

  try {
    if (isEditMode.value) {
      // Update category
      const categoryId = (formData.value as any).id
      await apiClient.updateCategory(categoryId, {
        name: formData.value.name,
        slug: slug,
        description: formData.value.description
      })
    } else {
      await apiClient.createCategory({
        name: formData.value.name,
        slug: slug,
        description: formData.value.description
      })
    }

    await loadCategories()
    closeCategoryModal()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to ${isEditMode.value ? 'update' : 'create'} category: ${errorMessage}`
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = async () => {
  if (!categoryToDelete.value.id) {
    return
  }

  isSaving.value = true
  error.value = null

  try {
    await apiClient.deleteCategory(categoryToDelete.value.id)
    await loadCategories()
    closeDeleteConfirm()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to delete category: ${errorMessage}`
    console.error('Category delete error:', err)
  } finally {
    isSaving.value = false
  }
}

const loadCategories = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const res = await apiClient.getCategories()
    categories.value = res || []
    currentPage.value = 1
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Failed to load categories: ${errorMessage}`
    console.error('Category loading error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>
