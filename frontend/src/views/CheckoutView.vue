<template>
  <div class="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <div class="mb-6">
              <h1 class="text-lg sm:text-2xl font-bold text-black mb-1">{{ i18nStore.t('pages.checkout') }}</h1>
              <p class="text-gray-600 text-xs sm:text-sm">{{ i18nStore.t('pages.checkoutSubtitle') }}</p>
            </div>

            <div class="mb-6 pb-6 border-b border-gray-200">
              <CheckoutStepIndicator 
                :active-step="checkoutStore.currentStep"
                :completed-steps="completedSteps"
                :steps="checkoutSteps"
                @step-change="handleStepChange"
              />
            </div>

            <div v-if="checkoutStore.currentStep === 'consumer'">
              <h2 class="text-xl sm:text-2xl font-bold text-black mb-6">{{ i18nStore.t('checkout.consumerInfo') }}</h2>
              <ConsumerInfoStep 
                :is-submitting="isProcessing"
                @continue="handleConsumerContinue()"
              />
            </div>

            <div v-else-if="checkoutStore.currentStep === 'shipping'">
              <h2 class="text-xl sm:text-2xl font-bold text-black mb-6">{{ i18nStore.t('checkout.shippingAddress') }}</h2>
              <ShippingStep 
                :is-submitting="isProcessing"
                @continue="handleShippingContinue()"
              />
            </div>

            <div v-else-if="checkoutStore.currentStep === 'payment'">
              <h2 class="text-xl sm:text-2xl font-bold text-black mb-6">{{ i18nStore.t('checkout.paymentMethod') }}</h2>
              <PaymentMethodStep 
                ref="paymentStepRef"
                :is-submitting="isProcessing"
                @continue="handlePaymentContinue()"
              />
            </div>

            <div class="flex gap-4 mt-8 pt-8 border-t border-gray-200">
              <button
                v-if="checkoutStore.currentStep !== 'consumer'"
                @click="handlePrevious"
                class="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                {{ i18nStore.t('buttons.back') }}
              </button>

              <button
                v-if="checkoutStore.currentStep !== 'payment'"
                @click="handleNext"
                :disabled="!canProceed"
                class="ml-auto px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ i18nStore.t('buttons.next') }}
              </button>

              <button
                v-else
                @click="handlePayment"
                :disabled="isProcessing || !paymentStepRef?.agreeTerms"
                class="ml-auto px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="isProcessing" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isProcessing ? i18nStore.t('checkout.processing') : i18nStore.t('checkout.payNow') + formatPrice(orderTotal) }}</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <CheckoutOrderSummary 
            :summary-data="orderSummary"
            :item-count="cartStore.items.length"
            :is-complete="isCheckoutComplete"
            :is-processing="isProcessing"
            @proceed="handleOrderSummaryProceed"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore, useCartStore, useOrderStore, useAuthStore, useI18nStore } from '@/shared/stores'
import { getShippingFee, calculateTax } from '@/shared/config/shippingAndTax'
import CheckoutStepIndicator from '@/modules/checkout/components/CheckoutStepIndicator.vue'
import ConsumerInfoStep from '@/modules/checkout/components/steps/ConsumerInfoStep.vue'
import ShippingStep from '@/modules/checkout/components/steps/ShippingStep.vue'
import PaymentMethodStep from '@/modules/checkout/components/steps/PaymentMethodStep.vue'
import CheckoutOrderSummary from '@/modules/checkout/components/CheckoutOrderSummary.vue'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const authStore = useAuthStore()
const i18nStore = useI18nStore()
const isProcessing = ref(false)
const paymentStepRef = ref<any>(null)

