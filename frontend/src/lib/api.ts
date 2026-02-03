// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  user: {
    id: number
    email: string
    name: string
    phone?: string
    address?: string
    createdAt: string
    updatedAt: string
  }
}

interface ApiErrorResponse {
  statusCode: number
  message: string
  error: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add token jika ada
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Merge dengan options headers
    if (options?.headers && typeof options.headers === 'object') {
      Object.assign(headers, options.headers)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = (await response.json()) as ApiErrorResponse
      console.error('API Error:', { status: response.status, error }) // DEBUG
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const data = await response.json() as T
    console.log('API Response:', { endpoint, data }) // DEBUG
    return data
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async register(data: any): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/auth/me', {
      method: 'GET',
    })
  }

  async getCategories(): Promise<any[]> {
    return this.request<any[]>('/categories', {
      method: 'GET',
    })
  }

  async getCategoryBySlug(slug: string): Promise<any> {
    return this.request(`/categories/slug/${slug}`, {
      method: 'GET',
    })
  }

  async getCategoryById(id: number): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: 'GET',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
