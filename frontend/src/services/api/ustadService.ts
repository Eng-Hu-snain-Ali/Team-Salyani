import type {
  Ustad,
  ServiceCategoryType,
  VerificationStatus,
  WithdrawalRequest,
} from '../../types';
import { INITIAL_USTADS, INITIAL_WITHDRAWALS } from '../../data/mockData';

const USTADS_KEY = 'ustad_online_ustads_v1';
const WITHDRAWALS_KEY = 'ustad_online_withdrawals_v1';

class UstadService {
  private getStoredUstads(): Ustad[] {
    try {
      const stored = localStorage.getItem(USTADS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    this.saveUstads(INITIAL_USTADS);
    return INITIAL_USTADS;
  }

  private saveUstads(ustads: Ustad[]): void {
    try {
      localStorage.setItem(USTADS_KEY, JSON.stringify(ustads));
    } catch {
      // Storage error
    }
  }

  private getStoredWithdrawals(): WithdrawalRequest[] {
    try {
      const stored = localStorage.getItem(WITHDRAWALS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    this.saveWithdrawals(INITIAL_WITHDRAWALS);
    return INITIAL_WITHDRAWALS;
  }

  private saveWithdrawals(withdrawals: WithdrawalRequest[]): void {
    try {
      localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));
    } catch {
      // Storage error
    }
  }

  public async getUstads(): Promise<Ustad[]> {
    return this.getStoredUstads();
  }

  public async getUstadById(ustadId: string): Promise<Ustad | null> {
    const list = this.getStoredUstads();
    return list.find((u) => u.id === ustadId) || null;
  }

  public async getUstadsByCategory(category: ServiceCategoryType): Promise<Ustad[]> {
    const list = this.getStoredUstads();
    return list.filter(
      (u) =>
        u.skillCategories.includes(category) &&
        u.verificationStatus === 'approved' &&
        u.isAvailable
    );
  }

  public async registerUstad(payload: {
    name: string;
    phone: string;
    cnic: string;
    cnicFrontUrl?: string;
    cnicBackUrl?: string;
    certificateUrl?: string;
    skillCategories: ServiceCategoryType[];
    experienceYears: number;
    serviceArea: string;
    bio: string;
    startingPrice?: number;
  }): Promise<Ustad> {
    const list = this.getStoredUstads();
    const id = `ustad-${Date.now()}`;
    const now = new Date().toISOString();

    const masked = payload.cnic.length >= 10
      ? `${payload.cnic.substring(0, 5)}-*******-${payload.cnic.slice(-1)}`
      : '33100-*******-1';

    const newUstad: Ustad = {
      id,
      name: payload.name,
      phone: payload.phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      cnicMasked: masked,
      cnicFull: payload.cnic,
      cnicFrontUrl: payload.cnicFrontUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      cnicBackUrl: payload.cnicBackUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      certificateUrl: payload.certificateUrl,
      skillCategories: payload.skillCategories,
      experienceYears: payload.experienceYears,
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
      verificationStatus: 'pending',
      verificationNotes: 'Under review by Faisalabad Verification Desk.',
      isAvailable: false,
      serviceArea: payload.serviceArea,
      lat: 31.418,
      lng: 73.085,
      bio: payload.bio,
      startingPrice: payload.startingPrice || 300,
      completedJobsCount: 0,
      walletBalance: 0,
      todayEarnings: 0,
      totalEarnings: 0,
      joinedAt: now,
    };

    list.unshift(newUstad);
    this.saveUstads(list);
    return newUstad;
  }

  public async updateVerificationStatus(
    ustadId: string,
    status: VerificationStatus,
    notes?: string
  ): Promise<Ustad | null> {
    const list = this.getStoredUstads();
    const index = list.findIndex((u) => u.id === ustadId);
    if (index === -1) return null;

    const ustad = list[index];
    const updated: Ustad = {
      ...ustad,
      verificationStatus: status,
      isVerified: status === 'approved',
      verificationNotes: notes || ustad.verificationNotes,
      isAvailable: status === 'approved' ? true : false,
    };

    list[index] = updated;
    this.saveUstads(list);
    return updated;
  }

  public async toggleAvailability(ustadId: string, isAvailable: boolean): Promise<Ustad | null> {
    const list = this.getStoredUstads();
    const index = list.findIndex((u) => u.id === ustadId);
    if (index === -1) return null;

    const ustad = list[index];
    // Only approved Ustads can go online
    if (ustad.verificationStatus !== 'approved' && isAvailable) {
      throw new Error('Only verified and approved Ustads can toggle online availability.');
    }

    const updated: Ustad = {
      ...ustad,
      isAvailable,
    };

    list[index] = updated;
    this.saveUstads(list);
    return updated;
  }

  public async recordCompletedJob(
    ustadId: string,
    grossAmount: number,
    platformCommissionRate = 0.10
  ): Promise<Ustad | null> {
    const list = this.getStoredUstads();
    const index = list.findIndex((u) => u.id === ustadId);
    if (index === -1) return null;

    const ustad = list[index];
    const commission = grossAmount * platformCommissionRate;
    const netEarnings = grossAmount - commission;

    const updated: Ustad = {
      ...ustad,
      completedJobsCount: ustad.completedJobsCount + 1,
      todayEarnings: ustad.todayEarnings + netEarnings,
      totalEarnings: ustad.totalEarnings + netEarnings,
      walletBalance: ustad.walletBalance + netEarnings,
    };

    list[index] = updated;
    this.saveUstads(list);
    return updated;
  }

  // Withdrawals
  public async getWithdrawals(ustadId?: string): Promise<WithdrawalRequest[]> {
    const list = this.getStoredWithdrawals();
    if (ustadId) return list.filter((w) => w.ustadId === ustadId);
    return list;
  }

  public async createWithdrawal(payload: {
    ustadId: string;
    ustadName: string;
    amount: number;
    payoutMethod: 'easypaisa' | 'jazzcash' | 'bank';
    accountTitle: string;
    accountNumber: string;
    bankName?: string;
  }): Promise<WithdrawalRequest> {
    const ustad = await this.getUstadById(payload.ustadId);
    if (!ustad) throw new Error('Ustad not found');
    if (ustad.walletBalance < payload.amount) {
      throw new Error(`Insufficient wallet balance. Available: Rs. ${ustad.walletBalance}`);
    }

    const list = this.getStoredWithdrawals();
    const newRequest: WithdrawalRequest = {
      id: `WDR-${Date.now().toString().slice(-4)}`,
      ustadId: payload.ustadId,
      ustadName: payload.ustadName,
      amount: payload.amount,
      payoutMethod: payload.payoutMethod,
      accountTitle: payload.accountTitle,
      accountNumber: payload.accountNumber,
      bankName: payload.bankName,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    list.unshift(newRequest);
    this.saveWithdrawals(list);

    // Deduct from wallet balance
    const ustads = this.getStoredUstads();
    const uIndex = ustads.findIndex((u) => u.id === payload.ustadId);
    if (uIndex !== -1) {
      ustads[uIndex].walletBalance -= payload.amount;
      this.saveUstads(ustads);
    }

    return newRequest;
  }

  public async updateWithdrawalStatus(
    withdrawalId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<WithdrawalRequest | null> {
    const list = this.getStoredWithdrawals();
    const index = list.findIndex((w) => w.id === withdrawalId);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      status,
      notes,
      processedAt: new Date().toISOString(),
    };

    this.saveWithdrawals(list);
    return list[index];
  }
}

export const ustadService = new UstadService();
