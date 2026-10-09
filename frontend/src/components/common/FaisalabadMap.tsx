import React, { useState } from 'react';
import type { Ustad, Booking, ServiceCategoryType } from '../../types';
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  Info,
  CheckCircle2,
  Clock,
  Wrench,
  Bike,
  Droplets,
  Zap,
  Wind,
  Car,
  Hammer,
} from 'lucide-react';

interface FaisalabadMapProps {
  ustads?: Ustad[];
  activeBooking?: Booking | null;
  customerLocation?: { lat: number; lng: number; label: string };
  onSelectUstad?: (ustad: Ustad) => void;
  height?: number | string;
  selectedCategory?: ServiceCategoryType | 'all';
}

export const FaisalabadMap: React.FC<FaisalabadMapProps> = ({
  ustads = [],
  activeBooking,
  customerLocation = {
    lat: 31.4124,
    lng: 73.0978,
    label: 'Your Location (Peoples Colony / D-Ground)',
  },
  onSelectUstad,
  height = 340,
  selectedCategory = 'all',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activePinUstad, setActivePinUstad] = useState<Ustad | null>(null);

  // Filter Ustads
  const visibleUstads = ustads.filter((u) => {
    if (selectedCategory !== 'all') {
      return u.skillCategories.includes(selectedCategory);
    }
    return true;
  });

  const getCategoryIcon = (category: ServiceCategoryType) => {
    switch (category) {
      case 'electrician':
        return <Zap size={14} />;
      case 'plumber':
        return <Droplets size={14} />;
      case 'ac-technician':
        return <Wind size={14} />;
      case 'bike-mechanic':
        return <Bike size={14} />;
      case 'car-mechanic':
        return <Car size={14} />;
      case 'carpenter':
        return <Hammer size={14} />;
      default:
        return <Wrench size={14} />;
    }
  };

  // SVG coordinate transformation centered on Faisalabad
  // Center: 31.4187, 73.0791 (Clock Tower) / 31.4124, 73.0978 (D-Ground)
  const mapCenterLat = 31.418;
  const mapCenterLng = 73.098;
  const latSpan = 0.08;
  const lngSpan = 0.10;

  const latToY = (lat: number) => {
    const norm = (mapCenterLat + latSpan / 2 - lat) / latSpan;
    return Math.max(10, Math.min(90, norm * 100));
  };

  const lngToX = (lng: number) => {
    const norm = (lng - (mapCenterLng - lngSpan / 2)) / lngSpan;
    return Math.max(10, Math.min(90, norm * 100));
  };

  const customerX = lngToX(customerLocation.lng);
  const customerY = latToY(customerLocation.lat);

  return (
    <div className="faisalabad-map-card" style={{ height }}>
      {/* Simulation Watermark & Integration Status */}
      <div className="map-simulation-header">
        <div className="badge-row">
          <span className="sim-badge">
            <Navigation size={12} />
            Simulated Faisalabad GPS
          </span>
          <span className="status-badge-mini">
            <CheckCircle2 size={12} />
            Google Maps API Ready
          </span>
        </div>
        <div className="map-controls">
          <button
            className="map-ctrl-btn"
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <button
            className="map-ctrl-btn"
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div
        className="map-canvas-container"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        <svg className="map-vector-canvas" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {/* Roads & Grid Pattern */}
            <pattern id="roadGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(37, 99, 235, 0.06)"
                strokeWidth="0.5"
              />
            </pattern>
            {/* Radial glow for route */}
            <radialGradient id="customerPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100" height="100" fill="url(#roadGrid)" />

          {/* Faisalabad Major Arterial Roads */}
          {/* Canal Road (diagonal northwest to southeast) */}
          <path
            d="M 10 20 Q 50 45 90 85"
            fill="none"
            stroke="rgba(148, 163, 184, 0.35)"
            strokeWidth="2.5"
            strokeDasharray="2,1"
          />
          {/* Jaranwala Road */}
          <path
            d="M 25 55 L 85 65"
            fill="none"
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="2"
          />
          {/* Susan Road / Madina Town */}
          <path
            d="M 60 15 L 65 85"
            fill="none"
            stroke="rgba(148, 163, 184, 0.35)"
            strokeWidth="1.8"
          />
          {/* Circular Road / Clock Tower Eight Bazaars */}
          <circle
            cx="32"
            cy="40"
            r="8"
            fill="none"
            stroke="rgba(37, 99, 235, 0.25)"
            strokeWidth="1.5"
          />
          <path
            d="M 32 32 L 32 48 M 24 40 L 40 40 M 26 34 L 38 46 M 26 46 L 38 34"
            fill="none"
            stroke="rgba(37, 99, 235, 0.2)"
            strokeWidth="0.8"
          />

          {/* Landmark Labels */}
          <text x="32" y="38" fontSize="2.2" fill="#64748B" textAnchor="middle" fontWeight="bold">
            Ghanta Ghar
          </text>
          <text x="56" y="58" fontSize="2.2" fill="#2563EB" textAnchor="middle" fontWeight="bold">
            D-Ground
          </text>
          <text x="75" y="66" fontSize="2" fill="#64748B" textAnchor="middle">
            Kohinoor City
          </text>
          <text x="70" y="32" fontSize="2" fill="#64748B" textAnchor="middle">
            Madina Town
          </text>
          <text x="25" y="75" fontSize="2" fill="#64748B" textAnchor="middle">
            Peoples Colony 2
          </text>
          <text x="20" y="25" fontSize="2" fill="#64748B" textAnchor="middle">
            GMA Sector
          </text>

          {/* Active Job Dispatch Path (if On The Way) */}
          {activeBooking?.status === 'on_the_way' && activeBooking.ustadCurrentLocation && (
            <>
              {/* Route line */}
              <line
                x1={lngToX(activeBooking.ustadCurrentLocation.lng)}
                y1={latToY(activeBooking.ustadCurrentLocation.lat)}
                x2={customerX}
                y2={customerY}
                stroke="#2563EB"
                strokeWidth="1.8"
                strokeDasharray="2,1.5"
                className="animated-dispatch-line"
              />
              {/* Dispatching Ustad Position */}
              <circle
                cx={lngToX(activeBooking.ustadCurrentLocation.lng)}
                cy={latToY(activeBooking.ustadCurrentLocation.lat)}
                r="3.5"
                fill="#16A34A"
                className="pulsing-ustad-marker"
              />
            </>
          )}

          {/* Customer Location Pulse */}
          <circle cx={customerX} cy={customerY} r="7" fill="url(#customerPulse)" />
          <circle cx={customerX} cy={customerY} r="2.2" fill="#2563EB" stroke="#FFFFFF" strokeWidth="0.8" />
        </svg>

        {/* HTML Markers Placed Over Vector Map */}
        {/* Customer Marker Pin */}
        <div
          className="map-html-marker customer-marker"
          style={{ left: `${customerX}%`, top: `${customerY}%` }}
          title={customerLocation.label}
        >
          <div className="marker-dot user-dot" />
          <span className="marker-label">You ({customerLocation.label.split(',')[0]})</span>
        </div>

        {/* Ustads Marker Pins */}
        {visibleUstads.map((ustad) => {
          const ux = lngToX(ustad.lng);
          const uy = latToY(ustad.lat);
          const isSelected = activePinUstad?.id === ustad.id;

          return (
            <div
              key={ustad.id}
              className={`map-html-marker ustad-marker ${isSelected ? 'selected' : ''}`}
              style={{ left: `${ux}%`, top: `${uy}%` }}
              onClick={() => {
                setActivePinUstad(ustad);
                if (onSelectUstad) onSelectUstad(ustad);
              }}
            >
              <div className={`ustad-marker-bubble ${ustad.isAvailable ? 'available' : 'busy'}`}>
                {getCategoryIcon(ustad.skillCategories[0])}
                <span className="ustad-marker-rating">★{ustad.rating}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Ustad Quick Popover Card */}
      {activePinUstad && (
        <div className="map-selected-popover">
          <div className="popover-avatar">
            <img src={activePinUstad.avatar} alt={activePinUstad.name} />
          </div>
          <div className="popover-info">
            <div className="popover-title-row">
              <strong>{activePinUstad.name}</strong>
              <span className="popover-badge">★ {activePinUstad.rating}</span>
            </div>
            <span className="popover-skills">
              {activePinUstad.skillCategories.join(', ')} • {activePinUstad.experienceYears} yrs exp
            </span>
            <span className="popover-location">
              <MapPin size={12} /> {activePinUstad.serviceArea.split(',')[0]}
            </span>
          </div>
          <div className="popover-actions">
            <span className="popover-price">From Rs. {activePinUstad.startingPrice}</span>
            <button
              className="popover-btn"
              onClick={() => {
                if (onSelectUstad) onSelectUstad(activePinUstad);
              }}
            >
              Book Ustad
            </button>
          </div>
          <button
            className="popover-close-btn"
            onClick={() => setActivePinUstad(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Active Tracking ETA Bar */}
      {activeBooking?.status === 'on_the_way' && activeBooking.ustadCurrentLocation && (
        <div className="map-eta-banner">
          <Clock size={16} className="eta-icon" />
          <div className="eta-text">
            <span>
              <strong>{activeBooking.ustadName}</strong> is {activeBooking.ustadCurrentLocation.distanceKm} km away.
            </span>
            <small>Estimated Arrival: ~{activeBooking.ustadCurrentLocation.etaMinutes} minutes</small>
          </div>
          <span className="eta-sim-badge">Live Sim</span>
        </div>
      )}

      {/* Bottom Map Note */}
      <div className="map-footer-notice">
        <Info size={13} />
        <span>
          Shows verified Ustads in Faisalabad. Click any icon to view ratings & book doorstep repair.
        </span>
      </div>
    </div>
  );
};