// Checkout steps definition
const checkoutSteps = [
  { id: 'consumer', label: 'Consumer Info' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
]

const completedSteps = computed(() => {
  const completed: string[] = []
  
  if (checkoutStore.consumer.firstName && checkoutStore.consumer.email) {
    completed.push('consumer')
  }
  if (checkoutStore.shipping.address) {
    completed.push('shipping')
  }
  if (checkoutStore.payment.method) {
    completed.push('payment')
  }
  
  return completed
})

const orderSummary = computed(() => {
  const subtotal = cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = getShippingFee()
  const tax = calculateTax(subtotal)
  const discount = 0
  
  return {
    subtotal,
    shippingCost,
    discount,
    tax,
    total: subtotal + shippingCost + tax - discount,
  }
})

const isCheckoutComplete = computed(() => {
  return (
    checkoutStore.consumer.firstName &&
    checkoutStore.consumer.email &&
    checkoutStore.shipping.address &&
    checkoutStore.payment.method
  )
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (cartStore.items.length === 0) {
    router.push('/home')
    return
  }

})

const canProceed = computed(() => {
  if (checkoutStore.currentStep === 'consumer') {
    return checkoutStore.consumer.firstName && checkoutStore.consumer.email && checkoutStore.consumer.phone
  } else if (checkoutStore.currentStep === 'shipping') {
    return checkoutStore.shipping.address && checkoutStore.shipping.address.length > 0
  } else if (checkoutStore.currentStep === 'payment') {
    return checkoutStore.payment.method && checkoutStore.payment.method.length > 0
  }
  return true
})

const orderTotal = computed(() => {
  const subtotal = cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = getShippingFee()
  const tax = calculateTax(subtotal)
  return subtotal + shippingFee + tax
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const handleStepChange = (stepId: string) => {
  const currentIndex = checkoutSteps.findIndex(s => s.id === checkoutStore.currentStep)
  const targetIndex = checkoutSteps.findIndex(s => s.id === stepId)
  
  const stepsToGoBack = currentIndex - targetIndex
  
  if (stepsToGoBack > 0) {
    for (let i = 0; i < stepsToGoBack; i++) {
      checkoutStore.goToPreviousStep()
    }
  }
}

const handleNext = () => {
  checkoutStore.goToNextStep()
}

const handlePrevious = () => {
  checkoutStore.goToPreviousStep()
}

const handleConsumerContinue = () => {
  checkoutStore.goToNextStep()
}

const handleShippingContinue = () => {
  checkoutStore.goToNextStep()
}

const handlePaymentContinue = () => {
  checkoutStore.goToNextStep()
}

const handleOrderSummaryProceed = () => {
  if (isCheckoutComplete.value) {
    checkoutStore.goToNextStep()
  }
}

const handlePayment = async () => {
  if (!paymentStepRef.value?.agreeTerms) {
    alert('Silakan setujui syarat dan ketentuan')
    return
  }

  if (!isCheckoutComplete.value) {
    alert('Silakan lengkapi semua langkah checkout')
    return
  }

  isProcessing.value = true

  try {
    // Step 1: Create order dengan field names yang benar
    const orderPayload = {
      items: cartStore.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      recipientName: `${checkoutStore.consumer.firstName} ${checkoutStore.consumer.lastName}`,
      recipientPhone: checkoutStore.consumer.phone,
      shippingAddress: checkoutStore.shipping.address,
      shippingCity: '',
      shippingProvince: '',
      shippingPostalCode: '',
    }

    const createdOrder = await orderStore.createOrder(orderPayload)

    // Step 2: Create payment untuk generate Xendit invoice
    const paymentResult = await orderStore.createPayment(createdOrder.id, {
      method: checkoutStore.payment.method,
    })

    if (paymentResult?.invoiceUrl) {
      window.location.href = paymentResult.invoiceUrl
    } else {
      await router.push({
        name: 'order-detail',
        params: { id: createdOrder.id }
      })
    }
  } catch (error: any) {
    console.error('Payment error:', error)
    
    let errorMessage = 'Gagal memproses pembayaran. Silakan coba lagi.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    alert(errorMessage)
  } finally {
    isProcessing.value = false
  }
}
</script>
