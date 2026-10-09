import type { Transaction, PaymentMethod } from '../../types';
import { INITIAL_TRANSACTIONS } from '../../data/mockData';
import { APP_CONFIG } from '../../constants';

const TRANSACTIONS_KEY = 'ustad_online_transactions_v1';
const COMMISSION_KEY = 'ustad_online_commission_rate_v1';

class AdminService {
  private getStoredTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    this.saveTransactions(INITIAL_TRANSACTIONS);
    return INITIAL_TRANSACTIONS;
  }

  private saveTransactions(txns: Transaction[]): void {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns));
    } catch {
      // Storage error
    }
  }

  public getCommissionRate(): number {
    try {
      const stored = localStorage.getItem(COMMISSION_KEY);
      if (stored) return parseFloat(stored);
    } catch {
      // Fallback
    }
    return APP_CONFIG.commissionRate; // Default 0.10 (10%)
  }

  public setCommissionRate(rate: number): void {
    try {
      localStorage.setItem(COMMISSION_KEY, rate.toString());
    } catch {
      // Storage error
    }
  }

  public async getTransactions(): Promise<Transaction[]> {
    return this.getStoredTransactions();
  }

  public async recordTransaction(payload: {
    bookingId: string;
    ustadId: string;
    ustadName: string;
    grossAmount: number;
    paymentMethod: PaymentMethod;
  }): Promise<Transaction> {
    const rate = this.getCommissionRate();
    const commissionAmount = Math.round(payload.grossAmount * rate);
    const netAmount = payload.grossAmount - commissionAmount;

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: payload.bookingId,
      ustadId: payload.ustadId,
      ustadName: payload.ustadName,
      grossAmount: payload.grossAmount,
      commissionRate: rate,
      commissionAmount,
      netAmount,
      paymentMethod: payload.paymentMethod,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    const list = this.getStoredTransactions();
    list.unshift(newTxn);
    this.saveTransactions(list);
    return newTxn;
  }
}

export const adminService = new AdminService();
