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
  Clock,
  AlertCircle,
  CheckCircle,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import type { ServiceCategoryType, PricingType, ServiceItem } from '../../types';

export const ServicesRateCardView: React.FC = () => {
  const { services, categories, openCreateBooking } = useApp();

  const [activeCategory, setActiveCategory] = useState<ServiceCategoryType | 'all'>('all');
  const [pricingTypeFilter, setPricingTypeFilter] = useState<PricingType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((srv) => {
    const matchesCat = activeCategory === 'all' || srv.categoryId === activeCategory;
    const matchesType = pricingTypeFilter === 'all' || srv.pricingType === pricingTypeFilter;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesType && matchesSearch && srv.isActive;
  });

  const getCategoryIcon = (category: ServiceCategoryType) => {
    switch (category) {
      case 'electrician':
        return <Zap size={16} />;
      case 'plumber':
        return <Droplets size={16} />;
      case 'ac-technician':
        return <Wind size={16} />;
      case 'bike-mechanic':
        return <Bike size={16} />;
      case 'car-mechanic':
        return <Car size={16} />;
      case 'carpenter':
        return <Hammer size={16} />;
      default:
        return <Zap size={16} />;
    }
  };

  return (
    <div className="rate-card-page-container">
      {/* Header & Description */}
      <div className="page-header-box">
        <div className="header-pill">
          <Tag size={13} />
          <span>Faisalabad Transparent Pricing</span>
        </div>
        <h1 className="page-title">Service Rate Card</h1>
        <p className="page-description">
          Official standard labor rates across Faisalabad. Upfront fixed prices for standard jobs and clear diagnostic inspection rates for complex repairs. No hidden contractor fees.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="rate-card-filters-bar">
        {/* Search Input */}
        <div className="rate-search-input-wrap">
          <Search size={18} className="search-icon-left" />
          <input
            type="text"
            className="rate-search-field"
            placeholder="Search price for switch, AC wash, bike puncture, tap..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {/* Pricing Type Filter Pills */}
        <div className="pricing-filter-pills">
          <button
            className={`pill-toggle-btn ${pricingTypeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setPricingTypeFilter('all')}
          >
            All Rates ({services.length})
          </button>
          <button
            className={`pill-toggle-btn ${pricingTypeFilter === 'fixed' ? 'active' : ''}`}
            onClick={() => setPricingTypeFilter('fixed')}
          >
            Fixed Price Only
          </button>
          <button
            className={`pill-toggle-btn ${pricingTypeFilter === 'estimated' ? 'active' : ''}`}
            onClick={() => setPricingTypeFilter('estimated')}
          >
            Inspection Required
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs-scroll">
        <button
          className={`cat-tab-chip ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          <span>All Categories</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cat-tab-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {getCategoryIcon(cat.id)}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Rate Card Grid */}
      <div className="rate-card-items-grid">
        {filteredServices.length === 0 ? (
          <div className="rate-card-empty-state">
            <SlidersHorizontal size={36} className="empty-icon" />
            <h3>No services found matching filters</h3>
            <p>Try resetting the category filter or searching for another term.</p>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setActiveCategory('all');
                setPricingTypeFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="rate-card-tile">
              <div className="tile-top-row">
                <span className="tile-category-tag">
                  {getCategoryIcon(service.categoryId)}
                  <span>{service.categoryId.replace('-', ' ').toUpperCase()}</span>
                </span>
                <span className={`tile-pricing-type ${service.pricingType}`}>
                  {service.pricingType === 'fixed' ? (
                    <>
                      <CheckCircle size={12} /> Fixed Labor Price
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} /> Inspection Required
                    </>
                  )}
                </span>
              </div>

              <h3 className="tile-title">{service.name}</h3>
              <p className="tile-description">{service.description}</p>

              {/* Possible Additional Charges Warning */}
              {service.possibleExtraCharges && service.possibleExtraCharges.length > 0 && (
                <div className="tile-extra-charges-box">
                  <span className="extra-charges-title">
                    <AlertCircle size={12} /> Possible Hardware / Parts (Customer paid):
                  </span>
                  <ul className="extra-charges-list">
                    {service.possibleExtraCharges.map((charge, idx) => (
                      <li key={idx}>{charge}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="tile-footer-bar">
                <div className="tile-cost-group">
                  <span className="cost-label">
                    {service.pricingType === 'fixed' ? 'Labor Fee:' : 'Starting Diagnostic:'}
                  </span>
                  <div className="cost-number">
                    <strong>Rs. {service.price}</strong>
                    <span className="time-badge">
                      <Clock size={11} /> ~{service.estimatedMinutes}m
                    </span>
                  </div>
                </div>

                <button
                  className="tile-book-button"
                  onClick={() => openCreateBooking(service)}
                >
                  Book Service
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rate Policy Info Footnote */}
      <div className="rate-policy-banner">
        <AlertCircle size={18} className="policy-icon" />
        <div className="policy-text">
          <strong>Fair Pricing Policy:</strong>
          <span>
            Labor rates above are verified across Faisalabad workshops. In case of required spare parts (e.g. capacitor, copper pipes, tap washers), you may supply them yourself or the Ustad will purchase them with original store receipts without markup.
          </span>
        </div>
      </div>
    </div>
  );
};
