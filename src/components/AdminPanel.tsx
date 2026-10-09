'use client';

import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Edit2,
  Plus,
  Send,
  Percent,
  CheckCircle2,
  Trash2,
  Eye,
  BellRing,
  Award
} from 'lucide-react';
import { UstadProfile, Booking, ServiceItem } from '@/data/mockData';
import { playChime } from '@/utils/audio';

interface AdminPanelProps {
  ustads: UstadProfile[];
  bookings: Booking[];
  onToggleVerifyUstad: (ustadId: string) => void;
  onBlockUstad: (ustadId: string) => void;
  onDeleteUstad?: (ustadId: string) => void;
  services: ServiceItem[];
  onUpdateServicePrice: (serviceId: string, newPrice: number) => void;
  onAddNewService: (newService: ServiceItem) => void;
  onDeleteService?: (serviceId: string) => void;
  onUpdateBookingStatus?: (bookingId: string, newStatus: Booking['status']) => void;
  onBroadcastNotification?: (title: string, message: string) => void;
}

export default function AdminPanel({
  ustads,
  bookings,
  onToggleVerifyUstad,
  onDeleteUstad,
  services,
  onUpdateServicePrice,
  onAddNewService,
  onDeleteService,
  onUpdateBookingStatus,
  onBroadcastNotification,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'pricing' | 'bookings' | 'disputes' | 'broadcast'>('overview');

  // Service price edit state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState('');

  // Add new service modal
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('500');
  const [newServiceCat, setNewServiceCat] = useState<'electrician' | 'plumber' | 'ac' | 'bike' | 'car' | 'carpenter'>('electrician');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // CNIC Inspect modal
  const [inspectUstad, setInspectUstad] = useState<UstadProfile | null>(null);

  // Broadcast Notification state
  const [broadcastTitle, setBroadcastTitle] = useState('Special Discount Announcement');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'customers' | 'ustads'>('all');
  const [broadcastMsg, setBroadcastMsg] = useState('Flat 15% discount on all AC Servicing in Faisalabad today! Book your certified Ustad now.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Dynamic Complaints state
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-101',
      customer: 'Sufyan Rauf (Kohinoor)',
      ustad: 'Ustad Tariq Mehmood',
      issue: 'Customer claims job completed 15 mins late due to rain.',
      status: 'resolved',
      solution: 'Explained weather delay, provided ₨ 100 coupon voucher.',
    },
    {
      id: 'CMP-102',
      customer: 'Khurram Shehzad (D-Ground)',
      ustad: 'Muhammad Asif',
      issue: 'Requested extra fitting for basin pipe without prior price confirmation.',
      status: 'pending',
      solution: 'Under review by operations desk.',
    },
  ]);

  // Add new complaint modal
  const [showAddComplaintModal, setShowAddComplaintModal] = useState(false);
  const [newComplaintCustomer, setNewComplaintCustomer] = useState('');
  const [newComplaintUstad, setNewComplaintUstad] = useState('');
  const [newComplaintIssue, setNewComplaintIssue] = useState('');

  // Calculations
  const totalRevenueGMV = bookings.reduce((acc, b) => acc + b.totalPrice, 0) + 142500;
  const platformCommissionTotal = Math.round(totalRevenueGMV * 0.1);
  const totalUstadsCount = ustads.length;
  const pendingVerificationsCount = ustads.filter((u) => !u.isVerified).length;

  const handleSavePrice = (serviceId: string) => {
    playChime('click');
    const num = Number(editPriceInput);
    if (!isNaN(num) && num > 0) {
      onUpdateServicePrice(serviceId, num);
    }
    setEditingServiceId(null);
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playChime('success');
    const newS: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: newServiceName,
      price: Number(newServicePrice),
      category: newServiceCat,
      duration: '30-45 min',
      description: newServiceDesc || 'Standard doorstep professional service',
      icon: 'Wrench',
    };
    onAddNewService(newS);
    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  const handleResolveComplaint = (id: string) => {
    playChime('success');
    setComplaints(complaints.map((c) => (c.id === id ? { ...c, status: 'resolved', solution: 'Mediation complete by Admin.' } : c)));
  };

  const handleAddComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playChime('click');
    setComplaints([
      {
        id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
        customer: newComplaintCustomer,
        ustad: newComplaintUstad || 'Unassigned',
        issue: newComplaintIssue,
        status: 'pending',
        solution: 'Case registered. Support calling customer.',
      },
      ...complaints,
    ]);
    setShowAddComplaintModal(false);
    setNewComplaintCustomer('');
    setNewComplaintUstad('');
    setNewComplaintIssue('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    playChime('alert');
    if (onBroadcastNotification) {
      onBroadcastNotification(broadcastTitle, broadcastMsg);
    }
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header: Luxurious Dark Obsidian & Amber/Gold accents (Zero Blue) */}
      <div className="bg-gradient-to-r from-[#0d1422] via-[#1a2334] to-[#0d1422] border border-amber-600/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admin Web Management Console
            </span>
            <span className="text-xs text-slate-300">HQ • Faisalabad Control Tower</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Ustad Online <span className="text-amber-400">Master Operations</span>
          </h2>
          <p className="text-xs text-slate-300">
            Real-time 10% platform commission accounting, NADRA CNIC approvals & dispatch matrix.
          </p>
        </div>

        {/* Tab Buttons (Zero Blue) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#090e17] p-1.5 rounded-2xl border border-slate-800 text-xs">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'verifications' as const, label: `Verifications (${pendingVerificationsCount})` },
            { id: 'pricing' as const, label: 'Price Cards' },
            { id: 'bookings' as const, label: 'All Bookings' },
            { id: 'disputes' as const, label: 'Complaints' },
            { id: 'broadcast' as const, label: 'Notifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playChime('click');
                setActiveTab(tab.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#101726] border border-slate-800 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Gross Merchandise Value (GMV)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">
                ₨ {totalRevenueGMV.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +24.8% growth in Faisalabad
              </div>
            </div>

            <div className="bg-[#101726] border border-amber-900/50 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
                <span>Platform Commission (10%)</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 mt-2">
                ₨ {platformCommissionTotal.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">App net profit margin</div>
            </div>

            <div className="bg-[#101726] border border-slate-800 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Registered Ustads</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">{totalUstadsCount}</div>
              <div className="text-[11px] text-amber-400 mt-1 font-semibold">
                {pendingVerificationsCount} pending verification
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Customer Satisfaction</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">4.92 ★</div>
              <div className="text-[11px] text-slate-400 mt-1">Based on 680+ ratings</div>
            </div>
          </div>

          {/* Business Model Flow Summary */}
          <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>10% Platform Commission Financial Pipeline</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#090e17] rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Step 1: Customer Booking</div>
                <div className="font-bold text-white">Fixed Price Transparent Billing</div>
                <div className="text-slate-400 text-[11px]">Customer pays guaranteed rate without market bargaining.</div>
              </div>
              <div className="p-3 bg-[#090e17] rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Step 2: Service Delivery</div>
                <div className="font-bold text-emerald-400">Ustad Gets 90% Net Take-home</div>
                <div className="text-slate-400 text-[11px]">Empowering local blue-collar workers with dignified earnings.</div>
              </div>
              <div className="p-3 bg-[#17221d] rounded-2xl border border-emerald-800/80 space-y-1">
                <div className="text-amber-400">Step 3: App Retention</div>
                <div className="font-bold text-white">10% Platform Operational Cut</div>
                <div className="text-slate-300 text-[11px]">Funds server costs, Nadra verification APIs, and 24/7 support.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATIONS TAB */}
      {activeTab === 'verifications' && (
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">NADRA CNIC & Skill Verification Desk</h3>
              <p className="text-xs text-slate-400">Inspect credentials before granting mechanic access to public jobs</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/80 text-amber-300 font-bold">
              {ustads.length} Total Partners
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {ustads.map((u) => (
              <div key={u.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-11 h-11 rounded-2xl object-cover border border-slate-700" />
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{u.name}</span>
                      {u.isVerified ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                          Verification Pending
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      CNIC: <span className="font-mono text-slate-300">{u.cnic}</span> • Trade: <span className="capitalize text-emerald-400 font-semibold">{u.skill}</span> • {u.experienceYears} yrs exp.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playChime('click');
                      setInspectUstad(u);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect CNIC
                  </button>
                  <button
                    onClick={() => {
                      playChime(u.isVerified ? 'alert' : 'success');
                      onToggleVerifyUstad(u.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                      u.isVerified
                        ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                    }`}
                  >
                    {u.isVerified ? 'Suspend / Revoke' : 'Approve & Verify'}
                  </button>
                  {onDeleteUstad && (
                    <button
                      onClick={() => {
                        playChime('alert');
                        onDeleteUstad(u.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                      title="Remove partner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRICING TAB (Rate Card Editor) */}
      {activeTab === 'pricing' && (
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Fixed Price & Rate Card Management</h3>
              <p className="text-xs text-slate-400">
                Update standard fixed rates for Faisalabad. These rates reflect directly in the customer mobile app.
              </p>
            </div>
            <button
              onClick={() => {
                playChime('click');
                setShowAddServiceModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              Add New Service Rate
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Service Name</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Current Fixed Price (PKR)</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {services.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td className="py-3 capitalize text-emerald-400 font-semibold">{item.category}</td>
                    <td className="py-3 text-slate-400">{item.duration}</td>
                    <td className="py-3 font-bold text-emerald-400">
                      {editingServiceId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <span>₨</span>
                          <input
                            type="number"
                            value={editPriceInput}
                            onChange={(e) => setEditPriceInput(e.target.value)}
                            className="w-20 bg-[#090e17] border border-slate-700 rounded px-2 py-0.5 text-xs text-white"
                          />
                        </div>
                      ) : (
                        `₨ ${item.price}`
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingServiceId === item.id ? (
                          <button
                            onClick={() => handleSavePrice(item.id)}
                            className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded text-xs"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingServiceId(item.id);
                              setEditPriceInput(String(item.price));
                            }}
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteService && (
                          <button
                            onClick={() => {
                              playChime('click');
                              onDeleteService(item.id);
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Faisalabad Live Dispatch Matrix</h3>
            <span className="text-xs text-slate-400">{bookings.length} Total Bookings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Booking ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Address</th>
                  <th className="pb-3 font-semibold">Assigned Ustad</th>
                  <th className="pb-3 font-semibold">Bill</th>
                  <th className="pb-3 font-semibold">App 10%</th>
                  <th className="pb-3 font-semibold">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-emerald-400">{b.id}</td>
                    <td className="py-3 font-semibold text-white">{b.userName}</td>
                    <td className="py-3 text-slate-300 max-w-[180px] truncate">{b.userAddress}</td>
                    <td className="py-3 text-slate-300">{b.ustadName || 'Searching...'}</td>
                    <td className="py-3 font-bold text-white">₨ {b.totalPrice}</td>
                    <td className="py-3 font-bold text-amber-400">₨ {Math.round(b.totalPrice * 0.1)}</td>
                    <td className="py-3">
                      {onUpdateBookingStatus ? (
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as Booking['status'])}
                          className="bg-[#090e17] border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-emerald-400 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="on_the_way">On the Way</option>
                          <option value="working">Working</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className="capitalize">{b.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISPUTES & COMPLAINTS TAB */}
      {activeTab === 'disputes' && (
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Dispute & Customer Complaint Handling</h3>
            <button
              onClick={() => {
                playChime('click');
                setShowAddComplaintModal(true);
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Register New Complaint
            </button>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 bg-[#090e17] border border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{c.id} • {c.customer}</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {c.status}
                    </span>
                    {c.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveComplaint(c.id)}
                        className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-black rounded-lg text-[10px]"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-slate-400">
                  Against: <span className="text-slate-200 font-semibold">{c.ustad}</span>
                </div>
                <p className="text-slate-300 italic">&ldquo;{c.issue}&rdquo;</p>
                <div className="text-emerald-400 text-[11px] pt-1 border-t border-slate-800">
                  Resolution: {c.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BROADCAST PUSH NOTIFICATIONS TAB */}
      {activeTab === 'broadcast' && (
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-w-xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Broadcast Push Notification Dispatcher</span>
            </h3>
            <p className="text-xs text-slate-400">
              Send instant mobile alerts to Customers or Ustads across Faisalabad via Firebase Cloud Messaging (FCM).
            </p>
          </div>

          {broadcastSent && (
            <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Broadcast sent to active devices in Faisalabad!
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Audience</label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value as 'all' | 'customers' | 'ustads')}
                className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="all">All Users & Ustads (Faisalabad Wide)</option>
                <option value="customers">Only Customers</option>
                <option value="ustads">Only Verified Ustads</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Notification Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Push Message Body</label>
              <textarea
                rows={3}
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Push Alert via Firebase FCM
            </button>
          </form>
        </div>
      )}

      {/* INSPECT CNIC MODAL (Zero Blue) */}
      {inspectUstad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">NADRA Smart Card CNIC Preview</h3>
              <button onClick={() => setInspectUstad(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-gradient-to-r from-[#11221a] via-[#0f172a] to-[#1a1711] border border-emerald-500/60 rounded-2xl p-4 shadow-inner relative space-y-3">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                <span>Islamic Republic of Pakistan</span>
                <span>National Identity Card</span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={inspectUstad.avatar}
                  alt={inspectUstad.name}
                  className="w-16 h-20 rounded-xl object-cover border border-emerald-500"
                />
                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 text-[10px]">Name:</div>
                  <div className="font-bold text-white text-sm">{inspectUstad.name}</div>
                  <div className="text-slate-400 text-[10px]">CNIC Number:</div>
                  <div className="font-mono font-bold text-emerald-300 text-sm">{inspectUstad.cnic}</div>
                  <div className="text-slate-400 text-[10px]">Trade / Skill:</div>
                  <div className="capitalize font-semibold text-amber-400">{inspectUstad.skill} ({inspectUstad.experienceYears} Years)</div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <span>NADRA Microchip Verified</span>
                <span className="text-emerald-400 font-bold">FAISALABAD DIVISION</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onToggleVerifyUstad(inspectUstad.id);
                  setInspectUstad(null);
                }}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Toggle Approval Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Fixed Price Item</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddServiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Service Title</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g., Washing Machine Motor Repair"
                  className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={newServiceCat}
                    onChange={(e) => setNewServiceCat(e.target.value as ServiceItem['category'])}
                    className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                    <option value="ac">AC Technician</option>
                    <option value="bike">Bike Mechanic</option>
                    <option value="car">Car Mechanic</option>
                    <option value="carpenter">Carpenter</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Fixed Price (PKR)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description / Scope of Work</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="What is included in this fixed price..."
                  className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
              >
                Publish to Fixed Rate Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD COMPLAINT MODAL */}
      {showAddComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Customer Complaint</h3>
              <button onClick={() => setShowAddComplaintModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddComplaintSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Customer Name & Location</label>
                <input
                  type="text"
                  value={newComplaintCustomer}
                  onChange={(e) => setNewComplaintCustomer(e.target.value)}
                  placeholder="e.g. Tariq Javed (Madina Town)"
                  className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assigned Ustad (Optional)</label>
                <input
                  type="text"
                  value={newComplaintUstad}
                  onChange={(e) => setNewComplaintUstad(e.target.value)}
                  placeholder="e.g. Ustad Tariq Mehmood"
                  className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Complaint Details</label>
                <textarea
                  rows={3}
                  value={newComplaintIssue}
                  onChange={(e) => setNewComplaintIssue(e.target.value)}
                  placeholder="Describe the complaint..."
                  className="w-full bg-[#090e17] border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
              >
                Submit to Dispute Desk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
