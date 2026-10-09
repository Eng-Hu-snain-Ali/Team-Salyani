import type { Booking, BookingStatus, PaymentMethod, PaymentStatus, PricingType } from '../../types';
import { INITIAL_BOOKINGS } from '../../data/mockData';

const STORAGE_KEY = 'ustad_online_bookings_v1';

class BookingService {
  private getStoredBookings(): Booking[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    this.saveBookings(INITIAL_BOOKINGS);
    return INITIAL_BOOKINGS;
  }

  private saveBookings(bookings: Booking[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Storage full or unavailable
    }
  }

  public async getBookings(): Promise<Booking[]> {
    return this.getStoredBookings();
  }

  public async getBookingById(bookingId: string): Promise<Booking | null> {
    const list = this.getStoredBookings();
    return list.find((b) => b.id === bookingId) || null;
  }

  public async getBookingsByUserId(userId: string): Promise<Booking[]> {
    const list = this.getStoredBookings();
    return list.filter((b) => b.userId === userId);
  }

  public async getBookingsByUstadId(ustadId: string): Promise<Booking[]> {
    const list = this.getStoredBookings();
    return list.filter((b) => b.ustadId === ustadId);
  }

  public async createBooking(payload: {
    userId: string;
    userName: string;
    userPhone: string;
    serviceId: string;
    serviceName: string;
    categoryId: any;
    problemDescription: string;
    problemImageUrl?: string;
    address: string;
    area: string;
    lat: number;
    lng: number;
    estimatedPrice: number;
    pricingType: PricingType;
    paymentMethod: PaymentMethod;
    scheduleType: 'now' | 'scheduled';
    scheduledTime?: string;
    ustadId?: string;
    ustadName?: string;
    ustadPhone?: string;
    ustadAvatar?: string;
  }): Promise<Booking> {
    const list = this.getStoredBookings();
    const newId = `UST-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newBooking: Booking = {
      id: newId,
      userId: payload.userId,
      userName: payload.userName,
      userPhone: payload.userPhone,
      ustadId: payload.ustadId,
      ustadName: payload.ustadName,
      ustadPhone: payload.ustadPhone,
      ustadAvatar: payload.ustadAvatar,
      serviceId: payload.serviceId,
      serviceName: payload.serviceName,
      categoryId: payload.categoryId,
      problemDescription: payload.problemDescription,
      problemImageUrl: payload.problemImageUrl,
      address: payload.address,
      area: payload.area,
      lat: payload.lat,
      lng: payload.lng,
      status: payload.ustadId ? 'accepted' : 'pending',
      statusTimeline: [
        {
          status: 'pending',
          timestamp: now,
          note: 'Booking submitted by customer',
        },
        ...(payload.ustadId
          ? [
              {
                status: 'accepted' as BookingStatus,
                timestamp: now,
                note: `Directly assigned to ${payload.ustadName}`,
              },
            ]
          : []),
      ],
      pricingType: payload.pricingType,
      estimatedPrice: payload.estimatedPrice,
      finalPrice: payload.estimatedPrice,
      paymentMethod: payload.paymentMethod,
      paymentStatus: 'unpaid',
      scheduleType: payload.scheduleType,
      scheduledTime: payload.scheduledTime,
      createdAt: now,
      updatedAt: now,
      ustadCurrentLocation: payload.ustadId
        ? {
            lat: payload.lat + 0.005,
            lng: payload.lng + 0.005,
            lastUpdated: now,
            distanceKm: 1.5,
            etaMinutes: 15,
          }
        : undefined,
    };

    list.unshift(newBooking);
    this.saveBookings(list);
    return newBooking;
  }

  public async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    note?: string,
    finalPrice?: number
  ): Promise<Booking | null> {
    const list = this.getStoredBookings();
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const booking = list[index];
    const now = new Date().toISOString();

    const updatedTimeline = [
      ...booking.statusTimeline,
      {
        status,
        timestamp: now,
        note: note || `Status updated to ${status}`,
      },
    ];

    const updatedBooking: Booking = {
      ...booking,
      status,
      statusTimeline: updatedTimeline,
      finalPrice: finalPrice !== undefined ? finalPrice : booking.finalPrice,
      paymentStatus: status === 'completed' && booking.paymentMethod !== 'cash' ? 'paid' : booking.paymentStatus,
      updatedAt: now,
    };

    list[index] = updatedBooking;
    this.saveBookings(list);
    return updatedBooking;
  }

  public async assignUstad(
    bookingId: string,
    ustad: {
      id: string;
      name: string;
      phone: string;
      avatar: string;
      rating: number;
    }
  ): Promise<Booking | null> {
    const list = this.getStoredBookings();
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const booking = list[index];
    const now = new Date().toISOString();

    const updated: Booking = {
      ...booking,
      ustadId: ustad.id,
      ustadName: ustad.name,
      ustadPhone: ustad.phone,
      ustadAvatar: ustad.avatar,
      ustadRating: ustad.rating,
      status: 'accepted',
      statusTimeline: [
        ...booking.statusTimeline,
        {
          status: 'accepted',
          timestamp: now,
          note: `Accepted by ${ustad.name}`,
        },
      ],
      updatedAt: now,
      ustadCurrentLocation: {
        lat: booking.lat + 0.004,
        lng: booking.lng + 0.004,
        lastUpdated: now,
        distanceKm: 1.8,
        etaMinutes: 12,
      },
    };

    list[index] = updated;
    this.saveBookings(list);
    return updated;
  }

  public async updatePaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod
  ): Promise<Booking | null> {
    const list = this.getStoredBookings();
    const index = list.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const booking = list[index];
    const now = new Date().toISOString();

    const updated: Booking = {
      ...booking,
      paymentStatus,
      paymentMethod: paymentMethod || booking.paymentMethod,
      updatedAt: now,
    };

    list[index] = updated;
    this.saveBookings(list);
    return updated;
  }

  public async cancelBooking(bookingId: string, reason: string): Promise<Booking | null> {
    return this.updateBookingStatus(bookingId, 'cancelled', `Cancelled: ${reason}`);
  }
}

export const bookingService = new BookingService();
