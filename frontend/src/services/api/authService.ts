import type { User, UserRole } from '../../types';
import { INITIAL_USER } from '../../data/mockData';

const USER_KEY = 'ustad_online_current_user_v1';
const ROLE_KEY = 'ustad_online_active_role_v1';

class AuthService {
  public getCurrentUser(): User {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return INITIAL_USER;
  }

  public saveCurrentUser(user: User): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Storage error
    }
  }

  public getActiveRole(): UserRole {
    try {
      const stored = localStorage.getItem(ROLE_KEY);
      if (stored === 'customer' || stored === 'ustad' || stored === 'admin') {
        return stored;
      }
    } catch {
      // Fallback
    }
    return 'customer';
  }

  public setActiveRole(role: UserRole): void {
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch {
      // Storage error
    }
  }

  // Demo Phone OTP Login
  public async requestDemoOtp(phoneNumber: string): Promise<{ success: boolean; demoOtp: string }> {
    // In production, this would call Firebase Auth verifyPhoneNumber
    return {
      success: true,
      demoOtp: '1234',
    };
  }

  public async verifyDemoOtp(
    phoneNumber: string,
    otpCode: string,
    role: UserRole = 'customer'
  ): Promise<User> {
    if (otpCode !== '1234' && otpCode.length !== 4) {
      throw new Error('Invalid OTP code. Use demo code 1234 to proceed.');
    }

    const current = this.getCurrentUser();
    const updatedUser: User = {
      ...current,
      phone: phoneNumber,
      role,
    };

    this.saveCurrentUser(updatedUser);
    this.setActiveRole(role);
    return updatedUser;
  }

  public async logout(): Promise<void> {
    try {
      localStorage.removeItem(USER_KEY);
      this.setActiveRole('customer');
    } catch {
      // Safe fallback
    }
  }
}

export const authService = new AuthService();
