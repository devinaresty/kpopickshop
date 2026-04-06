export type CheckoutStep = 'consumer' | 'shipping' | 'payment'

export interface ConsumerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface ShippingInfo {
  address: string
  city: string
  province: string
  postalCode: string
  country: string
}

export interface PaymentMethod {
  method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'E_WALLET' | 'QR_PAYMENT' | 'DIRECT_DEBIT'
  bankCode?: string
  walletProvider?: string
}

export interface CheckoutFormData {
  consumer: ConsumerInfo
  shipping: ShippingInfo
  payment: PaymentMethod
}

export interface CheckoutState {
  currentStep: CheckoutStep
  formData: CheckoutFormData
  isLoading: boolean
  errors: Record<string, string>
}

export interface StepStatus {
  step: CheckoutStep
  isActive: boolean
  isCompleted: boolean
  label: string
}
