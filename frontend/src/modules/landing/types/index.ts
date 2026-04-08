
export interface Product {
  id: string | number
  name: string                   
  description?: string            
  price: number                   
  stock: number                   
  imageUrl: string               
  category?: string              
  artist?: string                
  badge?: string                 
  rating?: number                
  sold?: number                  
  createdAt?: string             
  updatedAt?: string             
  isFlashSale?: boolean          
  discountPercentage?: number    
}

export interface FeaturedProduct extends Omit<Product, 'description' | 'category'> {
  badge: string 
}

export interface CartItem extends Product {
  quantity: number
  selectedVariant?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
