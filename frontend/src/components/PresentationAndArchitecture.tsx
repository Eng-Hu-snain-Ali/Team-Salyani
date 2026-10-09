'use client';

import React, { useState } from 'react';
import {
  Database,
  Presentation,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { playChime } from '@/utils/audio';

export default function PresentationAndArchitecture() {
  const [subTab, setSubTab] = useState<'ppt' | 'er' | 'flutter'>('ppt');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const slides = [
    {
      title: 'Ustad Online (استاد آن لائن)',
      subtitle: 'On-Demand Handyman & Mechanic Service Platform for Faisalabad',
      tagline: 'Bridging the trust and pricing gap in local home repair services',
      keyPoints: [
        'Connecting residents of Faisalabad with certified, nearby Ustads within 15-25 minutes.',
        'Solving arbitrary pricing via 100% transparent Fixed Rate Cards.',
        'Mandatory NADRA CNIC & trade skill verification for maximum home safety.',
        'Seamless multi-platform ecosystem: Customer App, Ustad Partner App, and Admin Console.',
      ],
      stats: [
        { label: 'Target City', val: 'Faisalabad, Pakistan' },
        { label: 'Core Services', val: '6 Key Trades' },
        { label: 'Commission', val: '10% Platform Cut' },
        { label: 'Verification', val: 'NADRA CNIC + Skills' },
      ],
    },
    {
      title: 'Problem Statement & Faisalabad Market Need',
      subtitle: 'Why the traditional handyman market is fundamentally broken',
      tagline: 'High friction, overcharging, and zero accountability',
      keyPoints: [
        'No centralized digital directory for finding reliable technicians in localities like D-Ground, Peoples Colony, Kohinoor & Madina Town.',
        'Severe price exploitation: Technicians demand arbitrary rates with no standardized price list.',
        'Zero background checks or safety verification for technicians entering family homes.',
        'Unproductive physical visits to physical bazaars (Ghanta Ghar, Rail Bazaar) wasting hours of time.',
      ],
      stats: [
        { label: 'Market Friction', val: 'High' },
        { label: 'Price Variance', val: 'Up to 300%' },
        { label: 'Safety Rating', val: 'Unregulated' },
        { label: 'Search Time', val: '1-3 Hours' },
      ],
    },
    {
      title: 'Objectives & Value Proposition',
      subtitle: 'Transforming informal blue-collar trade into structured gig economy',
      tagline: 'Win-win ecosystem for customers and skilled tradesmen',
      keyPoints: [
        'One-Click Doorstep Booking: Instant dispatch algorithm connects nearest available technician.',
        'Transparent Fixed Rate Card: Every job has a published baseline price (e.g. Switchboard: ₨ 300, AC Wash: ₨ 1500).',
        'Empowering Local Ustads: Mechanics receive 90% of job revenue with direct JazzCash / Easypaisa cashouts.',
        'Trust & Quality Assurance: 5-star customer review rating system and 7-day workmanship warranty.',
      ],
      stats: [
        { label: 'Customer Savings', val: 'Up to 35%' },
        { label: 'Ustad Retained', val: '90% Payout' },
        { label: 'Arrival Target', val: '15-20 Mins' },
        { label: 'Satisfaction Goal', val: '4.8+ Stars' },
      ],
    },
    {
      title: 'System Architecture & Tri-Module Ecosystem',
      subtitle: 'Engineered for high concurrency, real-time geolocation and offline resilience',
      tagline: 'Customer App + Ustad App + Central Cloud Admin',
      keyPoints: [
        'User / Customer App: Service selector, map radar, in-app messaging, digital payment checkout & reviews.',
        'Ustad Partner App: Radar job alerts, GPS turn-by-turn navigation, job step completion & digital wallet.',
        'Admin Control Desk: Verification audit desk, rate card editor, complaint mediation & push broadcast.',
        'Cloud Infrastructure: Firebase Auth (OTP), Cloud Firestore, Cloud Storage & FCM Push Notifications.',
      ],
      stats: [
        { label: 'Mobile Client', val: 'Flutter (Dart)' },
        { label: 'Backend', val: 'Firebase Cloud' },
        { label: 'Location Engine', val: 'Google Maps API' },
        { label: 'Admin Hub', val: 'Next.js App' },
      ],
    },
    {
      title: 'Business Model & Financial Projections',
      subtitle: 'Sustainable 10% take-rate monetization with high repeat order frequency',
      tagline: 'How Ustad Online generates consistent profitability',
      keyPoints: [
        '10% Commission on Completed Jobs: On a ₨ 1,000 job, Ustad receives ₨ 900 and platform keeps ₨ 100.',
        'Zero Customer Booking Fee: Eliminates user drop-off friction; customer only pays for actual repair.',
        'Future Monetization: Sponsored placement for premium hardware shops and monthly tool subscriptions.',
        'Target: 500 daily jobs in Faisalabad yielding ₨ 45,000 daily platform net revenue.',
      ],
      stats: [
        { label: 'Take Rate', val: '10% Flat' },
        { label: 'Avg Ticket Size', val: '₨ 950' },
        { label: 'Repeat Rate', val: '64% / 90 Days' },
        { label: 'Gross Margin', val: '~85%' },
      ],
    },
    {
      title: '25-Day Sprint Execution Roadmap',
      subtitle: 'Structured timeline from conceptualization to Faisalabad commercial launch',
      tagline: 'Agile sprints with demonstrable milestones',
      keyPoints: [
        'Week 1: UI/UX Wireframing, Design System, Firebase Authentication & Cloud Firestore Schema setup.',
        'Week 2: Customer App Booking Engine, Rate Card Calculator & Google Maps live geolocation radar.',
        'Week 3: Ustad Partner App, Incoming Job push notification system & active job navigation stepper.',
        'Week 4: Admin Web Portal, NADRA Verification desk, dispute resolution system & end-to-end beta trial in D-Ground.',
      ],
      stats: [
        { label: 'Sprint Length', val: '4 Weeks' },
        { label: 'Deliverables', val: '3 Modules' },
        { label: 'Pilot Hub', val: 'D-Ground, FSD' },
        { label: 'Status', val: 'On Track' },
      ],
    },
  ];

  const handleCopyCode = (key: string, code: string) => {
    playChime('click');
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#101726] border border-slate-800 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playChime('click');
              setSubTab('ppt');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'ppt'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-4 h-4" />
            1. PPT Presentation Deck (6 Slides)
          </button>

          <button
            onClick={() => {
              playChime('click');
              setSubTab('er');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'er'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            2. Database ER Diagram & Firestore Schema
          </button>

          <button
            onClick={() => {
              playChime('click');
              setSubTab('flutter');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'flutter'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            3. Flutter Mobile Project Codebase
          </button>
        </div>

        <span className="text-xs text-slate-400 pr-2 hidden md:inline">
          Architecture Documentation Hub
        </span>
      </div>

      {/* 1. PPT PRESENTATION DECK PLAYER */}
      {subTab === 'ppt' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#101726] via-[#141d2e] to-[#0a0f1a] border border-amber-600/30 rounded-3xl p-6 md:p-8 shadow-2xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
                <span className="font-bold text-amber-400 uppercase tracking-widest text-[11px]">
                  Executive Presentation • Slide {currentSlide + 1} of {slides.length}
                </span>
                <span className="bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">
                  Ustad Online Faisalabad
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-sm font-semibold text-amber-400 mt-1">
                    {slides[currentSlide].subtitle}
                  </p>
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    &ldquo;{slides[currentSlide].tagline}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {slides[currentSlide].keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#090e17] border border-slate-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
                  {slides[currentSlide].stats.map((st, i) => (
                    <div key={i} className="p-3 bg-[#0d1422] border border-slate-800 rounded-2xl text-center">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{st.label}</div>
                      <div className="text-sm font-extrabold text-white mt-0.5">{st.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                disabled={currentSlide === 0}
                onClick={() => {
                  playChime('click');
                  setCurrentSlide((prev) => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Slide
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      playChime('click');
                      setCurrentSlide(i);
                    }}
                    className={`w-3 h-3 rounded-full transition ${
                      currentSlide === i ? 'bg-amber-400 scale-125' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={currentSlide === slides.length - 1}
                onClick={() => {
                  playChime('click');
                  setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                Next Slide
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DATABASE ER DIAGRAM (Zero Blue) */}
      {subTab === 'er' && (
        <div className="space-y-6">
          <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>Cloud Firestore Entity Relationship (ER) Diagram</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Relational cardinalities and schema definitions across collections
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                4 Collections • 1-to-N Mapping
              </span>
            </div>

            <div className="w-full overflow-x-auto bg-[#090e17] p-4 rounded-3xl border border-slate-800">
              <svg viewBox="0 0 920 480" className="w-full min-w-[760px] h-[440px]">
                <defs>
                  <marker id="arrowWarm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
                  </marker>
                  <linearGradient id="tblGradWarm" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#172233" />
                    <stop offset="100%" stopColor="#0d1422" />
                  </linearGradient>
                </defs>

                {/* ENTITY: USERS (Teal & Obsidian) */}
                <g transform="translate(30, 40)">
                  <rect width="240" height="200" rx="14" fill="url(#tblGradWarm)" stroke="#0d9488" strokeWidth="2" />
                  <rect width="240" height="34" rx="14" fill="#115e59" />
                  <text x="16" y="23" fill="#ffffff" fontWeight="bold" fontSize="13">📁 Collection: users</text>
                  <text x="16" y="58" fill="#5eead4" fontSize="11" fontFamily="monospace">🔑 userId (String, PK)</text>
                  <text x="16" y="80" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• name (String)</text>
                  <text x="16" y="102" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• phone (String, OTP)</text>
                  <text x="16" y="124" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• address (String)</text>
                  <text x="16" y="146" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• lat, lng (Geopoint)</text>
                  <text x="16" y="168" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• createdAt (Timestamp)</text>
                </g>

                {/* ENTITY: USTADS (Emerald & Obsidian) */}
                <g transform="translate(650, 40)">
                  <rect width="240" height="240" rx="14" fill="url(#tblGradWarm)" stroke="#10b981" strokeWidth="2" />
                  <rect width="240" height="34" rx="14" fill="#064e3b" />
                  <text x="16" y="23" fill="#ffffff" fontWeight="bold" fontSize="13">📁 Collection: ustads</text>
                  <text x="16" y="58" fill="#6ee7b7" fontSize="11" fontFamily="monospace">🔑 ustadId (String, PK)</text>
                  <text x="16" y="80" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• name (String)</text>
                  <text x="16" y="102" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• phone (String)</text>
                  <text x="16" y="124" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• cnic (String, NADRA)</text>
                  <text x="16" y="146" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• skill (Enum, Trade)</text>
                  <text x="16" y="168" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• isVerified (Boolean)</text>
                  <text x="16" y="190" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• isAvailable (Boolean)</text>
                  <text x="16" y="212" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• rating (Number 1-5)</text>
                </g>

                {/* ENTITY: BOOKINGS (Warm Amber & Gold) */}
                <g transform="translate(330, 160)">
                  <rect width="260" height="260" rx="14" fill="url(#tblGradWarm)" stroke="#f59e0b" strokeWidth="2" />
                  <rect width="260" height="34" rx="14" fill="#78350f" />
                  <text x="16" y="23" fill="#ffffff" fontWeight="bold" fontSize="13">📁 Collection: bookings</text>
                  <text x="16" y="58" fill="#fde68a" fontSize="11" fontFamily="monospace">🔑 bookingId (String, PK)</text>
                  <text x="16" y="80" fill="#5eead4" fontSize="11" fontFamily="monospace">🔗 userId (String, FK)</text>
                  <text x="16" y="102" fill="#6ee7b7" fontSize="11" fontFamily="monospace">🔗 ustadId (String, FK)</text>
                  <text x="16" y="124" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• serviceType (String)</text>
                  <text x="16" y="146" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• price (Number, PKR)</text>
                  <text x="16" y="168" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• status (pending/done)</text>
                  <text x="16" y="190" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• problemDesc (String)</text>
                  <text x="16" y="212" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• problemImgUrl (URL)</text>
                  <text x="16" y="234" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• date (Timestamp)</text>
                </g>

                {/* ENTITY: REVIEWS (Rose & Obsidian) */}
                <g transform="translate(30, 290)">
                  <rect width="240" height="170" rx="14" fill="url(#tblGradWarm)" stroke="#f43f5e" strokeWidth="2" />
                  <rect width="240" height="34" rx="14" fill="#881337" />
                  <text x="16" y="23" fill="#ffffff" fontWeight="bold" fontSize="13">📁 Collection: reviews</text>
                  <text x="16" y="58" fill="#fecdd3" fontSize="11" fontFamily="monospace">🔑 reviewId (String, PK)</text>
                  <text x="16" y="80" fill="#fde68a" fontSize="11" fontFamily="monospace">🔗 bookingId (String, FK)</text>
                  <text x="16" y="102" fill="#6ee7b7" fontSize="11" fontFamily="monospace">🔗 ustadId (String, FK)</text>
                  <text x="16" y="124" fill="#5eead4" fontSize="11" fontFamily="monospace">🔗 userId (String, FK)</text>
                  <text x="16" y="146" fill="#cbd5e1" fontSize="11" fontFamily="monospace">• rating (1-5) & comment</text>
                </g>

                {/* RELATIONSHIP LINES */}
                <path d="M 270,140 L 330,220" stroke="#0d9488" strokeWidth="2.5" markerEnd="url(#arrowWarm)" />
                <text x="285" y="170" fill="#5eead4" fontSize="10" fontWeight="bold">1 : N</text>

                <path d="M 650,160 L 590,220" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowWarm)" />
                <text x="615" y="180" fill="#6ee7b7" fontSize="10" fontWeight="bold">1 : N</text>

                <path d="M 330,340 L 270,340" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrowWarm)" />
                <text x="285" y="332" fill="#fde68a" fontSize="10" fontWeight="bold">1 : 1</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 3. FLUTTER STARTER CODE */}
      {subTab === 'flutter' && (
        <div className="space-y-6">
          <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span>Flutter Starter Project Structure</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Production-ready Android + iOS Flutter architecture with Firebase Firestore integrations
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                Flutter 3.x • Dart
              </span>
            </div>

            <div className="bg-[#090e17] p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold">flutter_ustad_online/</div>
              <div className="pl-4">├── pubspec.yaml (firebase_core, cloud_firestore, google_maps_flutter)</div>
              <div className="pl-4">├── lib/</div>
              <div className="pl-8">├── main.dart (Dark Emerald & Amber Theme)</div>
              <div className="pl-8">├── models/</div>
              <div className="pl-12">├── ustad_model.dart</div>
              <div className="pl-12">└── booking_model.dart</div>
              <div className="pl-8">├── services/</div>
              <div className="pl-12">└── firebase_service.dart</div>
              <div className="pl-8">└── screens/</div>
              <div className="pl-12">└── customer_home_screen.dart</div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Key Dart Implementation: <code className="text-emerald-400">lib/models/booking_model.dart</code>
                </span>
                <button
                  onClick={() =>
                    handleCopyCode(
                      'model',
                      `class BookingModel {
  final String id;
  final String userId;
  final String ustadId;
  final String serviceType;
  final double totalPrice;
  final String status;

  BookingModel({
    required this.id,
    required this.userId,
    required this.ustadId,
    required this.serviceType,
    required this.totalPrice,
    required this.status,
  });
}`
                    )
                  }
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  {copiedKey === 'model' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'model' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="bg-[#090e17] p-4 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
{`// lib/models/booking_model.dart
class BookingModel {
  final String id;
  final String userId;
  final String ustadId;
  final String serviceType;
  final double totalPrice;
  final double platformCommission; // 10%
  final String status; // pending, accepted, on_the_way, completed

  BookingModel({
    required this.id,
    required this.userId,
    required this.ustadId,
    required this.serviceType,
    required this.totalPrice,
    required this.platformCommission,
    required this.status,
  });
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
