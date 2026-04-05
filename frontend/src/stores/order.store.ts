import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/lib/api'

export interface Order {
  id: number
  userId: number
  items: OrderItem[]
  totalPrice: number
  totalItemPrice: number
  shippingFee: number
  status: 'WAITING_PAYMENT' | 'PAID' | 'SHIPPED' | 'CANCELLED'
  xenditInvoiceId?: string
  paymentUrl?: string
  shippingAddress: string
  shippingCity: string
  shippingProvince: string
  shippingPostalCode: string
  recipientName: string
  recipientPhone: string
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  id: number
  productId: number
  orderId: number
  quantity: number
  price: number
  product?: {
    id: number
    name: string
    image: string
    price: number
  }
}

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref<Order | null>(null)
  const orders = ref<Order[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasActiveOrder = computed(() => currentOrder.value !== null)

  const createOrder = async (payload: any) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await apiClient.createOrder(payload)
      currentOrder.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to create order'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getOrderById = async (orderId: number) => {
    isLoading.value = true
    error.value = null
    try {
      const currentOrder = await apiClient.getOrderById(orderId)
      currentOrder.value = currentOrder
      return currentOrder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch order'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getUserOrders = async () => {
    isLoading.value = true
    error.value = null
    try {
      const allOrders = await apiClient.getAllOrders()
      orders.value = allOrders
      return allOrders
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createPayment = async (orderId: number, paymentMethod?: any) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await apiClient.createPayment(orderId, paymentMethod)
      return data
    } catch (err: any) {
      // Handle both API errors and generic errors
      error.value = err.response?.data?.message || err.message || 'Failed to create payment'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setCurrentOrder = (order: Order) => {
    currentOrder.value = order
  }

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  return {
    currentOrder,
    orders,
    isLoading,
    error,

    hasActiveOrder,

    createOrder,
    getOrderById,
    getUserOrders,
    createPayment,
    setCurrentOrder,
    clearCurrentOrder,
  }
})
