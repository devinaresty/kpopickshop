import { getAuthToken, clearAllAuth } from '@/shared/config/auth.config'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductFromAPI {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  imageUrl?: string;
  rating: number;
  categoryId: number;
  isPromoted: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

interface ProductListResponse {
  data: ProductFromAPI[];
  total: number;
  skip: number;
  take: number;
}

interface SingleProductResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  imageUrl?: string;
  rating: number;
  categoryId: number;
  isPromoted: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return getAuthToken();
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (options?.headers && typeof options.headers === "object") {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    });

    if (response.status === 401) {
      clearAllAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const error = (await response.json()) as ApiErrorResponse;
      const errorObj = new Error(error.message || `HTTP ${response.status}`) as any;
      errorObj.response = {
        status: response.status,
        data: error
      };
      throw errorObj;
    }

    const data = (await response.json()) as T;
    return data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: any): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async adminRegister(data: any): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/admin/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<any> {
    return this.request("/auth/me", {
      method: "GET",
    });
  }

  async getCategories(): Promise<any[]> {
    return this.request<any[]>("/categories", {
      method: "GET",
    });
  }

  async getCategoryBySlug(slug: string): Promise<any> {
    return this.request(`/categories/slug/${slug}`, {
      method: "GET",
    });
  }

  async getCategoryById(id: number): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: "GET",
    });
  }

  async getProducts(
    skip: number = 0,
    take: number = 10,
  ): Promise<ProductListResponse> {
    return this.request<ProductListResponse>(
      `/products?skip=${skip}&take=${take}`,
      {
        method: "GET",
      },
    );
  }

  async getProductById(id: string | number): Promise<SingleProductResponse> {
    return this.request<SingleProductResponse>(`/products/${id}`, {
      method: "GET",
    });
  }

  async getProductBySlug(slug: string): Promise<SingleProductResponse> {
    return this.request<SingleProductResponse>(`/products/slug/${slug}`, {
      method: "GET",
    });
  }

  async getPromotedProducts(
    skip: number = 0,
    take: number = 10,
  ): Promise<ProductListResponse> {
    return this.request<ProductListResponse>(
      `/products/promoted?skip=${skip}&take=${take}`,
      {
        method: "GET",
      },
    );
  }

  async getProductsByCategory(
    categoryId: string | number,
    skip: number = 0,
    take: number = 10,
  ): Promise<ProductListResponse> {
    return this.request<ProductListResponse>(
      `/products/category/${categoryId}?skip=${skip}&take=${take}`,
      {
        method: "GET",
      },
    );
  }

  async getAllOrders(): Promise<any[]> {
    return this.request<any[]>("/orders", {
      method: "GET",
    });
  }

  async getAllOrdersAdmin(): Promise<any[]> {
    return this.request<any[]>("/orders/admin/all", {
      method: "GET",
    });
  }

  async getOrderById(id: string | number): Promise<any> {
    return this.request(`/orders/${id}`, {
      method: "GET",
    });
  }

  async updateOrderStatus(id: string | number, status: string): Promise<any> {
    return this.request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async createOrder(data: any): Promise<any> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createPayment(orderId: number, paymentMethod?: any): Promise<any> {
    return this.request("/payments/create", {
      method: "POST",
      body: JSON.stringify({ 
        orderId,
        paymentMethod: paymentMethod || {}
      }),
    });
  }

  async checkPaymentStatus(orderId: string | number): Promise<any> {
    return this.request(`/payments/status/${orderId}`, {
      method: "GET",
    });
  }

  async getAddresses(): Promise<any[]> {
    return this.request<any[]>("/addresses", {
      method: "GET",
    });
  }

  async getDefaultAddress(): Promise<any> {
    return this.request("/addresses/default", {
      method: "GET",
    });
  }

  async getAddressById(id: string | number): Promise<any> {
    return this.request(`/addresses/${id}`, {
      method: "GET",
    });
  }

  async createAddress(data: any): Promise<any> {
    return this.request("/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAddress(id: string | number, data: any): Promise<any> {
    return this.request(`/addresses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteAddress(id: string | number): Promise<any> {
    return this.request(`/addresses/${id}`, {
      method: "DELETE",
    });
  }

  async createProduct(data: any): Promise<any> {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string | number, data: any): Promise<any> {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string | number): Promise<any> {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async createCategory(data: any): Promise<any> {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string | number, data: any): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string | number): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  async getUsers(): Promise<any[]> {
    return this.request<any[]>("/auth/users", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export function useApi() {
  return {
    get: async (endpoint: string) => {
      try {
        if (endpoint === '/products') {
          const response = await apiClient.getProducts(0, 100);

          return { data: response.data };
        } else if (endpoint === '/categories') {
          const response = await apiClient.getCategories();

          return { data: response };
        } else {
          throw new Error(`Unsupported endpoint: ${endpoint}`);
        }
      } catch (error) {
        throw error;
      }
    },
    post: async (endpoint: string, payload: any) => {
      try {
        let data;
        if (endpoint === '/orders') {
          data = await apiClient.createOrder(payload);
        } else if (endpoint === '/payments/create') {
          data = await apiClient.createPayment(payload.orderId, payload.paymentMethod);
        } else {
          throw new Error(`Unsupported endpoint: ${endpoint}`);
        }
        return { data };
      } catch (error) {
        throw error;
      }
    },
  };
}
