import { apiClient } from './apiClient';
import type { User, ApiResponse } from '../../types';
import { INITIAL_USER } from '../../data/mockData';

class UserService {
  private localUser: User = { ...INITIAL_USER };

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<User>>('/users/me');
    }

    return {
      success: true,
      data: { ...this.localUser },
    };
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.patch<ApiResponse<User>>('/users/me', updates);
    }

    this.localUser = {
      ...this.localUser,
      ...updates,
    };

    return {
      success: true,
      data: { ...this.localUser },
      message: 'Profile updated successfully',
    };
  }

  async saveOnboarding(
    ageGroup: string,
    learningGoals: string[]
  ): Promise<ApiResponse<User>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<User>>('/onboarding/complete', {
        ageGroup,
        learningGoals,
      });
    }

    this.localUser.ageGroup = ageGroup;
    this.localUser.learningGoals = learningGoals;
    this.localUser.onboardingCompleted = true;

    return {
      success: true,
      data: { ...this.localUser },
    };
  }
}

export const userService = new UserService();
