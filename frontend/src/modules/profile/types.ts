export interface UserProfile {
  id: number
  email: string
  name: string
  phone?: string
  address?: string
  photoUrl?: string
  dateOfBirth?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileDto {
  name?: string
  email?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  photoUrl?: string
}

export interface ProfileFormData {
  name: string
  phone: string
  address: string
  dateOfBirth?: string
}

export interface UserAddress {
  id: number
  userId: number
  street: string
  city: string
  province: string
  postalCode: string
  phone: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: number
  userId: number
  orderId: number
  amount: number
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  paymentMethod?: string
  createdAt: string
  updatedAt: string
}
