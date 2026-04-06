import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CheckoutStep, CheckoutFormData, ConsumerInfo, ShippingInfo, PaymentMethod } from '@/modules/checkout/types'

export const useCheckoutStore = defineStore('checkout', () => {
  const currentStep = ref<CheckoutStep>('consumer')
  const isLoading = ref(false)
  const errors = ref<Record<string, string>>({})

  const consumer = ref<ConsumerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const shipping = ref<ShippingInfo>({
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Indonesia',
  })

  const payment = ref<PaymentMethod>({
    method: 'BANK_TRANSFER',
    bankCode: 'BCA',
  })

  const isConsumerComplete = computed(() => {
    return (
      consumer.value.firstName.trim() !== '' &&
      consumer.value.email.trim() !== '' &&
      consumer.value.phone.trim() !== ''
    )
  })

  const isShippingComplete = computed(() => {
    return shipping.value.address.trim() !== ''
  })

  const isPaymentComplete = computed(() => {
    return payment.value.method !== null && payment.value.method !== undefined
  })

  const goToStep = (step: CheckoutStep) => {
    currentStep.value = step
    errors.value = {} 
  }

  const goToNextStep = () => {
    const steps: CheckoutStep[] = ['consumer', 'shipping', 'payment']
    const currentIndex = steps.indexOf(currentStep.value)
    
    if (currentIndex < steps.length - 1) {
      if (validateCurrentStep()) {
        currentStep.value = steps[currentIndex + 1]!
        errors.value = {}
      }
    }
  }

  const goToPreviousStep = () => {
    const steps: CheckoutStep[] = ['consumer', 'shipping', 'payment']
    const currentIndex = steps.indexOf(currentStep.value)
    
    if (currentIndex > 0) {
      currentStep.value = steps[currentIndex - 1]!
      errors.value = {}
    }
  }

  const validateCurrentStep = (): boolean => {
    errors.value = {}

    if (currentStep.value === 'consumer') {
      if (!consumer.value.firstName.trim()) {
        errors.value['firstName'] = 'First name is required'
      }
      if (!consumer.value.email.trim()) {
        errors.value['email'] = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consumer.value.email)) {
        errors.value['email'] = 'Invalid email format'
      }
      if (!consumer.value.phone.trim()) {
        errors.value['phone'] = 'Phone is required'
      }
      return Object.keys(errors.value).length === 0
    }

    if (currentStep.value === 'shipping') {
      if (!shipping.value.address.trim()) {
        errors.value['address'] = 'Address is required'
      }
      return Object.keys(errors.value).length === 0
    }

    if (currentStep.value === 'payment') {
      if (!payment.value.method) {
        errors.value['method'] = 'Payment method is required'
      }
      return Object.keys(errors.value).length === 0
    }

    return true
  }

  const setConsumerInfo = (data: Partial<ConsumerInfo>) => {
    consumer.value = { ...consumer.value, ...data }
  }

  const setShippingInfo = (data: Partial<ShippingInfo>) => {
    shipping.value = { ...shipping.value, ...data }
  }

  const setPaymentMethod = (method: PaymentMethod) => {
    payment.value = method
  }

  const getFormData = (): CheckoutFormData => {
    return {
      consumer: consumer.value,
      shipping: shipping.value,
      payment: payment.value,
    }
  }

  const resetCheckout = () => {
    currentStep.value = 'consumer'
    consumer.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
    shipping.value = {
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Indonesia',
    }
    payment.value = {
      method: 'BANK_TRANSFER',
      bankCode: 'BCA',
    }
    errors.value = {}
    isLoading.value = false
  }

  return {
    currentStep,
    isLoading,
    errors,
    consumer,
    shipping,
    payment,

    isConsumerComplete,
    isShippingComplete,
    isPaymentComplete,

    goToStep,
    goToNextStep,
    goToPreviousStep,
    validateCurrentStep,
    setConsumerInfo,
    setShippingInfo,
    setPaymentMethod,
    getFormData,
    resetCheckout,
  }
})
