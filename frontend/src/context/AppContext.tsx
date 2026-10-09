import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  User,
  UserRole,
  Ustad,
  ServiceCategory,
  ServiceItem,
  Booking,
  BookingStatus,
  Review,
  Complaint,
  Transaction,
  WithdrawalRequest,
  NotificationItem,
  ChatMessage,
  FaisalabadArea,
  CustomerTabId,
  UstadTabId,
  AdminTabId,
  PaymentMethod,
  PaymentStatus,
  PricingType,
  VerificationStatus,
  ComplaintStatus,
} from '../types';
import {
  bookingService,
  ustadService,
  serviceCatalogService,
  adminService,
  reviewService,
  notificationService,
  authService,
  userService,
} from '../services/api';
import { FAISALABAD_AREAS, APP_CONFIG } from '../constants';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';
import confetti from 'canvas-confetti';

export interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  // Theme & Global Settings
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Active Persona / Role Switcher
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  // Navigation Tabs per Role
  customerTab: CustomerTabId;
  setCustomerTab: (tab: CustomerTabId) => void;
  ustadTab: UstadTabId;
  setUstadTab: (tab: UstadTabId) => void;
  adminTab: AdminTabId;
  setAdminTab: (tab: AdminTabId) => void;

  // Admin Authentication Gate
  isAdminAuthenticated: boolean;
  verifyAdminPasscode: (passcode: string) => boolean;
  lockAdminSession: () => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;

  // Location / Faisalabad Sector
  selectedArea: FaisalabadArea;
  setSelectedArea: (area: FaisalabadArea) => void;

  // Authentication & Current Profile
  user: User;
  isAuthenticated: boolean;
  loginDemoUser: (phone: string, role?: UserRole) => Promise<void>;
  logoutUser: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;

  // Data Collections
  categories: ServiceCategory[];
  services: ServiceItem[];
  ustads: Ustad[];
  bookings: Booking[];
  reviews: Review[];
  complaints: Complaint[];
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  commissionRate: number;

  // Selected Entities
  selectedService: ServiceItem | null;
  setSelectedService: (service: ServiceItem | null) => void;
  selectedUstad: Ustad | null;
  setSelectedUstad: (ustad: Ustad | null) => void;
  activeTrackingBooking: Booking | null;
  setActiveTrackingBooking: (booking: Booking | null) => void;
  currentUstad: Ustad | null;
  setCurrentUstad: (ustad: Ustad | null) => void;

  // Modals & UI Overlays
  isCreateBookingOpen: boolean;
  setIsCreateBookingOpen: (open: boolean) => void;
  openCreateBooking: (service?: ServiceItem, ustad?: Ustad) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  openTrackingModal: (booking: Booking) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  activeChatBooking: Booking | null;
  openChatModal: (booking: Booking) => void;
  isCallModalOpen: boolean;
  setIsCallModalOpen: (open: boolean) => void;
  activeCallBooking: Booking | null;
  startCallModal: (booking: Booking) => void;
  endCallModal: () => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentBooking: Booking | null;
  openPaymentModal: (booking: Booking) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  reviewBooking: Booking | null;
  openReviewModal: (booking: Booking) => void;
  isComplaintModalOpen: boolean;
  setIsComplaintModalOpen: (open: boolean) => void;
  complaintBooking: Booking | null;
  openComplaintModal: (booking: Booking) => void;
  isUstadRegisterModalOpen: boolean;
  setIsUstadRegisterModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isSplashOpen: boolean;
  setIsSplashOpen: (open: boolean) => void;

  // Chat Communication Messages
  chatMessages: ChatMessage[];
  sendChatMessage: (messageText: string) => void;

  // Customer Operations
  createBooking: (payload: {
    serviceId: string;
    serviceName: string;
    categoryId: any;
    problemDescription: string;
    problemImageUrl?: string;
    address: string;
    area: string;
    estimatedPrice: number;
    pricingType: PricingType;
    paymentMethod: PaymentMethod;
    scheduleType: 'now' | 'scheduled';
    scheduledTime?: string;
    ustadId?: string;
    ustadName?: string;
    ustadPhone?: string;
    ustadAvatar?: string;
  }) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason: string) => Promise<void>;
  submitCustomerReview: (payload: {
    bookingId: string;
    ustadId: string;
    rating: number;
    comment: string;
    tags?: string[];
  }) => Promise<void>;
  submitCustomerComplaint: (payload: {
    bookingId: string;
    subject: string;
    description: string;
  }) => Promise<void>;
  processPayment: (bookingId: string, method: PaymentMethod) => Promise<void>;

  // Ustad Operations
  toggleUstadAvailability: (ustadId: string, isAvailable: boolean) => Promise<void>;
  acceptJobRequest: (bookingId: string) => Promise<void>;
  rejectJobRequest: (bookingId: string) => Promise<void>;
  stepBookingStatus: (
    bookingId: string,
    nextStatus: BookingStatus,
    note?: string,
    finalPrice?: number
  ) => Promise<void>;
  requestUstadWithdrawal: (payload: {
    amount: number;
    payoutMethod: 'easypaisa' | 'jazzcash' | 'bank';
    accountTitle: string;
    accountNumber: string;
    bankName?: string;
  }) => Promise<void>;
  registerUstad: (payload: {
    name: string;
    phone: string;
    cnic: string;
    skillCategories: any[];
    experienceYears: number;
    serviceArea: string;
    bio: string;
    startingPrice?: number;
  }) => Promise<void>;

  // Admin Operations
  updateUstadVerification: (
    ustadId: string,
    status: VerificationStatus,
    notes?: string
  ) => Promise<void>;
  updateServiceItem: (serviceId: string, updates: Partial<ServiceItem>) => Promise<void>;
  addNewServiceItem: (payload: any) => Promise<void>;
  toggleServiceStatus: (serviceId: string) => Promise<void>;
  updateCommissionRate: (rate: number) => Promise<void>;
  updateComplaintStatus: (
    complaintId: string,
    status: ComplaintStatus,
    notes?: string
  ) => Promise<void>;
  broadcastNotification: (
    title: string,
    message: string,
    targetRole: 'customer' | 'ustad' | 'all'
  ) => Promise<void>;

  // Notification Operations
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Toasts
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  dismissToast: (id: string) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ustad_online_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Role state (Customer, Ustad, Admin)
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return authService.getActiveRole();
  });

  // Navigation tabs
  const [customerTab, setCustomerTab] = useState<CustomerTabId>('home');
  const [ustadTab, setUstadTab] = useState<UstadTabId>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminTabId>('overview');

  // Admin passcode authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ustad_admin_authenticated') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Faisalabad selected area
  const [selectedArea, setSelectedArea] = useState<FaisalabadArea>(FAISALABAD_AREAS[0]);

  // Auth & Profile
  const [user, setUser] = useState<User>(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Entities state
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [ustads, setUstads] = useState<Ustad[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [commissionRate, setCommissionRateState] = useState<number>(0.10);

  // Selected Entities
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedUstad, setSelectedUstad] = useState<Ustad | null>(null);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<Booking | null>(null);
  const [currentUstad, setCurrentUstad] = useState<Ustad | null>(null);

  // Modals state
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatBooking, setActiveChatBooking] = useState<Booking | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeCallBooking, setActiveCallBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintBooking, setComplaintBooking] = useState<Booking | null>(null);
  const [isUstadRegisterModalOpen, setIsUstadRegisterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSplashOpen, setIsSplashOpen] = useState(false);

  // Chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#16A34A', '#F59E0B', '#38BDF8'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ustad_online_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const verifyAdminPasscode = useCallback((passcode: string): boolean => {
    const validCodes = ['admin123', 'saylani2026', '7860', 'ustadadmin'];
    if (validCodes.includes(passcode.trim())) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('ustad_admin_authenticated', 'true');
      authService.setActiveRole('admin');
      setActiveRoleState('admin');
      setIsAdminAuthModalOpen(false);
      showToast('Admin access granted. Welcome to Management Console.', 'success');
      return true;
    }
    showToast('Invalid admin passcode. Access denied.', 'error');
    return false;
  }, [showToast]);

  const lockAdminSession = useCallback(() => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('ustad_admin_authenticated');
    authService.setActiveRole('customer');
    setActiveRoleState('customer');
    showToast('Admin session locked.', 'info');
  }, [showToast]);

  // Set active role with admin passcode gate
  const setActiveRole = useCallback((role: UserRole) => {
    if (role === 'admin' && !isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    authService.setActiveRole(role);
    setActiveRoleState(role);
  }, [isAdminAuthenticated]);

  // Load all data on mount
  const refreshAllData = useCallback(async () => {
    try {
      const [
        cats,
        srvs,
        ustadList,
        bookingList,
        revList,
        compList,
        txnList,
        withList,
        notifList,
      ] = await Promise.all([
        serviceCatalogService.getCategories(),
        serviceCatalogService.getServices(),
        ustadService.getUstads(),
        bookingService.getBookings(),
        reviewService.getReviews(),
        reviewService.getComplaints(),
        adminService.getTransactions(),
        ustadService.getWithdrawals(),
        notificationService.getNotifications(),
      ]);

      setCategories(cats);
      setServices(srvs);
      setUstads(ustadList);
      setBookings(bookingList);
      setReviews(revList);
      setComplaints(compList);
      setTransactions(txnList);
      setWithdrawals(withList);
      setNotifications(notifList);
      setCommissionRateState(adminService.getCommissionRate());

      // Set default current Ustad if none selected
      setCurrentUstad((prev) => prev || (ustadList.length > 0 ? ustadList[0] : null));

      // Check active tracking booking
      const active = bookingList.find(
        (b) => b.status === 'on_the_way' || b.status === 'in_progress' || b.status === 'accepted'
      );
      if (active) {
        setActiveTrackingBooking(active);
      }
    } catch (err) {
      console.error('Error initializing Ustad Online data:', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const initData = async () => {
      try {
        await refreshAllData();
      } catch (err) {
        if (!cancelled) console.error(err);
      }
    };
    void initData();
    return () => {
      cancelled = true;
    };
  }, [refreshAllData]);

  // Auth Operations
  const loginDemoUser = useCallback(
    async (phone: string, role: UserRole = 'customer') => {
      try {
        const updated = await authService.verifyDemoOtp(phone, '1234', role);
        setUser(updated);
        setIsAuthenticated(true);
        setActiveRole(role);
        setIsAuthModalOpen(false);
        showToast(`Welcome to Ustad Online! Switched to ${role.toUpperCase()} persona.`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Login failed', 'error');
      }
    },
    [setActiveRole, showToast]
  );

  const logoutUser = useCallback(async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setActiveRole('customer');
    showToast('Logged out successfully.', 'info');
  }, [setActiveRole, showToast]);

  const updateUserProfile = useCallback(
    async (updates: Partial<User>) => {
      const updated = await userService.updateUserProfile(updates);
      setUser(updated);
      showToast('Profile updated successfully!', 'success');
    },
    [showToast]
  );

  // Quick Open Handlers
  const openCreateBooking = useCallback((service?: ServiceItem, ustad?: Ustad) => {
    if (service) setSelectedService(service);
    if (ustad) setSelectedUstad(ustad);
    setIsCreateBookingOpen(true);
  }, []);

  const openTrackingModal = useCallback((booking: Booking) => {
    setActiveTrackingBooking(booking);
    setIsTrackingModalOpen(true);
  }, []);

  const openChatModal = useCallback((booking: Booking) => {
    setActiveChatBooking(booking);
    setIsChatModalOpen(true);
  }, []);

  const startCallModal = useCallback((booking: Booking) => {
    setActiveCallBooking(booking);
    setIsCallModalOpen(true);
  }, []);

  const endCallModal = useCallback(() => {
    setIsCallModalOpen(false);
    setActiveCallBooking(null);
  }, []);

  const openPaymentModal = useCallback((booking: Booking) => {
    setPaymentBooking(booking);
    setIsPaymentModalOpen(true);
  }, []);

  const openReviewModal = useCallback((booking: Booking) => {
    setReviewBooking(booking);
    setIsReviewModalOpen(true);
  }, []);

  const openComplaintModal = useCallback((booking: Booking) => {
    setComplaintBooking(booking);
    setIsComplaintModalOpen(true);
  }, []);

  // Send Chat Message Simulation
  const sendChatMessage = useCallback(
    (messageText: string) => {
      if (!activeChatBooking || !messageText.trim()) return;

      const isCustomer = activeRole === 'customer';
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        bookingId: activeChatBooking.id,
        senderId: isCustomer ? user.id : activeChatBooking.ustadId || 'ustad',
        senderName: isCustomer ? user.name : activeChatBooking.ustadName || 'Ustad',
        senderRole: isCustomer ? 'customer' : 'ustad',
        message: messageText.trim(),
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, newMsg]);

      // Automated simulated response if customer sent it
      if (isCustomer) {
        setTimeout(() => {
          const reply: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            bookingId: activeChatBooking.id,
            senderId: activeChatBooking.ustadId || 'ustad',
            senderName: activeChatBooking.ustadName || 'Ustad Tariq',
            senderRole: 'ustad',
            message:
              'Ji bilkul Sir! I have received your message. Reaching your address shortly InshaAllah.',
            timestamp: new Date().toISOString(),
          };
          setChatMessages((prev) => [...prev, reply]);
        }, 1500);
      }
    },
    [activeChatBooking, activeRole, user]
  );

  // Customer Operations
  const createBooking = useCallback(
    async (payload: {
      serviceId: string;
      serviceName: string;
      categoryId: any;
      problemDescription: string;
      problemImageUrl?: string;
      address: string;
      area: string;
      estimatedPrice: number;
      pricingType: PricingType;
      paymentMethod: PaymentMethod;
      scheduleType: 'now' | 'scheduled';
      scheduledTime?: string;
      ustadId?: string;
      ustadName?: string;
      ustadPhone?: string;
      ustadAvatar?: string;
    }) => {
      const newBooking = await bookingService.createBooking({
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        lat: selectedArea.lat,
        lng: selectedArea.lng,
        ...payload,
      });

      // Update state
      setBookings((prev) => [newBooking, ...prev]);
      setActiveTrackingBooking(newBooking);
      setIsCreateBookingOpen(false);
      triggerConfetti();
      showToast(
        `Booking ${newBooking.id} created successfully! Searching for verified Ustads in ${payload.area}...`,
        'success'
      );

      // Create notification
      await notificationService.createNotification({
        title: `Booking ${newBooking.id} Placed`,
        message: `Your booking for ${payload.serviceName} is live. Estimated price: Rs. ${payload.estimatedPrice}.`,
        type: 'booking',
        targetRole: 'customer',
        relatedBookingId: newBooking.id,
      });

      // Also notify Ustads
      await notificationService.createNotification({
        title: `New Job in ${payload.area}`,
        message: `${payload.serviceName} requested by ${user.name}.`,
        type: 'booking',
        targetRole: 'ustad',
        relatedBookingId: newBooking.id,
      });

      refreshAllData();
      return newBooking;
    },
    [user, selectedArea, triggerConfetti, showToast, refreshAllData]
  );

  const cancelBooking = useCallback(
    async (bookingId: string, reason: string) => {
      await bookingService.cancelBooking(bookingId, reason);
      showToast(`Booking ${bookingId} has been cancelled.`, 'info');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  const submitCustomerReview = useCallback(
    async (payload: {
      bookingId: string;
      ustadId: string;
      rating: number;
      comment: string;
      tags?: string[];
    }) => {
      await reviewService.submitReview({
        ...payload,
        userId: user.id,
        userName: user.name,
      });
      triggerConfetti();
      showToast('Thank you! Your verified review has been published.', 'success');
      setIsReviewModalOpen(false);
      refreshAllData();
    },
    [user, triggerConfetti, showToast, refreshAllData]
  );

  const submitCustomerComplaint = useCallback(
    async (payload: { bookingId: string; subject: string; description: string }) => {
      const complaint = await reviewService.submitComplaint({
        bookingId: payload.bookingId,
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
        subject: payload.subject,
        description: payload.description,
      });
      showToast(
        `Complaint ${complaint.id} submitted. Our Faisalabad support manager will contact you within 2 hours.`,
        'warning'
      );
      setIsComplaintModalOpen(false);
      refreshAllData();
    },
    [user, showToast, refreshAllData]
  );

  const processPayment = useCallback(
    async (bookingId: string, method: PaymentMethod) => {
      const updated = await bookingService.updatePaymentStatus(bookingId, 'paid', method);
      if (updated && updated.ustadId) {
        // Record transaction with 10% platform commission
        const gross = updated.finalPrice || updated.estimatedPrice;
        await adminService.recordTransaction({
          bookingId: updated.id,
          ustadId: updated.ustadId,
          ustadName: updated.ustadName || 'Ustad',
          grossAmount: gross,
          paymentMethod: method,
        });

        // Credit Ustad's wallet (90% net)
        await ustadService.recordCompletedJob(updated.ustadId, gross, commissionRate);
      }
      triggerConfetti();
      showToast(`Payment of Rs. ${updated?.finalPrice || updated?.estimatedPrice} via ${method.toUpperCase()} confirmed!`, 'success');
      setIsPaymentModalOpen(false);
      refreshAllData();
    },
    [commissionRate, triggerConfetti, showToast, refreshAllData]
  );

  // Ustad Operations
  const toggleUstadAvailability = useCallback(
    async (ustadId: string, isAvailable: boolean) => {
      try {
        const updated = await ustadService.toggleAvailability(ustadId, isAvailable);
        if (updated) {
          setCurrentUstad(updated);
          showToast(
            `You are now ${isAvailable ? 'ONLINE and accepting jobs' : 'OFFLINE'}.`,
            isAvailable ? 'success' : 'info'
          );
          refreshAllData();
        }
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    },
    [showToast, refreshAllData]
  );

  const acceptJobRequest = useCallback(
    async (bookingId: string) => {
      if (!currentUstad) return;
      if (currentUstad.verificationStatus !== 'approved') {
        showToast('Your account is pending verification. Only approved Ustads can accept jobs.', 'error');
        return;
      }

      await bookingService.assignUstad(bookingId, {
        id: currentUstad.id,
        name: currentUstad.name,
        phone: currentUstad.phone,
        avatar: currentUstad.avatar,
        rating: currentUstad.rating,
      });

      showToast(`Job ${bookingId} accepted! Please navigate to the customer address.`, 'success');
      refreshAllData();
    },
    [currentUstad, showToast, refreshAllData]
  );

  const rejectJobRequest = useCallback(
    async (bookingId: string) => {
      await bookingService.updateBookingStatus(bookingId, 'rejected', 'Declined by Ustad');
      showToast(`Job request ${bookingId} passed to next available Ustad.`, 'info');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  const stepBookingStatus = useCallback(
    async (
      bookingId: string,
      nextStatus: BookingStatus,
      note?: string,
      finalPrice?: number
    ) => {
      const updated = await bookingService.updateBookingStatus(
        bookingId,
        nextStatus,
        note,
        finalPrice
      );

      if (nextStatus === 'completed' && updated) {
        triggerConfetti();
        // If cash, record payment and 10% commission
        if (updated.paymentMethod === 'cash' && updated.ustadId) {
          const gross = finalPrice || updated.finalPrice || updated.estimatedPrice;
          await adminService.recordTransaction({
            bookingId: updated.id,
            ustadId: updated.ustadId,
            ustadName: updated.ustadName || 'Ustad',
            grossAmount: gross,
            paymentMethod: 'cash',
          });
          await ustadService.recordCompletedJob(updated.ustadId, gross, commissionRate);
        }
      }

      showToast(`Job status updated to: ${nextStatus.replace('_', ' ').toUpperCase()}`, 'success');
      refreshAllData();
    },
    [commissionRate, triggerConfetti, showToast, refreshAllData]
  );

  const requestUstadWithdrawal = useCallback(
    async (payload: {
      amount: number;
      payoutMethod: 'easypaisa' | 'jazzcash' | 'bank';
      accountTitle: string;
      accountNumber: string;
      bankName?: string;
    }) => {
      if (!currentUstad) return;
      try {
        await ustadService.createWithdrawal({
          ustadId: currentUstad.id,
          ustadName: currentUstad.name,
          ...payload,
        });
        showToast(
          `Withdrawal request for Rs. ${payload.amount} submitted. Payout processed within 24 hours.`,
          'success'
        );
        refreshAllData();
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    },
    [currentUstad, showToast, refreshAllData]
  );

  const registerUstad = useCallback(
    async (payload: {
      name: string;
      phone: string;
      cnic: string;
      skillCategories: any[];
      experienceYears: number;
      serviceArea: string;
      bio: string;
      startingPrice?: number;
    }) => {
      const newUstad = await ustadService.registerUstad(payload);
      setCurrentUstad(newUstad);
      setIsUstadRegisterModalOpen(false);
      showToast(
        'Registration submitted! Your CNIC and documents are under verification by the Faisalabad desk.',
        'success'
      );
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  // Admin Operations
  const updateUstadVerification = useCallback(
    async (ustadId: string, status: VerificationStatus, notes?: string) => {
      await ustadService.updateVerificationStatus(ustadId, status, notes);
      showToast(`Ustad verification status updated to: ${status.toUpperCase()}`, 'success');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  const updateServiceItem = useCallback(
    async (serviceId: string, updates: Partial<ServiceItem>) => {
      await serviceCatalogService.updateService(serviceId, updates);
      showToast('Service details & pricing updated on the customer rate card.', 'success');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  const addNewServiceItem = useCallback(
    async (payload: any) => {
      await serviceCatalogService.addService(payload);
      showToast('New service published to the catalog.', 'success');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  const toggleServiceStatus = useCallback(
    async (serviceId: string) => {
      await serviceCatalogService.toggleServiceStatus(serviceId);
      showToast('Service availability toggled.', 'info');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  const updateCommissionRate = useCallback(
    async (rate: number) => {
      adminService.setCommissionRate(rate);
      setCommissionRateState(rate);
      showToast(`Platform commission rate updated to ${(rate * 100).toFixed(0)}%.`, 'success');
    },
    [showToast]
  );

  const updateComplaintStatus = useCallback(
    async (complaintId: string, status: ComplaintStatus, notes?: string) => {
      await reviewService.updateComplaintStatus(complaintId, status, notes);
      showToast(`Complaint ${complaintId} marked as ${status.toUpperCase()}.`, 'info');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  const broadcastNotification = useCallback(
    async (title: string, message: string, targetRole: 'customer' | 'ustad' | 'all') => {
      await notificationService.createNotification({
        title,
        message,
        type: 'system',
        targetRole,
      });
      showToast(`Notification broadcasted to ${targetRole.toUpperCase()}.`, 'success');
      refreshAllData();
    },
    [showToast, refreshAllData]
  );

  // Notifications
  const markNotificationRead = useCallback(
    async (id: string) => {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    },
    []
  );

  const markAllNotificationsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'info');
  }, [showToast]);

  const unreadNotifsCount = notifications.filter(
    (n) => !n.isRead && (n.targetRole === 'all' || n.targetRole === activeRole)
  ).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeRole,
        setActiveRole,
        customerTab,
        setCustomerTab,
        ustadTab,
        setUstadTab,
        adminTab,
        setAdminTab,
        isAdminAuthenticated,
        verifyAdminPasscode,
        lockAdminSession,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        selectedArea,
        setSelectedArea,
        user,
        isAuthenticated,
        loginDemoUser,
        logoutUser,
        updateUserProfile,
        categories,
        services,
        ustads,
        bookings,
        reviews,
        complaints,
        transactions,
        withdrawals,
        notifications,
        unreadNotifsCount,
        commissionRate,
        selectedService,
        setSelectedService,
        selectedUstad,
        setSelectedUstad,
        activeTrackingBooking,
        setActiveTrackingBooking,
        currentUstad,
        setCurrentUstad,
        isCreateBookingOpen,
        setIsCreateBookingOpen,
        openCreateBooking,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        openTrackingModal,
        isChatModalOpen,
        setIsChatModalOpen,
        activeChatBooking,
        openChatModal,
        isCallModalOpen,
        setIsCallModalOpen,
        activeCallBooking,
        startCallModal,
        endCallModal,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentBooking,
        openPaymentModal,
        isReviewModalOpen,
        setIsReviewModalOpen,
        reviewBooking,
        openReviewModal,
        isComplaintModalOpen,
        setIsComplaintModalOpen,
        complaintBooking,
        openComplaintModal,
        isUstadRegisterModalOpen,
        setIsUstadRegisterModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isSplashOpen,
        setIsSplashOpen,
        chatMessages,
        sendChatMessage,
        createBooking,
        cancelBooking,
        submitCustomerReview,
        submitCustomerComplaint,
        processPayment,
        toggleUstadAvailability,
        acceptJobRequest,
        rejectJobRequest,
        stepBookingStatus,
        requestUstadWithdrawal,
        registerUstad,
        updateUstadVerification,
        updateServiceItem,
        addNewServiceItem,
        toggleServiceStatus,
        updateCommissionRate,
        updateComplaintStatus,
        broadcastNotification,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        dismissToast,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
