'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShieldCheck,
  Star,
  Phone,
  CheckCircle2,
  X
} from 'lucide-react';
import { UstadProfile, FaisalabadLocation } from '@/data/mockData';
import { playChime } from '@/utils/audio';

interface FaisalabadMapProps {
  userLocation: FaisalabadLocation;
  onUserLocationMove?: (newCoords: { lat: number; lng: number; name: string }) => void;
  ustads: UstadProfile[];
  selectedCategory?: string;
  activeBookingUstad?: UstadProfile | null;
  bookingStatus?: string;
  onSelectUstad?: (ustad: UstadProfile) => void;
  onDirectBookUstad?: (ustad: UstadProfile) => void;
}

export default function FaisalabadMap({
  userLocation,
  onUserLocationMove,
  ustads,
  selectedCategory,
  activeBookingUstad,
  bookingStatus,
  onSelectUstad,
  onDirectBookUstad,
}: FaisalabadMapProps) {
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  const [movingProgress, setMovingProgress] = useState(0.2);
  const [inspectedUstad, setInspectedUstad] = useState<UstadProfile | null>(null);
  const [customPinPos, setCustomPinPos] = useState<{ x: number; y: number } | null>(null);

  // Filter ustads matching category if any, or available
  const visibleUstads = ustads.filter((u) => {
    if (selectedCategory && selectedCategory !== 'all') {
      return u.skill === selectedCategory;
    }
    return true;
  });

  // Animate Ustad coming when status is 'on_the_way'
  useEffect(() => {
    if (bookingStatus !== 'on_the_way') {
      return;
    }
    const interval = setInterval(() => {
      setMovingProgress((prev) => {
        if (prev >= 0.95) return 0.95;
        return prev + 0.05;
      });
    }, 1200);
    return () => {
      clearInterval(interval);
      setMovingProgress(0.2);
    };
  }, [bookingStatus]);

  // User home pin
  const userX = customPinPos ? customPinPos.x : 450;
  const userY = customPinPos ? customPinPos.y : 260;

  // Moving Ustad coordinates
  const startX = 220;
  const startY = 120;
  const currentUstadX = startX + (userX - startX) * movingProgress;
  const currentUstadY = startY + (userY - startY) * movingProgress;

  // Handle click on map SVG to dynamically reposition user location
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 900;
    const y = ((e.clientY - rect.top) / rect.height) * 520;
    playChime('click');
    setCustomPinPos({ x, y });
    if (onUserLocationMove) {
      onUserLocationMove({
        lat: 31.4118 + (y - 260) * 0.0001,
        lng: 73.0978 + (x - 450) * 0.0001,
        name: `Custom Location Pin (${Math.round(x)}, ${Math.round(y)})`,
      });
    }
  };

  return (
    <div className="relative w-full h-[420px] md:h-[490px] bg-[#090e17] rounded-3xl overflow-hidden border border-emerald-900/40 shadow-2xl select-none">
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-[#101726]/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-600/40 shadow-xl pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-200">
            Faisalabad Live Grid: <span className="text-emerald-400 font-bold">{userLocation.name}</span>
          </span>
          <span className="text-[10px] text-amber-400/90 hidden sm:inline ml-1">(Click map to move pin)</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              playChime('click');
              setMapMode(mapMode === 'streets' ? 'satellite' : 'streets');
            }}
            className="flex items-center gap-1.5 text-xs bg-[#101726]/90 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-2xl border border-slate-700/80 transition shadow-xl font-medium"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{mapMode}</span>
          </button>
        </div>
      </div>

      {/* SVG Vector Map Rendering */}
      <svg
        onClick={handleMapClick}
        className="w-full h-full object-cover transition-colors duration-500 cursor-crosshair"
        viewBox="0 0 900 520"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="warmGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>
          <pattern id="streetGridWarm" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1c2538" strokeWidth="1" strokeDasharray="2,4" />
          </pattern>
          <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Background: Deep charcoal / obsidian (no cold blue) */}
        <rect width="900" height="520" fill={mapMode === 'satellite' ? '#070a10' : '#0a0f1a'} />
        <rect width="900" height="520" fill="url(#streetGridWarm)" opacity="0.6" />

        {/* Faisalabad Canal Vector - Styled in rich Emerald / Teal */}
        <path
          d="M 50,20 Q 350,150 550,220 T 880,360"
          fill="none"
          stroke="#0d9488"
          strokeWidth="14"
          opacity="0.35"
        />
        <path
          d="M 50,20 Q 350,150 550,220 T 880,360"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="3.5"
          strokeDasharray="8,6"
          opacity="0.8"
        />
        <text x="720" y="325" fill="#2dd4bf" fontSize="11" opacity="0.85" fontWeight="700">
          Canal Road Expressway
        </text>

        {/* Major Faisalabad Roads Network */}
        {/* Jaranwala Road */}
        <path d="M 120,480 L 780,110" stroke="#334155" strokeWidth="6" opacity="0.6" />
        <text x="210" y="440" fill="#94a3b8" fontSize="10" transform="rotate(-28, 210, 440)">Jaranwala Road</text>

        {/* D-Ground Ring in Radiant Emerald */}
        <circle cx="580" cy="330" r="45" fill="none" stroke="#10b981" strokeWidth="3.5" opacity="0.4" strokeDasharray="4,4" />
        <text x="548" y="334" fill="#34d399" fontSize="11" fontWeight="800">D-Ground</text>

        {/* Clock Tower / Ghanta Ghar Hub (Eight Radiating Bazaars) in Warm Gold */}
        <g transform="translate(180, 290)">
          <circle cx="0" cy="0" r="32" fill="#1b2434" stroke="#f59e0b" strokeWidth="2.5" opacity="0.9" />
          <circle cx="0" cy="0" r="12" fill="#f59e0b" opacity="0.85" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((angle * Math.PI) / 180) * 85}
              y2={Math.sin((angle * Math.PI) / 180) * 85}
              stroke="#4b5563"
              strokeWidth="4"
              strokeDasharray="4,2"
              opacity="0.6"
            />
          ))}
          <text x="-36" y="-38" fill="#fbbf24" fontSize="11" fontWeight="bold">Ghanta Ghar (8 Bazaars)</text>
        </g>

        {/* Kohinoor City Hub in Warm Gold/Amber */}
        <circle cx="700" cy="180" r="38" fill="#1b2434" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
        <text x="655" y="184" fill="#fbbf24" fontSize="11" fontWeight="600">Kohinoor City</text>

        {/* Madina Town Hub in Emerald */}
        <circle cx="360" cy="90" r="35" fill="#1b2434" stroke="#10b981" strokeWidth="2" opacity="0.5" />
        <text x="325" y="94" fill="#34d399" fontSize="11" fontWeight="600">Madina Town</text>

        {/* Live Route Line when Ustad is coming */}
        {bookingStatus === 'on_the_way' && activeBookingUstad && (
          <g>
            <line
              x1={startX}
              y1={startY}
              x2={userX}
              y2={userY}
              stroke="#10b981"
              strokeWidth="5"
              strokeDasharray="10,6"
              className="animate-pulse"
            />
            {/* Animated Ustad on route */}
            <g transform={`translate(${currentUstadX}, ${currentUstadY})`}>
              <circle cx="0" cy="0" r="22" fill="#047857" opacity="0.4" className="animate-ping" />
              <circle cx="0" cy="0" r="16" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
              <g transform="translate(-7, -7) scale(0.7)">
                <Bike className="w-5 h-5 text-white" />
              </g>
              <rect x="18" y="-12" width="76" height="22" rx="6" fill="#090e17" stroke="#10b981" strokeWidth="1" />
              <text x="24" y="3" fill="#34d399" fontSize="10" fontWeight="bold">
                ETA: {Math.max(2, Math.round((1 - movingProgress) * 12))} min
              </text>
            </g>
          </g>
        )}

        {/* Radar Scanning Sweep from User Location */}
        <g transform={`translate(${userX}, ${userY})`}>
          <circle cx="0" cy="0" r="60" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.3" className="animate-radar" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.2" className="animate-radar" style={{ animationDelay: '0.8s' }} />
          <circle cx="0" cy="0" r="190" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.1" className="animate-radar" style={{ animationDelay: '1.4s' }} />
        </g>

        {/* USER LOCATION PIN (Center Anchor) */}
        <g transform={`translate(${userX}, ${userY})`}>
          <circle cx="0" cy="0" r="18" fill="#10b981" opacity="0.25" className="animate-ping" />
          <circle cx="0" cy="0" r="11" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
          <rect x="-85" y="-46" width="170" height="30" rx="8" fill="#090e17" stroke="#10b981" strokeWidth="1.5" />
          <text x="0" y="-27" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
            📍 Your Location
          </text>
          <text x="0" y="-18" fill="#94a3b8" fontSize="8" textAnchor="middle">
            {userLocation.name.slice(0, 26)}
          </text>
        </g>

        {/* NEARBY USTADS PINS */}
        {visibleUstads.map((ustad, idx) => {
          const offsets = [
            { x: -140, y: -70 },
            { x: 130, y: -90 },
            { x: -90, y: 110 },
            { x: 160, y: 80 },
            { x: -220, y: -130 },
            { x: 90, y: 140 },
            { x: -170, y: 40 },
          ];
          const pos = offsets[idx % offsets.length];
          const posX = userX + pos.x;
          const posY = userY + pos.y;
          const isSelected = activeBookingUstad?.id === ustad.id || inspectedUstad?.id === ustad.id;

          return (
            <g
              key={ustad.id}
              transform={`translate(${posX}, ${posY})`}
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                playChime('click');
                setInspectedUstad(ustad);
                if (onSelectUstad) onSelectUstad(ustad);
              }}
            >
              {isSelected && (
                <circle cx="0" cy="0" r="28" fill="#10b981" opacity="0.3" className="animate-ping" />
              )}
              <circle
                cx="0"
                cy="0"
                r="19"
                fill="#162032"
                stroke={ustad.isVerified ? '#10b981' : '#f59e0b'}
                strokeWidth="2.5"
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <circle
                cx="13"
                cy="-13"
                r="5"
                fill={ustad.isAvailable ? '#22c55e' : '#ef4444'}
                stroke="#090e17"
                strokeWidth="1.5"
              />
              {/* Tooltip on hover */}
              <g className="opacity-95 group-hover:opacity-100 transition-opacity">
                <rect
                  x="-65"
                  y="-42"
                  width="130"
                  height="22"
                  rx="6"
                  fill="#090e17"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text x="0" y="-27" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {ustad.name.split(' ')[0]} (★{ustad.rating})
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* DYNAMIC INSPECTED USTAD PROFILE FLOATING CARD (When pin clicked) */}
      {inspectedUstad && (
        <div className="absolute top-14 right-3 z-30 max-w-xs w-full bg-[#0d1422]/95 backdrop-blur-md border border-emerald-500/60 rounded-2xl p-4 shadow-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Technician
            </span>
            <button
              onClick={() => setInspectedUstad(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={inspectedUstad.avatar}
              alt={inspectedUstad.name}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{inspectedUstad.name}</h4>
              <div className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {inspectedUstad.rating} ({inspectedUstad.totalReviews} reviews)
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                Trade: <span className="text-emerald-300 font-semibold">{inspectedUstad.skill}</span> • {inspectedUstad.experienceYears} yrs exp.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex justify-between">
            <span>Location Station:</span>
            <span className="font-semibold text-white">{inspectedUstad.locationName}</span>
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${inspectedUstad.phone}`}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Call
            </a>
            <button
              onClick={() => {
                playChime('success');
                if (onDirectBookUstad) onDirectBookUstad(inspectedUstad);
                setInspectedUstad(null);
              }}
              className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Book Directly
            </button>
          </div>
        </div>
      )}

      {/* Map Floating Bottom Card: Nearby Ustads Ticker */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between bg-[#101726]/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-400 text-xs font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            NADRA CNIC Verified ({visibleUstads.filter(u => u.isVerified).length})
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-400 text-xs font-semibold whitespace-nowrap">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Avg. 4.9★ Rating
          </div>
          <div className="text-xs text-slate-300 hidden sm:inline whitespace-nowrap">
            📍 Faisalabad Network: <span className="text-white font-medium">3.5 km Coverage</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time GPS Active</span>
        </div>
      </div>
    </div>
  );
}
