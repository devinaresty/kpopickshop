<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-black text-black mb-2">Checkout</h1>
        <p class="text-gray-600">Complete your purchase securely</p>
      </div>

      <!-- Step Indicator -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content (Steps) -->
        <div class="lg:col-span-2">
          <div class="bg-white border border-gray-200 rounded-lg p-8">
            <!-- Step Indicator Inside Container -->
            <div class="mb-6 pb-6 border-b border-gray-200">
              <CheckoutStepIndicator />
            </div>

            <!-- Consumer Info Step -->
            <div v-if="checkoutStore.currentStep === 'consumer'">
              <h2 class="text-2xl font-bold text-black mb-6">Consumer Information</h2>
              <ConsumerInfoStep />
            </div>

            <!-- Shipping Step -->
            <div v-else-if="checkoutStore.currentStep === 'shipping'">
              <h2 class="text-2xl font-bold text-black mb-6">Shipping Address</h2>
              <ShippingStep />
            </div>

            <!-- Payment Method Step -->
            <div v-else-if="checkoutStore.currentStep === 'payment'">
              <h2 class="text-2xl font-bold text-black mb-6">Payment Method</h2>
              <PaymentMethodStep />
            </div>

            <!-- Review Step -->
            <div v-else-if="checkoutStore.currentStep === 'review'">
              <h2 class="text-2xl font-bold text-black mb-6">Review Your Order</h2>
              <ReviewStep ref="reviewStepRef" />
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 mt-8 pt-8 border-t border-gray-200">
              <!-- Back Button -->
              <button
                v-if="checkoutStore.currentStep !== 'consumer'"
                @click="handlePrevious"
                class="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>

              <!-- Next / Pay Now Button -->
              <button
                v-if="checkoutStore.currentStep !== 'review'"
                @click="handleNext"
                :disabled="!canProceed"
                class="ml-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>

              <button
                v-else
                @click="handlePayment"
                :disabled="isProcessing || !reviewStepRef?.agreeTerms"
                class="ml-auto px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="isProcessing" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isProcessing ? 'Processing...' : 'Pay Now Rp ' + formatPrice(orderTotal) }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div>
          <CheckoutOrderSummary />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout.store'
import { useCartStore } from '@/stores/cart.store'
import { useOrderStore } from '@/stores/order.store'
import { useAuthStore } from '@/stores/auth.store'
import CheckoutStepIndicator from '@/components/checkout/CheckoutStepIndicator.vue'
import ConsumerInfoStep from '@/components/checkout/steps/ConsumerInfoStep.vue'
import ShippingStep from '@/components/checkout/steps/ShippingStep.vue'
import PaymentMethodStep from '@/components/checkout/steps/PaymentMethodStep.vue'
import ReviewStep from '@/components/checkout/steps/ReviewStep.vue'
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary.vue'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const authStore = useAuthStore()
const reviewStepRef = ref<InstanceType<typeof ReviewStep> | null>(null)
const isProcessing = ref(false)

// Check auth on mount
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (cartStore.items.length === 0) {
    router.push('/cart')
  }
})

// Computed
const canProceed = computed(() => {
  if (checkoutStore.currentStep === 'consumer') {
    return checkoutStore.isConsumerComplete
  } else if (checkoutStore.currentStep === 'shipping') {
    return checkoutStore.isShippingComplete
  } else if (checkoutStore.currentStep === 'payment') {
    return checkoutStore.isPaymentComplete
  }
  return true
})

const orderTotal = computed(() => {
  const subtotal = cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = 10000
  const tax = Math.round(subtotal * 0.1)
  return subtotal + shippingFee + tax
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Methods
const handleNext = () => {
  if (canProceed.value) {
    checkoutStore.goToNextStep()
  }
}

const handlePrevious = () => {
  checkoutStore.goToPreviousStep()
}

const handlePayment = async () => {
  // Validate terms agreement
  if (!reviewStepRef.value?.agreeTerms) {
    alert('Please agree to terms and conditions')
    return
  }

  isProcessing.value = true

  try {
    // 1. Create order with checkout data
    const checkoutData = checkoutStore.getFormData()
    const cartItems = cartStore.items

    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: checkoutData.shipping.address,
      shippingCity: checkoutData.shipping.city,
      shippingProvince: checkoutData.shipping.province,
      shippingPostalCode: checkoutData.shipping.postalCode,
      recipientName: `${checkoutData.consumer.firstName} ${checkoutData.consumer.lastName}`,
      recipientPhone: checkoutData.consumer.phone,
    }

    // 2. Create order
    const createdOrder = await orderStore.createOrder(orderPayload)

    // 3. Create payment invitation
    const paymentResponse = await orderStore.createPayment(createdOrder.id)

    // 4. Redirect to Xendit payment page
    if (paymentResponse.invoiceUrl) {
      window.location.href = paymentResponse.invoiceUrl
    } else {
      throw new Error('No payment URL received')
    }
  } catch (error: any) {
    console.error('Payment error:', error)
    alert(error.response?.data?.message || 'Failed to process payment. Please try again.')
  } finally {
    isProcessing.value = false
  }
}
</script>
