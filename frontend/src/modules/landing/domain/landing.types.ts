// Landing Domain Types
export interface Product {
  id: string
  title: string
  price: number
  image: string
  sold: number
  category: string
}

export interface Artist {
  id: string
  name: string
  genre?: string
  image?: string
  followers?: number
}

export interface LandingState {
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register'
  isOtherOptionsModalOpen: boolean
  isCartOpen: boolean
  cartItems: any[]
}
