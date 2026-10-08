import { apiClient } from './apiClient';
import type { User, ApiResponse, ExperienceCategory } from '../../types';
import { CURRENT_USER } from '../../data/mockData';

class UserService {
  private localUser: User = { ...CURRENT_USER };

  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<User>>(`/users/${userId}`);
    }

    return {
      success: true,
      data: this.localUser,
    };
  }

  // Alias for backend route: GET /users/{id}
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.getUserProfile(userId);
  }

  async updateProfile(
    userId: string,
    updates: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<User>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.patch<ApiResponse<User>>(`/users/${userId}`, updates);
    }

    this.localUser = {
      ...this.localUser,
      ...updates,
    };

    return {
      success: true,
      data: this.localUser,
      message: 'Profile updated successfully',
    };
  }

  // Alias for backend route: PATCH /users/{id}
  async updateUser(
    userId: string,
    updates: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<User>> {
    return this.updateProfile(userId, updates);
  }

  async saveOnboarding(
    interests: ExperienceCategory[],
    currentGoal?: string
  ): Promise<ApiResponse<User>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<User>>('/users/onboarding', {
        interests,
        currentGoal,
      });
    }

    this.localUser.interests = interests;
    this.localUser.currentGoal = currentGoal;
    this.localUser.onboardingCompleted = true;

    return {
      success: true,
      data: this.localUser,
    };
  }

  async toggleFollow(targetUserId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post(`/users/${targetUserId}/follow`);
    }

    return {
      success: true,
      data: { isFollowing: true },
    };
  }
}

export const userService = new UserService();
