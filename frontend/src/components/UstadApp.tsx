'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Power,
  DollarSign,
  Briefcase,
  Star,
  Bell,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  TrendingUp,
  Wallet,
  ArrowDownLeft
} from 'lucide-react';
import { UstadProfile, Booking } from '@/data/mockData';
import { playChime } from '@/utils/audio';

interface UstadAppProps {
  currentUstad: UstadProfile;
  allUstads?: UstadProfile[];
  onSelectCurrentUstad?: (ustad: UstadProfile) => void;
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking['status']) => void;
  onRegisterNewUstad?: (ustadData: Partial<UstadProfile>) => void;
}

export default function UstadApp({
  currentUstad,
  allUstads = [],
  onSelectCurrentUstad,
  bookings,
  onUpdateBookingStatus,
}: UstadAppProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showIncomingJobModal, setShowIncomingJobModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawMethod, setWithdrawMethod] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [withdrawPhone, setWithdrawPhone] = useState('0300-8654321');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Dynamic withdrawals list
  const [withdrawHistory, setWithdrawHistory] = useState<Array<{ id: string; amount: number; method: string; date: string; phone: string }>>([
    { id: 'TXN-901', amount: 8500, method: 'JazzCash', date: 'Yesterday', phone: '0300-8654321' },
    { id: 'TXN-874', amount: 12000, method: 'Easypaisa', date: '4 days ago', phone: '0300-8654321' },
  ]);

  // Active booking for this ustad
  const activeJob = bookings.find(
    (b) => (b.ustadId === currentUstad.id || !b.ustadId) && (b.status === 'on_the_way' || b.status === 'working' || b.status === 'accepted')
  );

  const toggleOnline = () => {
    playChime('click');
    setIsOnline(!isOnline);
  };

  const handleSimulateIncomingJob = () => {
    playChime('alert');
    setShowIncomingJobModal(true);
  };

  const handleAcceptJob = () => {
    playChime('success');
    setShowIncomingJobModal(false);
    if (activeJob) {
      onUpdateBookingStatus(activeJob.id, 'on_the_way');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playChime('success');
    const amt = Number(withdrawAmount) || 5000;
    setWithdrawHistory([
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: amt,
        method: withdrawMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa',
        date: 'Just now',
        phone: withdrawPhone,
      },
      ...withdrawHistory,
    ]);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Partner Profile & Dynamic Persona Switcher */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Ustad Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUstad.avatar}
                alt={currentUstad.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#101726] ${
                  isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{currentUstad.name}</h2>
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NADRA Verified
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                <span className="capitalize text-emerald-400 font-bold">{currentUstad.skill}</span>
                <span>•</span>
                <span>{currentUstad.experienceYears} Years Exp.</span>
                <span>•</span>
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {currentUstad.rating} ({currentUstad.totalReviews} reviews)
                </span>
              </div>

              <div className="text-[11px] text-slate-400 mt-1">
                CNIC: <span className="font-mono text-slate-200">{currentUstad.cnic}</span> | {currentUstad.locationName}
              </div>
            </div>
          </div>

          {/* Right: Switch Partner & Status Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {allUstads.length > 0 && onSelectCurrentUstad && (
              <div className="bg-[#0b101b] border border-slate-700/80 rounded-2xl px-3 py-1.5 flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Switch Profile:</span>
                <select
                  value={currentUstad.id}
                  onChange={(e) => {
                    const u = allUstads.find((x) => x.id === e.target.value);
                    if (u) {
                      playChime('click');
                      onSelectCurrentUstad(u);
                    }
                  }}
                  className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
                >
                  {allUstads.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#0b101b] text-white">
                      {u.name} ({u.skill})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleSimulateIncomingJob}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
              Simulate Incoming Job Alert
            </button>

            <button
              onClick={toggleOnline}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 shadow-lg ${
                isOnline
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/40'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
              }`}
            >
              <Power className="w-4 h-4" />
              {isOnline ? 'Online (Accepting Jobs)' : 'Offline (Resting)'}
            </button>
          </div>
        </div>
      </div>

      {/* METRICS & EARNINGS OVERVIEW (Zero Blue) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Today&apos;s Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-white mt-2">
            ₨ {Math.round(currentUstad.earningsPKR * 0.08).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18% from yesterday
          </div>
        </div>

        <div className="bg-[#101726] border border-amber-900/40 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Wallet Balance</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-400 mt-2">
            ₨ {currentUstad.earningsPKR.toLocaleString()}
          </div>
          <button
            onClick={() => {
              playChime('click');
              setShowWithdrawModal(true);
            }}
            className="text-[11px] text-amber-300 font-bold hover:underline mt-1 block"
          >
            Withdraw to JazzCash / Easypaisa →
          </button>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Completed Jobs</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-white mt-2">
            {currentUstad.totalJobs}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">98.5% Customer Satisfaction</div>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Platform Commission</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-400 mt-2">
            10% Flat
          </div>
          <div className="text-[11px] text-slate-400 mt-1">You retain 90% of every job</div>
        </div>
      </div>

      {/* ACTIVE JOB MANAGEMENT BARRIER */}
      {activeJob ? (
        <div className="bg-gradient-to-br from-[#12231b] via-[#0f172a] to-[#0f172a] border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-4">
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-slate-950 uppercase">
                Active Job in Progress
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Booking #{activeJob.id} • {activeJob.serviceItems.join(', ')}
              </h3>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-slate-400">Total Customer Bill</div>
              <div className="text-2xl font-black text-emerald-400">₨ {activeJob.totalPrice}</div>
              <div className="text-xs text-slate-300">
                Your 90% share: <span className="font-bold text-white">₨ {Math.round(activeJob.totalPrice * 0.9)}</span> (App: ₨ {Math.round(activeJob.totalPrice * 0.1)})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#0b101b] p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Customer Details</div>
              <div className="text-white font-bold text-sm">{activeJob.userName}</div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {activeJob.userAddress}
              </div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {activeJob.userPhone}
              </div>
            </div>

            <div className="bg-[#0b101b] p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Reported Issue Description</div>
              <p className="text-slate-200 italic">
                &ldquo;{activeJob.problemDescription || 'Inspection and repair needed'}&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-slate-400 border-t border-slate-800">
                <span>Payment Mode:</span>
                <span className="uppercase font-bold text-emerald-400">{activeJob.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {activeJob.status === 'accepted' && (
              <button
                onClick={() => {
                  playChime('click');
                  onUpdateBookingStatus(activeJob.id, 'on_the_way');
                }}
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Start Navigation (I am on the way)
              </button>
            )}

            {activeJob.status === 'on_the_way' && (
              <button
                onClick={() => {
                  playChime('click');
                  onUpdateBookingStatus(activeJob.id, 'working');
                }}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Arrived at Customer Doorstep & Start Work
              </button>
            )}

            {activeJob.status === 'working' && (
              <button
                onClick={() => {
                  playChime('success');
                  onUpdateBookingStatus(activeJob.id, 'completed');
                }}
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Work Finished • Collect ₨ {activeJob.totalPrice} ({activeJob.paymentMethod.toUpperCase()})
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <Navigation className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white">Radar is Active & Listening for Faisalabad Bookings</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You are stationed near D-Ground / Kohinoor. As soon as a customer posts an electrician or handyman job, your phone will chime with the exact location and fixed price.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSimulateIncomingJob}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition"
            >
              Test Incoming Job Alert Popup
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC WITHDRAWALS LOG */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            <span>Withdrawals & Payout History</span>
          </h3>
          <span className="text-xs text-emerald-400 font-bold">JazzCash & Easypaisa Instant Transfers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Transaction ID</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Channel</th>
                <th className="pb-3 font-semibold">Account Number</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {withdrawHistory.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/40">
                  <td className="py-3 font-mono font-bold text-emerald-400">{w.id}</td>
                  <td className="py-3 font-bold text-white">₨ {w.amount.toLocaleString()}</td>
                  <td className="py-3 font-bold text-amber-400">{w.method}</td>
                  <td className="py-3 font-mono text-slate-300">{w.phone}</td>
                  <td className="py-3 text-slate-400">{w.date}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                      Transferred
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INCOMING JOB RADAR POPUP MODAL */}
      {showIncomingJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f172a] border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <h3 className="text-base font-black text-amber-400 uppercase tracking-wide">
                  New Job Request Nearby!
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
                18s left
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-[#090e17] p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Service Requested</div>
                <div className="text-sm font-bold text-white">Switch Board Spark & Ceiling Fan Capacitor Fix</div>
                <div className="text-emerald-400 font-medium">Standard Fixed Rate Guarantee</div>
              </div>

              <div className="bg-[#090e17] p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Customer Location</div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  House 12-A, D-Ground, Peoples Colony #1, Faisalabad
                </div>
                <div className="text-slate-400 text-[11px]">Distance: 1.2 km (~4 mins drive by bike)</div>
              </div>

              <div className="bg-[#112019] p-3.5 rounded-2xl border border-emerald-800/80 space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Customer Total Bill:</span>
                  <span className="font-bold text-white">₨ 750</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ustad Online Commission (10%):</span>
                  <span>- ₨ 75</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-emerald-400 pt-1 border-t border-emerald-800">
                  <span>Your Net Earning (90%):</span>
                  <span>₨ 675</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowIncomingJobModal(false)}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Pass / Reject
              </button>
              <button
                onClick={handleAcceptJob}
                className="py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition"
              >
                Accept Job Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW EARNINGS MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Withdraw Earnings</h3>
              <p className="text-xs text-slate-400">Instant transfer to JazzCash or Easypaisa account</p>
            </div>

            {withdrawSuccess ? (
              <div className="p-4 bg-emerald-950 border border-emerald-700 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">Transfer Initiated!</div>
                <div className="text-xs text-emerald-300">
                  ₨ {withdrawAmount} sent to {withdrawPhone} ({withdrawMethod.toUpperCase()}).
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Select Payout Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('jazzcash')}
                      className={`p-2.5 rounded-2xl border text-center transition ${
                        withdrawMethod === 'jazzcash'
                          ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                          : 'bg-[#090e17] border-slate-800 text-slate-400'
                      }`}
                    >
                      JazzCash Mobile
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('easypaisa')}
                      className={`p-2.5 rounded-2xl border text-center transition ${
                        withdrawMethod === 'easypaisa'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#090e17] border-slate-800 text-slate-400'
                      }`}
                    >
                      Easypaisa Wallet
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Mobile Account Number</label>
                  <input
                    type="text"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    className="w-full bg-[#090e17] border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-[#090e17] border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black shadow-lg"
                  >
                    Confirm Payout
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
