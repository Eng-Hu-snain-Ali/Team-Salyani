import { apiClient } from './apiClient';
import type {
  User,
  ApiResponse,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../../types';
import { TEAM_PROFILE } from '../../data/mockData';

class AuthService {
  private currentUser: User = { ...TEAM_PROFILE };

  async login(payload: LoginPayload): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    if (apiClient.isRemoteConfigured()) {
      const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', payload);
      if (response.data?.tokens?.accessToken) {
        apiClient.setToken(response.data.tokens.accessToken);
      }
      return response;
    }

    // Standard client demo authorization (never stores raw password)
    const authenticatedUser: User = {
      id: `usr_auth_${Date.now()}`,
      name: payload.email.split('@')[0].replace('.', ' '),
      username: payload.email.split('@')[0],
      email: payload.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Lifelong learner discovering real lessons on Lived.',
      interests: ['Career', 'Technology', 'Personal Growth'],
      followersCount: 1,
      followingCount: 3,
      experiencesCount: 0,
      helpfulCount: 0,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    this.currentUser = authenticatedUser;
    apiClient.setToken('lived_mock_jwt_session_token');

    return {
      success: true,
      data: {
        user: authenticatedUser,
        tokens: {
          accessToken: 'lived_mock_jwt_session_token',
          refreshToken: 'lived_mock_refresh_token',
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
      username: payload.username || payload.email.split('@')[0],
      email: payload.email,
      avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Lifelong learner on Lived.',
      interests: payload.interests || [],
      followersCount: 0,
      followingCount: 1,
      experiencesCount: 0,
      helpfulCount: 0,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    };
    this.currentUser = newUser;
    apiClient.setToken('lived_mock_jwt_session_token');

    return {
      success: true,
      data: {
        user: newUser,
        tokens: {
          accessToken: 'lived_mock_jwt_session_token',
          refreshToken: 'lived_mock_refresh_token',
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
      message: 'Password reset link has been dispatched to your email address.',
    };
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<{ reset: boolean }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post('/auth/reset-password', payload);
    }

    return {
      success: true,
      data: { reset: true },
      message: 'Your password has been successfully reset. You may now log in.',
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
        // Fallback cleanup
      }
    }
    apiClient.clearToken();
    this.currentUser = { ...TEAM_PROFILE };
  }
}

export const authService = new AuthService();
