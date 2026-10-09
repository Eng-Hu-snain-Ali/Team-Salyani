import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Zap,
  Droplets,
  Wind,
  Bike,
  Car,
  Hammer,
  ShieldCheck,
  Clock,
  ArrowRight,
  MapPin,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { RatingStars } from '../../components/common/RatingStars';
import type { ServiceCategoryType, ServiceItem, Ustad } from '../../types';

export const CustomerHomeView: React.FC = () => {
  const {
    categories,
    services,
    ustads,
    bookings,
    selectedArea,
    setCustomerTab,
    openCreateBooking,
    openTrackingModal,
    setSelectedUstad,
    reviews,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ServiceCategoryType | 'all'>('all');

  // Check if there is an active ongoing booking
  const activeBooking = bookings.find(
    (b) => b.status === 'on_the_way' || b.status === 'in_progress' || b.status === 'accepted'
  );

  // Filtered services based on search
  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.categoryId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'all' || srv.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCategory && srv.isActive;
  });

  // Approved and available Ustads
  const availableUstads = ustads.filter(
    (u) => u.verificationStatus === 'approved' && u.isAvailable
  );

  const getCategoryIcon = (categoryId: ServiceCategoryType) => {
    switch (categoryId) {
      case 'electrician':
        return <Zap className="category-icon" size={24} />;
      case 'plumber':
        return <Droplets className="category-icon" size={24} />;
      case 'ac-technician':
        return <Wind className="category-icon" size={24} />;
      case 'bike-mechanic':
        return <Bike className="category-icon" size={24} />;
      case 'car-mechanic':
        return <Car className="category-icon" size={24} />;
      case 'carpenter':
        return <Hammer className="category-icon" size={24} />;
      default:
        return <Zap className="category-icon" size={24} />;
    }
  };

  return (
    <div className="customer-home-container">
      {/* 1. HERO SEARCH & LOCALITY HEADER */}
      <section className="customer-hero-section">
        <div className="hero-welcome-badge">
          <MapPin size={14} />
          <span>Faisalabad • {selectedArea.name.split(',')[0]}</span>
        </div>

        <h1 className="hero-main-title">
          Doorstep Mechanic & Handyman Service in <span>Faisalabad</span>
        </h1>
        <p className="hero-subtext">
          Reliable Ustads. Transparent Prices. Verified Electricians, Plumbers, Mechanics & Carpenters dispatched in 25 minutes.
        </p>

        {/* Global Search Bar */}
        <div className="search-bar-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="What service do you need? (e.g., Switchboard, AC repair, Tap leak)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
          <button
            className="search-submit-btn"
            onClick={() => setCustomerTab('services')}
          >
            Explore Rates
          </button>
        </div>
      </section>

      {/* 2. ACTIVE BOOKING LIVE TRACKER BANNER (IF ANY) */}
      {activeBooking && (
        <section className="active-booking-banner">
          <div className="banner-pulse-dot" />
          <div className="banner-content">
            <div className="banner-tag">ACTIVE BOOKING • {activeBooking.id}</div>
            <h3 className="banner-title">{activeBooking.serviceName}</h3>
            <p className="banner-details">
              Assigned to: <strong>{activeBooking.ustadName || 'Ustad Dispatched'}</strong> • Status:{' '}
              <span className="banner-status-pill">{activeBooking.status.replace('_', ' ').toUpperCase()}</span>
            </p>
          </div>
          <button
            className="banner-track-btn"
            onClick={() => openTrackingModal(activeBooking)}
          >
            Track Ustad Live →
          </button>
        </section>
      )}

      {/* 3. SIX CORE SERVICE CATEGORIES */}
      <section className="categories-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Service Categories</h2>
            <p className="section-subheading">Choose professional services with upfront rates</p>
          </div>
          <button
            className="section-link-btn"
            onClick={() => setCustomerTab('services')}
          >
            View Full Rate Card →
          </button>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-card ${selectedCategoryFilter === cat.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategoryFilter(cat.id === selectedCategoryFilter ? 'all' : cat.id);
                setCustomerTab('services');
              }}
            >
              <div className="category-icon-wrapper" style={{ color: cat.color }}>
                {getCategoryIcon(cat.id)}
              </div>
              <div className="category-meta">
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-price-tag">{cat.samplePriceLabel}</span>
              </div>
              <span className="category-badge-chip">{cat.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR QUICK SERVICES WITH STARTING PRICES */}
      <section className="popular-services-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Popular Faisalabad Services</h2>
            <p className="section-subheading">Instant doorstep repair with verified pricing</p>
          </div>
          <button
            className="section-link-btn"
            onClick={() => setCustomerTab('services')}
          >
            All Services ({services.length}) →
          </button>
        </div>

        <div className="services-list-grid">
          {filteredServices.slice(0, 6).map((service) => (
            <div key={service.id} className="service-card-item">
              <div className="service-card-header">
                <span className="service-cat-pill">{service.categoryId.toUpperCase()}</span>
                <span className={`service-type-badge ${service.pricingType}`}>
                  {service.pricingType === 'fixed' ? 'Fixed Price' : 'Inspection Required'}
                </span>
              </div>

              <h3 className="service-title">{service.name}</h3>
              <p className="service-description">{service.description}</p>

              <div className="service-footer-row">
                <div className="service-price-block">
                  <span className="price-prefix">Labor:</span>
                  <span className="price-amount">Rs. {service.price}</span>
                  <span className="estimated-time">~{service.estimatedMinutes} mins</span>
                </div>

                <button
                  className="quick-book-btn"
                  onClick={() => openCreateBooking(service)}
                >
                  Book Ustad
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEARBY VERIFIED USTADS CAROUSEL */}
      <section className="nearby-ustads-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Verified Ustads Available Now</h2>
            <p className="section-subheading">Background-checked, rated, and equipped for fast response</p>
          </div>
          <button
            className="section-link-btn"
            onClick={() => setCustomerTab('ustads')}
          >
            Open Map View ({availableUstads.length}) →
          </button>
        </div>

        <div className="ustads-horizontal-scroll">
          {availableUstads.map((ustad) => (
            <div key={ustad.id} className="ustad-preview-card">
              <div className="ustad-avatar-row">
                <div className="ustad-avatar-wrap">
                  <img src={ustad.avatar} alt={ustad.name} className="ustad-img" />
                  <span className="ustad-avail-indicator" title="Available now" />
                </div>
                <div className="ustad-title-block">
                  <div className="ustad-name-row">
                    <h3 className="ustad-name">{ustad.name}</h3>
                    <span title="NADRA Verified">
                      <ShieldCheck size={16} className="verified-badge-icon" />
                    </span>
                  </div>
                  <span className="ustad-skills-tag">
                    {ustad.skillCategories.map((s) => s.replace('-', ' ')).join(', ')}
                  </span>
                  <div className="ustad-rating-row">
                    <RatingStars rating={ustad.rating} size={13} showNumeric />
                    <span className="review-count">({ustad.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="ustad-bio-snippet">{ustad.bio}</p>

              <div className="ustad-meta-row">
                <span className="ustad-area-chip">
                  <MapPin size={12} /> {ustad.serviceArea.split(',')[0]}
                </span>
                <span className="ustad-exp-chip">{ustad.experienceYears} yrs exp</span>
              </div>

              <div className="ustad-action-row">
                <div className="ustad-starting-rate">
                  <small>Starting from</small>
                  <strong>Rs. {ustad.startingPrice}</strong>
                </div>
                <button
                  className="book-ustad-direct-btn"
                  onClick={() => {
                    setSelectedUstad(ustad);
                    openCreateBooking(undefined, ustad);
                  }}
                >
                  Book Direct
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRANSPARENCY & TRUST PROMISE BANNER */}
      <section className="trust-banner-section">
        <div className="trust-header">
          <Sparkles size={20} className="trust-sparkle-icon" />
          <h2 className="trust-heading">Why Faisalabad Trusts USTAD ONLINE</h2>
        </div>
        <div className="trust-pillars-grid">
          <div className="trust-pillar">
            <CheckCircle2 size={24} className="pillar-icon" />
            <h4>NADRA & Police Verified</h4>
            <p>Every mechanic submits CNIC identity, residential verification, and background clearance.</p>
          </div>
          <div className="trust-pillar">
            <Clock size={24} className="pillar-icon" />
            <h4>Upfront Rate Card</h4>
            <p>Fixed prices and transparent diagnostic rates. No surprise labor overcharges at your doorstep.</p>
          </div>
          <div className="trust-pillar">
            <ShieldCheck size={24} className="pillar-icon" />
            <h4>Satisfaction Warranty</h4>
            <p>100% resolution guarantee on all eligible repairs, backed by our local Faisalabad support desk.</p>
          </div>
        </div>
      </section>

      {/* 7. RECENT CUSTOMER TESTIMONIALS */}
      <section className="reviews-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Verified Faisalabad Customer Feedback</h2>
            <p className="section-subheading">Authentic reviews from D-Ground, Kohinoor, and Madina Town</p>
          </div>
        </div>

        <div className="reviews-carousel">
          {reviews.slice(0, 3).map((rev) => (
            <div key={rev.id} className="review-bubble-card">
              <div className="rev-header">
                <strong>{rev.userName}</strong>
                <RatingStars rating={rev.rating} size={14} />
              </div>
              <p className="rev-comment">"{rev.comment}"</p>
              <div className="rev-tags-row">
                {rev.tags?.map((t, idx) => (
                  <span key={idx} className="rev-tag-pill">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
