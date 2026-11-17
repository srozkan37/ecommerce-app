import { AuthResponse, LoginCredentials, RegisterCredentials, User } from './authTypes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'

class AuthApiClient {
  private async request<T>(endpoint: string, options: globalThis.RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('access_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMsg = `API Error: ${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        if (errorData.detail) {
          errorMsg =
            typeof errorData.detail === 'string'
              ? errorData.detail
              : JSON.stringify(errorData.detail)
        }
      } catch {
        // ignore JSON parse error
      }
      throw new Error(errorMsg)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me', {
      method: 'GET',
    })
  }
}

export const authApi = new AuthApiClient()
