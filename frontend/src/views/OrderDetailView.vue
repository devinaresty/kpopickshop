<template>
  <div class="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>

      <div v-else-if="errorMessage" class="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p class="font-semibold mb-2">{{ errorMessage }}</p>
        <router-link to="/profile" class="text-sm underline hover:no-underline">Back to Profile</router-link>
      </div>

      <div v-else-if="order" class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-black mb-1">Order Details</h1>
              <p class="text-gray-600">Order #{{ order.id }}</p>
            </div>
            <span
              class="px-4 py-2 rounded-full text-sm font-bold"
              :class="{
                'bg-yellow-100 text-yellow-800': order.status === 'WAITING_PAYMENT',
                'bg-blue-100 text-blue-800': order.status === 'PAID',
                'bg-purple-100 text-purple-800': order.status === 'PROCESSING',
                'bg-orange-100 text-orange-800': order.status === 'SHIPPED',
                'bg-green-100 text-green-800': order.status === 'COMPLETED',
                'bg-red-100 text-red-800': order.status === 'CANCELLED',
              }"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p class="text-sm text-gray-600 mb-1">Order Date</p>
              <p class="font-semibold text-gray-900">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Amount</p>
              <p class="font-semibold text-gray-900">{{ formatCurrency(order.totalPrice) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Payment Method</p>
              <p class="font-semibold text-gray-900">{{ order.paymentMethod || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Items</p>
              <p class="font-semibold text-gray-900">{{ order.items?.length || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
          <h2 class="text-xl font-bold text-black mb-4">Order Items</h2>
          <div class="space-y-4">
            <div v-if="order.items && order.items.length > 0">
              <div v-for="item in order.items" :key="item.id" class="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                <img
                  v-if="item.product?.imageUrl"
                  :src="item.product.imageUrl"
                  :alt="item.product?.name"
                  class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-gray-100"
                />
                <div v-else class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span class="text-gray-500 text-sm">No image</span>
                </div>
                
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 mb-1">{{ item.product?.name || 'Product' }}</p>
                  <p class="text-sm text-gray-600 mb-2">Quantity: {{ item.quantity }}</p>
                  <div class="flex justify-between items-center">
                    <p class="text-sm text-gray-600">{{ formatCurrency(item.product?.price || 0) }} each</p>
                    <p class="font-semibold text-gray-900">{{ formatCurrency((item.product?.price || 0) * item.quantity) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-600">
              No items in this order
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
          <h2 class="text-xl font-bold text-black mb-4">Shipping Address</h2>
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-600 mb-1">Recipient Name</p>
              <p class="font-semibold text-gray-900">{{ order.recipientName || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Address</p>
              <p class="text-gray-900">{{ order.shippingAddress || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Phone Number</p>
              <p class="font-semibold text-gray-900">{{ order.recipientPhone || '-' }}</p>
            </div>
            <div v-if="order.shippingCity || order.shippingProvince || order.shippingPostalCode">
              <p class="text-sm text-gray-600 mb-1">Location Details</p>
              <p class="text-gray-900">
                <span v-if="order.shippingCity">{{ order.shippingCity }}</span>
                <span v-if="order.shippingCity && order.shippingProvince">, </span>
                <span v-if="order.shippingProvince">{{ order.shippingProvince }}</span>
                <span v-if="order.shippingPostalCode"> {{ order.shippingPostalCode }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
          <h2 class="text-xl font-bold text-black mb-4">Order Summary</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Shipping Fee</span>
              <span>{{ formatCurrency(shippingFee) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Tax (10%)</span>
              <span>{{ formatCurrency(tax) }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200 flex justify-between">
              <span class="font-semibold text-gray-900">Total</span>
              <span class="text-lg font-bold text-black">{{ formatCurrency(order.totalPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <router-link
            to="/profile"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
          >
            Back to Profile
          </router-link>
          <router-link
            to="/home"
            class="flex-1 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition text-center"
          >
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiClient } from '@/core/api'
import Footer from '@/modules/landing/components/shared/Footer.vue'

interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product?: {
    id: number
    name: string
    price: number
    imageUrl?: string
  }
}

interface Order {
  id: number
  userId: number
  totalPrice: number
  status: string
  recipientName?: string
  recipientPhone?: string
  shippingAddress?: string
  shippingCity?: string
  shippingProvince?: string
  shippingPostalCode?: string
  shippingDetail?: string
  paymentMethod?: string
  items?: OrderItem[]
  createdAt: string
  updatedAt: string
  metadata?: string
}

const route = useRoute()
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const order = ref<Order | null>(null)
const shippingFee = ref(0)

const subtotal = computed(() => {
  if (!order.value?.items) return 0
  return order.value.items.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0)
})

const tax = computed(() => {
  return Math.round(subtotal.value * 0.1)
})

const loadOrder = async () => {
  const orderId = route.params.id as string
  
  if (!orderId) {
    errorMessage.value = 'Order ID not provided'
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    const data = await apiClient.getOrderById(orderId)
    
    data.recipientName = data.recipientName || '-'
    data.recipientPhone = data.recipientPhone || '-'
    data.shippingAddress = data.shippingAddress || '-'
    
    if (data.metadata && typeof data.metadata === 'string') {
      try {
        const metadata = JSON.parse(data.metadata)
        data.recipientName = metadata.recipientName || data.recipientName
        data.recipientPhone = metadata.recipientPhone || data.recipientPhone
        data.shippingAddress = metadata.shippingAddress || data.shippingAddress
        data.shippingCity = metadata.shippingCity || data.shippingCity
        data.shippingProvince = metadata.shippingProvince || data.shippingProvince
        data.shippingPostalCode = metadata.shippingPostalCode || data.shippingPostalCode
        data.shippingDetail = metadata.shippingDetail || data.shippingDetail
        shippingFee.value = metadata.shippingFee || 15000
      } catch (e) {
        console.error('Failed to parse metadata:', e)
        shippingFee.value = 15000
      }
    } else {
      shippingFee.value = 15000
    }
    
    order.value = data
  } catch (err: any) {
    console.error('Failed to load order:', err)
    errorMessage.value = err.message || 'Failed to load order details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'WAITING_PAYMENT': 'Waiting for Payment',
    'PAID': 'Paid',
    'PROCESSING': 'Processing',
    'SHIPPED': 'Shipped',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
  }
  return statusMap[status] || status
}

onMounted(() => {
  loadOrder()
})
</script>
