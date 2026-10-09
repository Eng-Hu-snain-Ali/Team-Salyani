import type { Review, Complaint, ComplaintStatus } from '../../types';
import { INITIAL_REVIEWS, INITIAL_COMPLAINTS } from '../../data/mockData';
import { bookingService } from './bookingService';

const REVIEWS_KEY = 'ustad_online_reviews_v1';
const COMPLAINTS_KEY = 'ustad_online_complaints_v1';

class ReviewService {
  private getStoredReviews(): Review[] {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    this.saveReviews(INITIAL_REVIEWS);
    return INITIAL_REVIEWS;
  }

  private saveReviews(reviews: Review[]): void {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch {
      // Storage error
    }
  }

  private getStoredComplaints(): Complaint[] {
    try {
      const stored = localStorage.getItem(COMPLAINTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    this.saveComplaints(INITIAL_COMPLAINTS);
    return INITIAL_COMPLAINTS;
  }

  private saveComplaints(complaints: Complaint[]): void {
    try {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    } catch {
      // Storage error
    }
  }

  public async getReviews(ustadId?: string): Promise<Review[]> {
    const list = this.getStoredReviews();
    if (ustadId) return list.filter((r) => r.ustadId === ustadId);
    return list;
  }

  public async submitReview(payload: {
    bookingId: string;
    ustadId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    tags?: string[];
  }): Promise<Review> {
    // Validation: prevent review if booking is not completed
    const booking = await bookingService.getBookingById(payload.bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    if (booking.status !== 'completed') {
      throw new Error('Reviews can only be submitted for completed service bookings.');
    }

    const list = this.getStoredReviews();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId: payload.bookingId,
      ustadId: payload.ustadId,
      userId: payload.userId,
      userName: payload.userName,
      rating: payload.rating,
      comment: payload.comment,
      tags: payload.tags || ['Verified Customer'],
      createdAt: new Date().toISOString(),
    };

    list.unshift(newReview);
    this.saveReviews(list);
    return newReview;
  }

  // Complaints
  public async getComplaints(): Promise<Complaint[]> {
    return this.getStoredComplaints();
  }

  public async submitComplaint(payload: {
    bookingId: string;
    userId: string;
    userName: string;
    userPhone: string;
    ustadId?: string;
    ustadName?: string;
    subject: string;
    description: string;
  }): Promise<Complaint> {
    const list = this.getStoredComplaints();
    const newComplaint: Complaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: payload.bookingId,
      userId: payload.userId,
      userName: payload.userName,
      userPhone: payload.userPhone,
      ustadId: payload.ustadId,
      ustadName: payload.ustadName,
      subject: payload.subject,
      description: payload.description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    list.unshift(newComplaint);
    this.saveComplaints(list);
    return newComplaint;
  }

  public async updateComplaintStatus(
    complaintId: string,
    status: ComplaintStatus,
    resolutionNotes?: string
  ): Promise<Complaint | null> {
    const list = this.getStoredComplaints();
    const index = list.findIndex((c) => c.id === complaintId);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      status,
      resolutionNotes: resolutionNotes || list[index].resolutionNotes,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : list[index].resolvedAt,
    };

    this.saveComplaints(list);
    return list[index];
  }
}

export const reviewService = new ReviewService();
