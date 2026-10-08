import { apiClient } from './apiClient';
import type {
  User,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  ApiResponse,
} from '../../types';
import { INITIAL_USER } from '../../data/mockData';

class AuthService {
  async login(payload: LoginPayload): Promise<ApiResponse<{ user: User; token: string }>> {
    if (apiClient.isRemoteConfigured()) {
      const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', payload);
      if (res.data?.token) {
        apiClient.setToken(res.data.token);
      }
      return res;
    }

    // Demo/Mock authentication
    const demoToken = `ustad_demo_token_${Date.now()}`;
    apiClient.setToken(demoToken);

    const user: User = {
      ...INITIAL_USER,
      email: payload.email || INITIAL_USER.email,
    };

    return {
      success: true,
      data: { user, token: demoToken },
      message: 'Signed in successfully to USTAD ONLINE',
    };
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<{ user: User; token: string }>> {
    if (apiClient.isRemoteConfigured()) {
      const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', payload);
      if (res.data?.token) {
        apiClient.setToken(res.data.token);
      }
      return res;
    }

    const demoToken = `ustad_demo_token_${Date.now()}`;
    apiClient.setToken(demoToken);

    const user: User = {
      ...INITIAL_USER,
      id: `usr_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      ageGroup: payload.ageGroup,
      learningGoals: payload.learningGoals || [],
      onboardingCompleted: false, // will complete during onboarding modal
      currentLevel: 1,
      xp: 0,
      nextLevelXp: 200,
      streakDays: 1,
    };

    return {
      success: true,
      data: { user, token: demoToken },
      message: 'Account created successfully! Welcome to USTAD ONLINE.',
    };
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email });
    }

    return {
      success: true,
      data: null,
      message: `Password reset instructions sent to ${email}`,
    };
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<null>>('/auth/reset-password', payload);
    }

    return {
      success: true,
      data: null,
      message: 'Your password has been reset. Please sign in.',
    };
  }

  async logout(): Promise<void> {
    apiClient.clearToken();
  }
}

export const authService = new AuthService();
