<template>
  <div class="mb-4">
    <div class="flex items-center justify-between gap-1">
      <!-- Consumer Info -->
      <button
        @click="goToStep('consumer')"
        :class="[
          'flex flex-col items-center cursor-pointer transition flex-1',
          isStepActive('consumer') ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        ]"
      >
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center mb-1 transition text-sm',
            isStepActive('consumer')
              ? 'bg-black text-white'
              : isStepCompleted('consumer')
              ? 'bg-gray-300 text-white'
              : 'bg-gray-200 text-gray-600'
          ]"
        >
          <span v-if="isStepCompleted('consumer') && !isStepActive('consumer')" class="text-xs">✓</span>
          <span v-else class="text-xs font-semibold">1</span>
        </div>
        <span :class="['text-xs', isStepActive('consumer') ? 'text-black font-semibold' : 'text-gray-600']"
          >Consumer
        </span>
      </button>

      <!-- Line 1 -->
      <div
        :class="[
          'flex-1 h-0.5 transition',
          isStepCompleted('consumer') ? 'bg-black' : 'bg-gray-200'
        ]"
      ></div>

      <!-- Shipping -->
      <button
        @click="goToStep('shipping')"
        :class="[
          'flex flex-col items-center cursor-pointer transition flex-1',
          isStepActive('shipping') ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        ]"
      >
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center mb-1 transition text-sm',
            isStepActive('shipping')
              ? 'bg-black text-white'
              : isStepCompleted('shipping')
              ? 'bg-gray-300 text-white'
              : 'bg-gray-200 text-gray-600'
          ]"
        >
          <span v-if="isStepCompleted('shipping') && !isStepActive('shipping')" class="text-xs">✓</span>
          <span v-else class="text-xs font-semibold">2</span>
        </div>
        <span :class="['text-xs', isStepActive('shipping') ? 'text-black font-semibold' : 'text-gray-600']"
          >Shipping
        </span>
      </button>

      <!-- Line 2 -->
      <div
        :class="[
          'flex-1 h-0.5 transition',
          isStepCompleted('shipping') ? 'bg-black' : 'bg-gray-200'
        ]"
      ></div>

      <!-- Payment -->
      <button
        @click="goToStep('payment')"
        :class="[
          'flex flex-col items-center cursor-pointer transition flex-1',
          isStepActive('payment') ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        ]"
      >
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center mb-1 transition text-sm',
            isStepActive('payment')
              ? 'bg-black text-white'
              : isStepCompleted('payment')
              ? 'bg-gray-300 text-white'
              : 'bg-gray-200 text-gray-600'
          ]"
        >
          <span v-if="isStepCompleted('payment') && !isStepActive('payment')" class="text-xs">✓</span>
          <span v-else class="text-xs font-semibold">3</span>
        </div>
        <span :class="['text-xs', isStepActive('payment') ? 'text-black font-semibold' : 'text-gray-600']"
          >Payment
        </span>
      </button>

      <!-- Line 3 -->
      <div
        :class="[
          'flex-1 h-0.5 transition',
          isStepCompleted('payment') ? 'bg-black' : 'bg-gray-200'
        ]"
      ></div>

      <!-- Review -->
      <button
        @click="goToStep('review')"
        :class="[
          'flex flex-col items-center cursor-pointer transition flex-1',
          isStepActive('review') ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        ]"
      >
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center mb-1 transition text-sm',
            isStepActive('review')
              ? 'bg-black text-white'
              : isStepCompleted('review')
              ? 'bg-gray-300 text-white'
              : 'bg-gray-200 text-gray-600'
          ]"
        >
          <span v-if="isStepCompleted('review') && !isStepActive('review')" class="text-xs">✓</span>
          <span v-else class="text-xs font-semibold">4</span>
        </div>
        <span :class="['text-xs', isStepActive('review') ? 'text-black font-semibold' : 'text-gray-600']"
          >Review
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '@/stores/checkout.store'
import type { CheckoutStep } from '@/modules/checkout/types'

const checkoutStore = useCheckoutStore()

const isStepActive = (step: CheckoutStep): boolean => {
  return checkoutStore.currentStep === step
}

const isStepCompleted = (step: CheckoutStep): boolean => {
  const steps: CheckoutStep[] = ['consumer', 'shipping', 'payment', 'review']
  const currentIndex = steps.indexOf(checkoutStore.currentStep)
  const stepIndex = steps.indexOf(step)

  // Step completed hanya jika sudah PINDAH ke step setelahnya (stepIndex < currentIndex)
  return stepIndex < currentIndex
}

const goToStep = (step: CheckoutStep) => {
  // Only allow navigation to completed steps or current step
  const steps: CheckoutStep[] = ['consumer', 'shipping', 'payment', 'review']
  const currentIndex = steps.indexOf(checkoutStore.currentStep)
  const stepIndex = steps.indexOf(step)

  if (stepIndex <= currentIndex) {
    checkoutStore.goToStep(step)
  }
}
</script>
