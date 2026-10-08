import { apiClient } from './apiClient';
import type { User, ApiResponse, AuthTokens } from '../../types';
import { CURRENT_USER } from '../../data/mockData';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

class AuthService {
  private currentUser: User = { ...CURRENT_USER };

  async login(payload: LoginPayload): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    if (apiClient.isRemoteConfigured()) {
      const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', payload);
      if (response.data?.tokens?.accessToken) {
        apiClient.setToken(response.data.tokens.accessToken);
      }
      return response;
    }

    // Mock login
    apiClient.setToken('mock_jwt_token_alexchen');
    return {
      success: true,
      data: {
        user: this.currentUser,
        tokens: {
          accessToken: 'mock_jwt_token_alexchen',
          refreshToken: 'mock_refresh_token_alexchen',
        },
      },
    };
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    if (apiClient.isRemoteConfigured()) {
      const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', payload);
      if (response.data?.tokens?.accessToken) {
        apiClient.setToken(response.data.tokens.accessToken);
      }
      return response;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: payload.name,
      username: payload.email.split('@')[0],
      email: payload.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Lifelong learner on Lived.',
      interests: [],
      followersCount: 0,
      followingCount: 0,
      experiencesCount: 0,
      helpfulCount: 0,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    };
    this.currentUser = newUser;
    apiClient.setToken('mock_jwt_token_new_user');

    return {
      success: true,
      data: {
        user: newUser,
        tokens: {
          accessToken: 'mock_jwt_token_new_user',
        },
      },
    };
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ sent: boolean }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post('/auth/forgot-password', { email });
    }

    return {
      success: true,
      data: { sent: true },
      message: 'Password reset link sent to your email.',
    };
  }

  async getMe(): Promise<ApiResponse<User>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<User>>('/auth/me');
    }

    return {
      success: true,
      data: this.currentUser,
    };
  }

  async logout(): Promise<void> {
    if (apiClient.isRemoteConfigured()) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Continue cleanup
      }
    }
    apiClient.clearToken();
  }
}

export const authService = new AuthService();
