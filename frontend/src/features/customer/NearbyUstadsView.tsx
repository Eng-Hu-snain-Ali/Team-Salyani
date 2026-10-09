import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaisalabadMap } from '../../components/common/FaisalabadMap';
import { RatingStars } from '../../components/common/RatingStars';
import {
  List,
  Map,
  ShieldCheck,
  MapPin,
  Clock,
  Wrench,
  CheckCircle2,
  X,
  Phone,
  Zap,
  Droplets,
  Wind,
  Bike,
  Car,
  Hammer,
} from 'lucide-react';
import type { ServiceCategoryType, Ustad } from '../../types';

export const NearbyUstadsView: React.FC = () => {
  const {
    ustads,
    selectedArea,
    openCreateBooking,
    setSelectedUstad,
    reviews,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryType | 'all'>('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(true);
  const [detailModalUstad, setDetailModalUstad] = useState<Ustad | null>(null);

  // Filter Ustads
  const filteredUstads = ustads.filter((u) => {
    // Only approved Ustads for customer discovery
    if (u.verificationStatus !== 'approved') return false;
    if (showAvailableOnly && !u.isAvailable) return false;
    if (selectedCategory !== 'all' && !u.skillCategories.includes(selectedCategory)) {
      return false;
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

  return (
    <div className="nearby-ustads-page-container">
      {/* Top Header & View Switcher */}
      <div className="nearby-header-row">
        <div>
          <h1 className="page-title">Verified Ustads Nearby</h1>
          <p className="page-subheading">
            Active mechanics & handymen around {selectedArea.name.split(',')[0]}
          </p>
        </div>

        {/* List vs Map Switcher */}
        <div className="view-toggle-group">
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
            <span>List View</span>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            aria-label="Map view"
          >
            <Map size={16} />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="nearby-filters-bar">
        <div className="category-scroll-chips">
          <button
            className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Skills
          </button>
          <button
            className={`filter-chip ${selectedCategory === 'electrician' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('electrician')}
          >
            <Zap size={13} /> Electrician
          </button>
          <button
            className={`filter-chip ${selectedCategory === 'plumber' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('plumber')}
          >
            <Droplets size={13} /> Plumber
          </button>
          <button
            className={`filter-chip ${selectedCategory === 'ac-technician' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ac-technician')}
          >
            <Wind size={13} /> AC Tech
          </button>
          <button
            className={`filter-chip ${selectedCategory === 'bike-mechanic' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('bike-mechanic')}
          >
            <Bike size={13} /> Bike
          </button>
          <button
            className={`filter-chip ${selectedCategory === 'car-mechanic' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('car-mechanic')}
          >
            <Car size={13} /> Car
          </button>
          <button
            className={`filter-chip ${selectedCategory === 'carpenter' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('carpenter')}
          >
            <Hammer size={13} /> Carpenter
          </button>
        </div>

        <label className="available-only-toggle">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
          <span>Available Now Only</span>
        </label>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' ? (
        <div className="map-view-wrapper">
          <FaisalabadMap
            ustads={filteredUstads}
            selectedCategory={selectedCategory}
            onSelectUstad={(ustad) => setDetailModalUstad(ustad)}
            height={500}
          />
        </div>
      ) : (
        /* List View */
        <div className="ustads-list-grid">
          {filteredUstads.length === 0 ? (
            <div className="empty-ustads-box">
              <Wrench size={40} className="empty-icon" />
              <h3>No Ustads available in this category</h3>
              <p>Try switching to another category or check back in a few minutes.</p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setShowAvailableOnly(false);
                }}
              >
                Show All Ustads
              </button>
            </div>
          ) : (
            filteredUstads.map((ustad) => (
              <div key={ustad.id} className="ustad-full-card">
                <div className="card-top">
                  <div className="ustad-avatar-frame">
                    <img src={ustad.avatar} alt={ustad.name} className="ustad-img" />
                    <span
                      className={`status-circle ${ustad.isAvailable ? 'online' : 'offline'}`}
                      title={ustad.isAvailable ? 'Online & Ready' : 'Offline'}
                    />
                  </div>

                  <div className="ustad-main-info">
                    <div className="name-verified-row">
                      <h3 className="ustad-heading">{ustad.name}</h3>
                      <span className="verified-badge-label" title="NADRA & Police Verified">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    </div>

                    <div className="skills-badge-list">
                      {ustad.skillCategories.map((skill) => (
                        <span key={skill} className="skill-pill">
                          {getCategoryIcon(skill)}
                          <span>{skill.replace('-', ' ')}</span>
                        </span>
                      ))}
                      <span className="exp-pill">{ustad.experienceYears} Years Exp</span>
                    </div>

                    <div className="rating-distance-row">
                      <RatingStars rating={ustad.rating} size={14} showNumeric />
                      <span className="dot-sep">•</span>
                      <span className="review-count-text">
                        {ustad.reviewCount} Reviews ({ustad.completedJobsCount} jobs completed)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="ustad-bio-text">{ustad.bio}</p>

                <div className="service-area-info-row">
                  <div className="area-item">
                    <MapPin size={13} className="pin-icon" />
                    <span>{ustad.serviceArea}</span>
                  </div>
                  <div className="eta-item">
                    <Clock size={13} className="clock-icon" />
                    <span>~15-25 min dispatch (Simulated)</span>
                  </div>
                </div>

                <div className="card-bottom-actions">
                  <div className="price-tag-group">
                    <small>Starting From</small>
                    <strong>Rs. {ustad.startingPrice}</strong>
                  </div>

                  <div className="btn-actions-group">
                    <button
                      className="view-profile-btn"
                      onClick={() => setDetailModalUstad(ustad)}
                    >
                      View Profile
                    </button>
                    <button
                      className="book-direct-btn"
                      onClick={() => {
                        setSelectedUstad(ustad);
                        openCreateBooking(undefined, ustad);
                      }}
                    >
                      Book Ustad
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ustad Profile Detail Modal */}
      {detailModalUstad && (
        <div className="modal-backdrop" onClick={() => setDetailModalUstad(null)}>
          <div
            className="modal-surface ustad-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <div className="badge-verified-row">
                <CheckCircle2 size={16} className="text-success" />
                <span>NADRA & Police Verified Professional</span>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setDetailModalUstad(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="detail-profile-hero">
              <img
                src={detailModalUstad.avatar}
                alt={detailModalUstad.name}
                className="detail-avatar"
              />
              <div className="detail-meta">
                <h2>{detailModalUstad.name}</h2>
                <div className="detail-rating">
                  <RatingStars rating={detailModalUstad.rating} size={16} showNumeric />
                  <span>({detailModalUstad.reviewCount} customer reviews)</span>
                </div>
                <span className="detail-sector">
                  <MapPin size={14} /> Service Sector: {detailModalUstad.serviceArea}
                </span>
              </div>
            </div>

            <div className="detail-stats-grid">
              <div className="stat-box">
                <span className="stat-label">Experience</span>
                <strong>{detailModalUstad.experienceYears} Years</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">Jobs Done</span>
                <strong>{detailModalUstad.completedJobsCount}+ Jobs</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">Starting Rate</span>
                <strong>Rs. {detailModalUstad.startingPrice}</strong>
              </div>
              <div className="stat-box">
                <span className="stat-label">Status</span>
                <strong className={detailModalUstad.isAvailable ? 'text-success' : 'text-muted'}>
                  {detailModalUstad.isAvailable ? 'Available Now' : 'Busy'}
                </strong>
              </div>
            </div>

            <div className="detail-section">
              <h4>About & Qualifications</h4>
              <p>{detailModalUstad.bio}</p>
            </div>

            <div className="detail-section">
              <h4>Verified Skills</h4>
              <div className="skills-badge-list">
                {detailModalUstad.skillCategories.map((s) => (
                  <span key={s} className="skill-pill">
                    {getCategoryIcon(s)} {s.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification Note (Protecting sensitive identity) */}
            <div className="detail-verification-box">
              <ShieldCheck size={18} className="shield-icon" />
              <div>
                <strong>Identity Protected:</strong>
                <p>
                  CNIC ({detailModalUstad.cnicMasked}) and police record clearance verified by Faisalabad Admin. Full documents are kept secure per security regulations.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="detail-modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setDetailModalUstad(null)}
              >
                Close
              </button>
              <button
                className="book-btn-primary"
                onClick={() => {
                  const target = detailModalUstad;
                  setDetailModalUstad(null);
                  setSelectedUstad(target);
                  openCreateBooking(undefined, target);
                }}
              >
                Book {detailModalUstad.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
