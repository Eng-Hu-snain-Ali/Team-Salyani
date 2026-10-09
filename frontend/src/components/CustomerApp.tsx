'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  Send,
  X,
  ThumbsUp,
  Sparkles,
  Zap,
  Wrench,
  Snowflake,
  Bike,
  Car,
  Hammer,
  Navigation
} from 'lucide-react';
import {
  SERVICE_CATEGORIES,
  ServiceItem,
  UstadProfile,
  Booking,
  FaisalabadLocation
} from '@/data/mockData';
import FaisalabadMap from './FaisalabadMap';
import { playChime } from '@/utils/audio';

interface CustomerAppProps {
  locations: FaisalabadLocation[];
  selectedLocation: FaisalabadLocation;
  onLocationChange: (loc: FaisalabadLocation) => void;
  ustads: UstadProfile[];
  services: ServiceItem[];
  bookings: Booking[];
  onNewBooking: (booking: Booking) => void;
  onUpdateBooking: (booking: Booking) => void;
}

export default function CustomerApp({
  locations,
  selectedLocation,
  onLocationChange,
  ustads,
  services,
  onNewBooking,
  onUpdateBooking,
}: CustomerAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('electrician');
  const [searchFilter, setSearchFilter] = useState('');
  const [cartItems, setCartItems] = useState<ServiceItem[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [urgency, setUrgency] = useState<'immediate' | 'scheduled'>('immediate');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'jazzcash' | 'easypaisa'>('cash');
  const [targetSpecificUstad, setTargetSpecificUstad] = useState<UstadProfile | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Custom service input modal
  const [showCustomServiceModal, setShowCustomServiceModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState('500');

  // Digital Payment OTP Modal (JazzCash / Easypaisa)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mobileAccount, setMobileAccount] = useState('0300-1234567');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // In-app Chat & Call states
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ustad'; text: string; time: string }>>([
    { sender: 'ustad', text: 'Assalam-o-Alaikum bhai! Main aapki location ki taraf nikal chuka hoon. Baraye meharbani switchboard ki location confirm kar dain.', time: 'Just now' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [callDuration] = useState(14);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'Reasonable Price', 'Professional Work']);

  // Dynamic search and filter over services
  const filteredServices = services
    .filter((s) => s.category === selectedCategory)
    .filter((s) => s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.description.toLowerCase().includes(searchFilter.toLowerCase()));

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  const toggleCartItem = (service: ServiceItem) => {
    playChime('click');
    if (cartItems.some((item) => item.id === service.id)) {
      setCartItems(cartItems.filter((item) => item.id !== service.id));
    } else {
      setCartItems([...cartItems, service]);
    }
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    playChime('success');
    const customItem: ServiceItem = {
      id: `custom-${Date.now()}`,
      category: selectedCategory as ServiceItem['category'],
      name: customTitle,
      price: Number(customPrice) || 500,
      duration: '30-45 min',
      icon: 'Wrench',
      description: 'Custom repair requested by customer',
    };
    setCartItems([...cartItems, customItem]);
    setShowCustomServiceModal(false);
    setCustomTitle('');
  };

  const handleStartBooking = () => {
    if (cartItems.length === 0) return;
    playChime('click');
    setShowBookingModal(true);
  };

  // Direct booking of an ustad clicked from map
  const handleDirectBookUstad = (ustad: UstadProfile) => {
    setTargetSpecificUstad(ustad);
    setSelectedCategory(ustad.skill);
    // Auto-select standard inspection service if cart is empty
    if (cartItems.length === 0) {
      const defaultSvc = services.find((s) => s.category === ustad.skill) || services[0];
      setCartItems([defaultSvc]);
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') {
      playChime('click');
      setShowOtpModal(true);
      return;
    }
    completeDispatch(paymentMethod);
  };

  const completeDispatch = (paidMethod: 'cash' | 'jazzcash' | 'easypaisa') => {
    playChime('success');
    const matchedUstad =
      targetSpecificUstad ||
      ustads.find((u) => u.skill === selectedCategory && u.isAvailable && u.isVerified) ||
      ustads[0];

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: 'usr-customer-1',
      userName: 'Muddasar Shoaib',
      userPhone: mobileAccount,
      userAddress: `${selectedLocation.name}, Faisalabad`,
      serviceType: selectedCategory as Booking['serviceType'],
      serviceItems: cartItems.map((c) => c.name),
      totalPrice: cartTotal,
      platformCommission: Math.round(cartTotal * 0.1),
      ustadEarning: Math.round(cartTotal * 0.9),
      ustadId: matchedUstad.id,
      ustadName: matchedUstad.name,
      ustadPhone: matchedUstad.phone,
      status: 'on_the_way',
      paymentMethod: paidMethod,
      paymentStatus: paidMethod === 'cash' ? 'pending' : 'paid',
      problemDescription: problemDescription || 'Inspection and repair needed',
      urgency,
      createdAt: 'Just now',
    };

    onNewBooking(newBooking);
    setActiveBooking(newBooking);
    setShowBookingModal(false);
    setShowOtpModal(false);
    setCartItems([]);
    setProblemDescription('');
    setTargetSpecificUstad(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      completeDispatch(paymentMethod);
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    playChime('click');
    const newMsg = { sender: 'user' as const, text: inputMessage, time: 'Now' };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    setTimeout(() => {
      playChime('alert');
      const replies = [
        'Ji theek hai sir, main bilkul samjh gaya. Bas 5 minutes mein aap ke gate pe hoon.',
        'Ji bilkul, main testing meter aur zaroori tools sath le kar aa raha hoon.',
        'Assalam-o-Alaikum, main D-Ground chowk cross kar chuka hoon, location mil gayi hai.',
      ];
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ustad' as const,
          text: replies[Math.floor(Math.random() * replies.length)],
          time: 'Now',
        },
      ]);
    }, 1400);
  };

  const handleCompleteAndReview = () => {
    if (!activeBooking) return;
    playChime('success');
    const updated = {
      ...activeBooking,
      status: 'completed' as const,
      paymentStatus: 'paid' as const,
      rating: ratingStars,
      reviewComment: reviewComment || 'Zabardast kaam kiya Ustad ji ne!',
    };
    onUpdateBooking(updated);
    setActiveBooking(updated);
    setShowReviewModal(false);
  };

  const assignedUstad = ustads.find((u) => u.id === activeBooking?.ustadId);

  return (
    <div className="space-y-6">
      {/* Top Banner: Warm Obsidian & Gold Gradient Header (Zero Blue) */}
      <div className="bg-gradient-to-r from-[#0b101b] via-[#151c2d] to-[#0b101b] border border-emerald-600/30 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Faisalabad Service Network
              </span>
              <span className="text-xs text-amber-400/90 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                100% Verified CNIC Handymen
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Ustad Online <span className="text-amber-400 font-urdu">استاد آن لائن</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              One-click doorstep booking for certified technicians across Faisalabad at guaranteed fixed rates.
            </p>
          </div>

          {/* Location Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-[#121927] border border-slate-700/80 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-lg">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Area</span>
                <select
                  value={selectedLocation.id}
                  onChange={(e) => {
                    const found = locations.find((l) => l.id === e.target.value);
                    if (found) onLocationChange(found);
                  }}
                  className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-[#0f172a] text-white">
                      {loc.name} ({loc.area})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-[#18231e] border border-emerald-600/40 rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-emerald-400 uppercase font-bold">Direct Helpline</div>
                <div className="text-xs font-bold text-white">041-8765432</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE TRACKING HUD (When booking in progress) */}
      {activeBooking && activeBooking.status !== 'completed' && (
        <div className="bg-[#10221c]/90 border-2 border-emerald-500 rounded-3xl p-4 md:p-5 shadow-2xl backdrop-blur-md animate-float">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-2xl bg-[#0b101b] flex items-center justify-center overflow-hidden">
                    {assignedUstad ? (
                      <img src={assignedUstad.avatar} alt={assignedUstad.name} className="w-full h-full object-cover" />
                    ) : (
                      <Wrench className="w-7 h-7 text-emerald-400" />
                    )}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#0b101b] rounded-full animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-extrabold bg-emerald-400 text-slate-950 rounded-full">
                    {activeBooking.status === 'on_the_way' ? '🚀 Ustad On The Way' : '⚡ Work In Progress'}
                  </span>
                  <span className="text-xs text-slate-400">Booking #{activeBooking.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {assignedUstad?.name || 'Assigned Ustad'}
                </h3>
                <div className="text-xs text-emerald-300 flex items-center gap-2">
                  <span className="text-amber-400 font-bold">★ {assignedUstad?.rating || 4.9}</span>
                  <span>•</span>
                  <span>CNIC: {assignedUstad?.cnic || '33100-XXXXXXX'}</span>
                  <span>•</span>
                  <span>Estimated Arrival: ~5 mins</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowChatModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#162032] hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Live Chat
              </button>
              <button
                onClick={() => {
                  playChime('click');
                  setShowCallModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#162032] hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Call Ustad
              </button>
              <button
                onClick={() => {
                  playChime('success');
                  setShowReviewModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete & Pay ₨ {activeBooking.totalPrice}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Faisalabad Map Live Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Live Faisalabad Dispatch Radar</h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any technician pin to view profile or book directly
          </span>
        </div>
        <FaisalabadMap
          userLocation={selectedLocation}
          ustads={ustads}
          selectedCategory={selectedCategory}
          activeBookingUstad={assignedUstad}
          bookingStatus={activeBooking?.status}
          onDirectBookUstad={handleDirectBookUstad}
        />
      </div>

      {/* SERVICE CATEGORIES TABS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Select Service Category</h2>
            <p className="text-xs text-slate-400">Explore fixed-price rate cards with zero market overcharging</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
            6 Core Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const IconComponent =
              cat.id === 'electrician' ? Zap :
              cat.id === 'plumber' ? Wrench :
              cat.id === 'ac' ? Snowflake :
              cat.id === 'bike' ? Bike :
              cat.id === 'car' ? Car : Hammer;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  playChime('click');
                  setSelectedCategory(cat.id);
                }}
                className={`relative p-3.5 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#18231e] to-[#0d1422] border-emerald-500 shadow-xl shadow-emerald-950/40 -translate-y-1'
                    : 'bg-[#101726]/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-tr ${cat.color} text-white shadow-md`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-white">{cat.name}</div>
                <div className="text-xs text-emerald-400 font-urdu">{cat.urdu}</div>
                {cat.popular && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md border border-amber-500/30">
                    Hot
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC SEARCH BAR & RATE CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Services List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search & Custom Service Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={`Search ${selectedCategory} repair services...`}
                className="w-full bg-[#101726] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                playChime('click');
                setShowCustomServiceModal(true);
              }}
              className="px-3.5 py-2.5 bg-[#172233] hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              Custom Service
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Standard Fixed Price Menu</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Zero Overcharging
              </span>
            </h3>
            <span className="text-xs text-slate-400">{filteredServices.length} Services Available</span>
          </div>

          <div className="space-y-2.5">
            {filteredServices.length === 0 ? (
              <div className="p-8 text-center bg-[#101726] rounded-2xl border border-slate-800 space-y-2">
                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-400">No services match &ldquo;{searchFilter}&rdquo;</p>
                <button
                  onClick={() => setShowCustomServiceModal(true)}
                  className="text-xs text-emerald-400 underline font-bold"
                >
                  Add as a custom repair request
                </button>
              </div>
            ) : (
              filteredServices.map((service) => {
                const isSelected = cartItems.some((item) => item.id === service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleCartItem(service)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#112019] border-emerald-500 shadow-md'
                        : 'bg-[#101726]/80 hover:bg-slate-800/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{service.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{service.description}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            {service.duration}
                          </span>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">7-Day Service Warranty</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-extrabold text-emerald-400">
                        ₨ {service.price}
                      </div>
                      <span className="text-[11px] text-slate-400">Guaranteed Rate</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Instant Booking Summary Card */}
        <div className="space-y-4">
          <div className="bg-[#101726]/95 border border-slate-800 rounded-3xl p-5 shadow-2xl sticky top-24 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between pb-3 border-b border-slate-800">
              <span>Your Service Cart</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                {cartItems.length} items
              </span>
            </h3>

            {cartItems.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Wrench className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-400">No services added yet</p>
                <p className="text-xs text-slate-500">Tap on any service or click an Ustad on the map</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                      <div className="truncate pr-2 text-slate-200">{item.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">₨ {item.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCartItem(item);
                          }}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Doorstep Visit / Fuel</span>
                    <span className="text-emerald-400 font-bold">FREE (₨ 0)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Rate Transparency Guarantee</span>
                    <span className="text-amber-400 font-semibold">100% Fixed</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Total Fixed Bill</span>
                    <span className="text-emerald-400">₨ {cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleStartBooking}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Proceed to Book Ustad
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CUSTOM SERVICE MODAL */}
      {showCustomServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Custom Repair Request</h3>
              <button onClick={() => setShowCustomServiceModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddCustomService} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">What needs repair?</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Geyser copper pipe solder, generator plug fix..."
                  className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Estimated Budget (PKR)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg transition"
              >
                Add Custom Job to Cart
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING CONFIRMATION MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Handyman Dispatch</h3>
                <p className="text-xs text-slate-400">
                  {targetSpecificUstad
                    ? `Assigning directly to ${targetSpecificUstad.name}`
                    : `Matching nearest verified ${selectedCategory} in Faisalabad`}
                </p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Address */}
            <div className="p-3 bg-[#131d2e] rounded-2xl border border-slate-700 text-xs space-y-1">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Service Location</div>
              <div className="text-white font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {selectedLocation.name}, Faisalabad
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Problem Description</label>
              <textarea
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Briefly describe the fault (e.g. spark in lounge board)..."
                className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Urgency */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Urgency Level</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('immediate')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    urgency === 'immediate'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-white text-xs">Immediate Emergency</div>
                  <div className="text-[10px]">Arrives within 15-20 mins</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('scheduled')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    urgency === 'scheduled'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-white text-xs">Schedule for Later</div>
                  <div className="text-[10px]">Fixed appointment time</div>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-2 rounded-xl border text-center transition ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Banknote className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  Cash on Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`p-2 rounded-xl border text-center transition ${
                    paymentMethod === 'jazzcash'
                      ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  JazzCash
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`p-2 rounded-xl border text-center transition ${
                    paymentMethod === 'easypaisa'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  Easypaisa
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-[#090e17] p-3.5 rounded-2xl flex items-center justify-between text-sm border border-slate-800">
              <span className="text-slate-400">Total Fixed Amount:</span>
              <span className="text-lg font-black text-emerald-400">₨ {cartTotal}</span>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Dispatch Nearby Ustad Now
            </button>
          </div>
        </div>
      )}

      {/* DIGITAL WALLET OTP SIMULATOR (JazzCash / Easypaisa) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-amber-500/50 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white capitalize">{paymentMethod} Authorization</h3>
              <p className="text-xs text-slate-400">Enter your mobile wallet details to approve ₨ {cartTotal}</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Mobile Account Number</label>
                <input
                  type="text"
                  value={mobileAccount}
                  onChange={(e) => setMobileAccount(e.target.value)}
                  className="w-full bg-[#090e17] border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">4-Digit MPIN / OTP Code</label>
                <input
                  type="password"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="• • • •"
                  className="w-full bg-[#090e17] border border-slate-700 rounded-xl p-2.5 text-white text-center font-mono tracking-widest text-lg"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-1"
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Authorize ₨ ' + cartTotal}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE CHAT MODAL */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full h-[520px] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0b101b]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold">
                  {assignedUstad?.name[0] || 'U'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{assignedUstad?.name || 'Ustad Online Partner'}</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Faisalabad Dispatch Active
                  </p>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-[#182233] text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-70 block text-right mt-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-800 flex items-center gap-2 bg-[#0b101b]">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type in Urdu or English..."
                className="flex-1 bg-[#101726] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED PHONE CALL MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl">
            <div className="relative mx-auto w-24 h-24">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 animate-pulse-ring absolute inset-0" />
              <img
                src={assignedUstad?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 relative z-10 mx-auto"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{assignedUstad?.name || 'Ustad Tariq Mehmood'}</h3>
              <p className="text-xs text-emerald-400">Connected • In-App Call 00:{callDuration}</p>
              <p className="text-xs text-slate-400">{assignedUstad?.phone || '0300-8654321'}</p>
            </div>

            <div className="p-3 bg-[#090e17] rounded-xl border border-slate-800 text-xs text-slate-300 italic">
              &ldquo;Assalam-o-Alaikum sir! Main D-Ground commercial area cross kar raha hoon, bas do minute mein aap ke gate pe.&rdquo;
            </div>

            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 rotate-[135deg]" />
              End Call
            </button>
          </div>
        </div>
      )}

      {/* POST-SERVICE REVIEW & RATING MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">How was your service experience?</h3>
              <p className="text-xs text-slate-400">
                Job #{activeBooking?.id} • Fixed Bill: ₨ {activeBooking?.totalPrice}
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingStars(star)}
                  className="p-1 transition hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {['Punctual & On Time', 'Transparent Rate', 'Expert Handyman', 'Polite Behaviour', 'Cleaned up afterwards'].map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border transition ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share honest feedback for Ustad..."
              className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleCompleteAndReview}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg transition"
            >
              Submit Rating & Close Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
