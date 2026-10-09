import type { User } from '../../types';
import { authService } from './authService';

class UserService {
  public async getUserProfile(): Promise<User> {
    return authService.getCurrentUser();
  }

  public async updateUserProfile(updates: Partial<User>): Promise<User> {
    const current = authService.getCurrentUser();
    const updated: User = {
      ...current,
      ...updates,
    };
    authService.saveCurrentUser(updated);
    return updated;
  }

  public async addSavedAddress(address: {
    label: string;
    address: string;
    area: string;
  }): Promise<User> {
    const current = authService.getCurrentUser();
    const newAddresses = [
      ...(current.savedAddresses || []),
      {
        id: `addr-${Date.now()}`,
        ...address,
      },
    ];

    const updated: User = {
      ...current,
      savedAddresses: newAddresses,
    };

    authService.saveCurrentUser(updated);
    return updated;
  }
}

export const userService = new UserService();
