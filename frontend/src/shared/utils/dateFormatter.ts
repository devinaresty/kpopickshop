/**
 * Date Formatter Utility
 * Centralized date formatting untuk seluruh aplikasi
 * Format: DD/MM/YYYY HH:mm:ss
 */

/**
 * Format date ke format lokal Indonesia dengan waktu
 * @param value - Date dalam berbagai format (string, Date object, atau timestamp)
 * @param includeTime - Include jam:menit:detik (default: true)
 * @returns String format DD/MM/YYYY atau DD/MM/YYYY HH:mm:ss
 */
export const formatDateTime = (
  value: string | Date | number | null | undefined,
  includeTime: boolean = true
): string => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '-'
  }

  // Handle empty object
  if (typeof value === 'object' && !(value instanceof Date) && Object.keys(value).length === 0) {
    return '-'
  }

  // Handle empty string
  if (typeof value === 'string' && value.trim() === '') {
    return '-'
  }

  try {
    // Convert to Date object
    let date: Date
    
    if (value instanceof Date) {
      date = value
    } else if (typeof value === 'string') {
      date = new Date(value)
    } else if (typeof value === 'number') {
      date = new Date(value)
    } else {
      return '-'
    }

    // Validate date
    if (isNaN(date.getTime())) {
      return '-'
    }

    // Format date parts
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    let result = `${day}/${month}/${year}`

    // Add time if requested
    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      result += ` ${hours}:${minutes}:${seconds}`
    }

    return result
  } catch (error) {
    console.warn('Error formatting date:', error)
    return '-'
  }
}

/**
 * Format date hanya tanggal (tanpa waktu)
 * @param value - Date dalam berbagai format
 * @returns String format DD/MM/YYYY
 */
export const formatDate = (value: string | Date | number | null | undefined): string => {
  return formatDateTime(value, false)
}

/**
 * Format date dengan waktu (alias untuk formatDateTime dengan default)
 * @param value - Date dalam berbagai format
 * @returns String format DD/MM/YYYY HH:mm:ss
 */
export const formatDateWithTime = (value: string | Date | number | null | undefined): string => {
  return formatDateTime(value, true)
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * Berguna untuk recent orders/activities
 * @param value - Date dalam berbagai format
 * @returns String format relative time
 */
export const formatRelativeTime = (value: string | Date | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  try {
    let date: Date

    if (value instanceof Date) {
      date = value
    } else {
      date = new Date(value)
    }

    if (isNaN(date.getTime())) {
      return '-'
    }

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) {
      return 'just now'
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    } else {
      // Fallback ke format DD/MM/YYYY HH:mm:ss
      return formatDateTime(value, true)
    }
  } catch (error) {
    console.warn('Error formatting relative time:', error)
    return '-'
  }
}

/**
 * Export all formatters sebagai object untuk convenience import
 */
export default {
  formatDateTime,
  formatDate,
  formatDateWithTime,
  formatRelativeTime
}
