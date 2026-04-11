/**
 * Shipping & Tax Configuration
 * Centralized configuration untuk shipping fee dan tax rate
 * Bisa di-update dari backend/API di masa depan
 */

/**
 * Shipping Fee Configuration
 * Dalam Rupiah
 */
export const SHIPPING_CONFIG = {
  // Default shipping fee untuk area lokal
  default: 0,  // Rp 0 - tanpa biaya pengiriman untuk sekarang
  
  // Bisa di-expand untuk regional shipping:
  // regional: {
  //   jakarta: 10000,
  //   surabaya: 15000,
  //   bandung: 12000,
  // }
}

/**
 * Tax Configuration
 * Dalam persentase (0-100)
 */
export const TAX_CONFIG = {
  // Default tax rate: 0% (tanpa pajak untuk sekarang)
  rate: 0,  // 0% = tidak ada pajak
  
  // Catatan: Bisa di-update ke:
  // rate: 10 untuk 10%
  // rate: 5 untuk 5%
  // sesuai kebijakan bisnis
}

/**
 * Helper function untuk mendapatkan shipping fee
 * @param region - Opsional: region untuk menghitung shipping (bisa dari checkout store)
 * @returns Shipping fee dalam Rupiah
 */
export const getShippingFee = (region?: string): number => {
  if (region && SHIPPING_CONFIG[region as keyof typeof SHIPPING_CONFIG]) {
    return SHIPPING_CONFIG[region as keyof typeof SHIPPING_CONFIG]
  }
  return SHIPPING_CONFIG.default
}

/**
 * Helper function untuk menghitung tax
 * @param subtotal - Total harga sebelum pajak
 * @returns Tax amount dalam Rupiah
 */
export const calculateTax = (subtotal: number): number => {
  return Math.round((subtotal * TAX_CONFIG.rate) / 100)
}

/**
 * Helper function untuk menghitung total
 * @param subtotal - Total harga produk
 * @param shippingFee - Biaya pengiriman (opsional)
 * @param taxAmount - Jumlah pajak (opsional)
 * @returns Total amount
 */
export const calculateTotal = (
  subtotal: number,
  shippingFee: number = getShippingFee(),
  taxAmount?: number
): number => {
  const tax = taxAmount !== undefined ? taxAmount : calculateTax(subtotal)
  return subtotal + shippingFee + tax
}

/**
 * Export default untuk convenience
 */
export default {
  SHIPPING_CONFIG,
  TAX_CONFIG,
  getShippingFee,
  calculateTax,
  calculateTotal,
}
