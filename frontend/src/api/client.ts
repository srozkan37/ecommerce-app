import { Category, DeliveryOption, Product } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'

class ApiClient {
  private async request<T>(endpoint: string, options: globalThis.RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/categories')
  }

  async getDeliveryOptions(): Promise<DeliveryOption[]> {
    return this.request<DeliveryOption[]>('/api/delivery-options')
  }

  async getProducts(
    params: {
      q?: string
      minPrice?: number
      maxPrice?: number
      categoryId?: string
      deliveryOptionId?: string
      sort?: string
      skip?: number
      limit?: number
    } = {}
  ): Promise<Product[]> {
    const searchParams = new globalThis.URLSearchParams()
    if (params.q) searchParams.set('q', params.q)
    if (params.minPrice !== undefined && !isNaN(params.minPrice)) searchParams.set('min_price', params.minPrice.toString())
    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) searchParams.set('max_price', params.maxPrice.toString())
    if (params.categoryId) searchParams.set('categoryId', params.categoryId)
    if (params.deliveryOptionId) searchParams.set('deliveryOptionId', params.deliveryOptionId)
    if (params.sort) searchParams.set('sort', params.sort)
    if (params.skip !== undefined) searchParams.set('skip', params.skip.toString())
    if (params.limit !== undefined) searchParams.set('limit', params.limit.toString())

    return this.request<Product[]>(`/api/products?${searchParams.toString()}`)
  }
}

export const api = new ApiClient()
