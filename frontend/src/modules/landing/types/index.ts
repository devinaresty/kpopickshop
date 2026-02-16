
export interface Product {
  id: string | number
  name: string                    // Nama produk (yang di DB)
  description?: string            // Deskripsi
  price: number                   // Harga
  stock: number                   // Jumlah stok
  imageUrl: string               // URL gambar (yang di DB)
  category?: string              // Kategori
  artist?: string                // Artist/Brand
  badge?: string                 // Label: 'Hot', 'New', 'Sale', 'Rare'
  rating?: number                // Rating 1-5
  sold?: number                  // Terjual (untuk tracking)
  createdAt?: string             // Tanggal dibuat
  updatedAt?: string             // Tanggal update
  isFlashSale?: boolean          // Flag untuk Flash Sale
  discountPercentage?: number    // Persentase diskon (0-100)
}

/**
 * FEATURED PRODUCT (untuk HeroSection)
 * Subset dari Product dengan field minimal
 */
export interface FeaturedProduct extends Omit<Product, 'description' | 'category'> {
  badge: string  // Badge wajib untuk featured
}

/**
 * CART ITEM
 */
export interface CartItem extends Product {
  quantity: number
  selectedVariant?: string
}

/**
 * API RESPONSE
 */
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
