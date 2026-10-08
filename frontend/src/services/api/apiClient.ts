// ============================================================================
// CENTRALIZED API CLIENT
// Configurable REST API client designed for clean backend integration.
// Backend engineers can configure VITE_API_BASE_URL in their .env file.
// ============================================================================

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseURL: string;
  private tokenKey = 'lived_auth_token';

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
  }

  public setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // Safe fallback for restricted storage environments
    }
  }

  public getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  public clearToken(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {
      // Safe fallback
    }
  }

  public isRemoteConfigured(): boolean {
    return Boolean(this.baseURL && this.baseURL.trim().length > 0);
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...customConfig } = options;

    let url = `${this.baseURL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const token = this.getToken();
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        let errorData: unknown;
        try {
          errorData = await response.json();
          if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
            errorMessage = String((errorData as { message: unknown }).message);
          }
        } catch {
          // No json body
        }
        throw new ApiError(errorMessage, response.status, errorData);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        err instanceof Error ? err.message : 'Unknown Network Error occurred',
        0
      );
    }
  }

  public get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  public post<T>(endpoint: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  public put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
