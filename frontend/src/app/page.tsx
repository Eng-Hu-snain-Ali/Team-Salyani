'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Smartphone,
  Building2,
  Presentation,
  Bell,
  X
} from 'lucide-react';
import {
  FAISALABAD_LOCATIONS,
  FIXED_RATE_CARD,
  INITIAL_USTADS,
  INITIAL_BOOKINGS,
  UstadProfile,
  Booking,
  ServiceItem,
  FaisalabadLocation
} from '@/data/mockData';
import CustomerApp from '@/components/CustomerApp';
import UstadApp from '@/components/UstadApp';
import AdminPanel from '@/components/AdminPanel';
import PresentationAndArchitecture from '@/components/PresentationAndArchitecture';
import { playChime } from '@/utils/audio';

export default function Home() {
  // Global synchronized state
  const [activeModule, setActiveModule] = useState<'customer' | 'ustad' | 'admin' | 'docs'>('customer');
  const [selectedLocation, setSelectedLocation] = useState<FaisalabadLocation>(FAISALABAD_LOCATIONS[0]);
  const [ustads, setUstads] = useState<UstadProfile[]>(INITIAL_USTADS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [services, setServices] = useState<ServiceItem[]>(FIXED_RATE_CARD);

  // Selected Ustad for partner view
  const [currentUstadId, setCurrentUstadId] = useState<string>('ustad-101');

  // Mobile Frame Simulation toggle
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(false);

  // Dynamic In-App Broadcast Toast
  const [activeBroadcastToast, setActiveBroadcastToast] = useState<{ title: string; message: string } | null>(null);

  // Current active partner
  const currentUstad = ustads.find((u) => u.id === currentUstadId) || ustads[0];

  // Actions
  const handleNewBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Notify Ustad partner view
    setActiveBroadcastToast({
      title: 'New Booking Alert!',
      message: `Customer ${newBooking.userName} booked ${newBooking.serviceItems.join(', ')} (₨ ${newBooking.totalPrice}) at ${newBooking.userAddress}.`,
    });
  };

  const handleUpdateBooking = (updated: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleToggleVerifyUstad = (ustadId: string) => {
    setUstads((prev) =>
      prev.map((u) => (u.id === ustadId ? { ...u, isVerified: !u.isVerified } : u))
    );
  };

  const handleBlockUstad = (ustadId: string) => {
    setUstads((prev) =>
      prev.map((u) => (u.id === ustadId ? { ...u, isAvailable: false, isVerified: false } : u))
    );
  };

  const handleDeleteUstad = (ustadId: string) => {
    setUstads((prev) => prev.filter((u) => u.id !== ustadId));
  };

  const handleUpdateServicePrice = (serviceId: string, newPrice: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s))
    );
  };

  const handleAddNewService = (newS: ServiceItem) => {
    setServices((prev) => [...prev, newS]);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const handleRegisterNewUstad = (ustadData: Partial<UstadProfile>) => {
    const newU: UstadProfile = {
      id: `ustad-${Date.now()}`,
      name: ustadData.name || 'New Applicant',
      phone: ustadData.phone || '0300-0000000',
      cnic: ustadData.cnic || '33100-0000000-0',
      skill: ustadData.skill || 'electrician',
      experienceYears: ustadData.experienceYears || 3,
      rating: 5.0,
      totalReviews: 0,
      totalJobs: 0,
      earningsPKR: 0,
      isVerified: false,
      isAvailable: false,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      locationName: 'Faisalabad City',
      lat: 31.4187,
      lng: 73.0791,
      skillsBadges: ['Verified Background'],
    };
    setUstads((prev) => [newU, ...prev]);
  };

  const handleBroadcastNotification = (title: string, message: string) => {
    setActiveBroadcastToast({ title, message });
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Floating Broadcast Notification Toast */}
      {activeBroadcastToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-[#141e2f] border-2 border-amber-500 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wide">
                  {activeBroadcastToast.title}
                </h4>
                <p className="text-xs text-slate-200 mt-1 leading-snug">
                  {activeBroadcastToast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveBroadcastToast(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOP PERSISTENT NAVBAR - Warm Charcoal & Emerald/Gold Theme (Zero Blue) */}
      <header className="sticky top-0 z-40 bg-[#0c121d]/95 backdrop-blur-md border-b border-emerald-900/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-amber-500 to-orange-500 p-0.5 shadow-lg shadow-emerald-950/60">
                <div className="w-full h-full rounded-2xl bg-[#090e17] flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-400 rotate-45" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight text-white">
                    Ustad Online
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30">
                    Faisalabad
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>On-Demand Mechanic & Handyman Platform</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playChime('click');
                setIsMobileFrameView(!isMobileFrameView);
              }}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
              title="Toggle Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Module Switcher Tabs (Zero Blue - Warm Gold & Emerald Theme) */}
          <div className="flex items-center gap-1.5 bg-[#080d16] p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                playChime('click');
                setActiveModule('customer');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
                activeModule === 'customer'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer App</span>
            </button>

            <button
              onClick={() => {
                playChime('click');
                setActiveModule('ustad');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
                activeModule === 'ustad'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Ustad / Partner App</span>
            </button>

            <button
              onClick={() => {
                playChime('click');
                setActiveModule('admin');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
                activeModule === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Admin Web Panel</span>
            </button>

            <button
              onClick={() => {
                playChime('click');
                setActiveModule('docs');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
                activeModule === 'docs'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>PPT, ER & Flutter</span>
            </button>
          </div>

          {/* Right Utilities */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                playChime('click');
                setIsMobileFrameView(!isMobileFrameView);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                isMobileFrameView
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                  : 'bg-[#121a28] hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isMobileFrameView ? 'Exit Mobile Frame' : 'Mobile View Frame'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {isMobileFrameView ? (
          <div className="py-6 flex justify-center">
            <div className="w-full max-w-[430px] bg-[#0c121d] border-8 border-slate-800 rounded-[48px] shadow-2xl p-4 overflow-hidden relative min-h-[850px] flex flex-col">
              <div className="w-32 h-4 bg-[#070b12] rounded-full mx-auto mb-4 border border-slate-800" />

              <div className="flex-1 overflow-y-auto pr-1">
                {activeModule === 'customer' && (
                  <CustomerApp
                    locations={FAISALABAD_LOCATIONS}
                    selectedLocation={selectedLocation}
                    onLocationChange={setSelectedLocation}
                    ustads={ustads}
                    services={services}
                    bookings={bookings}
                    onNewBooking={handleNewBooking}
                    onUpdateBooking={handleUpdateBooking}
                  />
                )}
                {activeModule === 'ustad' && (
                  <UstadApp
                    currentUstad={currentUstad}
                    allUstads={ustads}
                    onSelectCurrentUstad={(u) => setCurrentUstadId(u.id)}
                    bookings={bookings}
                    onUpdateBookingStatus={handleUpdateBookingStatus}
                    onRegisterNewUstad={handleRegisterNewUstad}
                  />
                )}
                {activeModule === 'admin' && (
                  <AdminPanel
                    ustads={ustads}
                    bookings={bookings}
                    onToggleVerifyUstad={handleToggleVerifyUstad}
                    onBlockUstad={handleBlockUstad}
                    onDeleteUstad={handleDeleteUstad}
                    services={services}
                    onUpdateServicePrice={handleUpdateServicePrice}
                    onAddNewService={handleAddNewService}
                    onDeleteService={handleDeleteService}
                    onUpdateBookingStatus={handleUpdateBookingStatus}
                    onBroadcastNotification={handleBroadcastNotification}
                  />
                )}
                {activeModule === 'docs' && <PresentationAndArchitecture />}
              </div>

              <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-4" />
            </div>
          </div>
        ) : (
          <div>
            {activeModule === 'customer' && (
              <CustomerApp
                locations={FAISALABAD_LOCATIONS}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                ustads={ustads}
                services={services}
                bookings={bookings}
                onNewBooking={handleNewBooking}
                onUpdateBooking={handleUpdateBooking}
              />
            )}
            {activeModule === 'ustad' && (
              <UstadApp
                currentUstad={currentUstad}
                allUstads={ustads}
                onSelectCurrentUstad={(u) => setCurrentUstadId(u.id)}
                bookings={bookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onRegisterNewUstad={handleRegisterNewUstad}
              />
            )}
            {activeModule === 'admin' && (
              <AdminPanel
                ustads={ustads}
                bookings={bookings}
                onToggleVerifyUstad={handleToggleVerifyUstad}
                onBlockUstad={handleBlockUstad}
                onDeleteUstad={handleDeleteUstad}
                services={services}
                onUpdateServicePrice={handleUpdateServicePrice}
                onAddNewService={handleAddNewService}
                onDeleteService={handleDeleteService}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onBroadcastNotification={handleBroadcastNotification}
              />
            )}
            {activeModule === 'docs' && <PresentationAndArchitecture />}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#090e17] py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">Ustad Online</span>
            <span>•</span>
            <span>On-Demand Handyman Platform (Faisalabad Pilot)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-amber-400 font-bold">10% Platform Commission Model</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">NADRA CNIC Verification</span>
            <span>•</span>
            <span>JazzCash & Easypaisa Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
