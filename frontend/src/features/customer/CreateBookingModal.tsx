import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Wrench,
  Camera,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Banknote,
  Smartphone,
  CreditCard,
  Zap,
  Droplets,
  Wind,
  Bike,
  Car,
  Hammer,
  Mic,
  MicOff,
  Navigation,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { SAMPLE_PROBLEM_PHOTOS, FAISALABAD_AREAS } from '../../constants';
import type { ServiceCategoryType, PricingType, PaymentMethod, ServiceItem, Booking } from '../../types';

// Quick issue tags by category for 1-tap problem description
const QUICK_ISSUE_TAGS: Record<ServiceCategoryType, string[]> = {
  electrician: [
    'Switchboard Sparking',
    'Ceiling Fan Rotating Slow',
    'Main Breaker Tripping',
    'Short Circuit in Lounge',
    'AC Power Plug Burnt',
    'UPS Wiring Fault',
  ],
  plumber: [
    'Tap Leaking Constantly',
    'Water Motor Burnt / Humming',
    'Underground Pipe Leakage',
    'Washroom Drain Blocked',
    'Water Tank Overflow',
    'Geyser Not Heating',
  ],
  'ac-technician': [
    'AC Not Cooling / Warm Air',
    'Water Dripping from Indoor Unit',
    'Gas Leakage / Ice on Pipes',
    'Outer Compressor Not Starting',
    'General Filter & Chemical Wash',
    'Inverter Error Code on Display',
  ],
  'bike-mechanic': [
    'Tyre Puncture on Roadside',
    'Engine Oil Change & Tuning',
    'Brake Wire Broken / Jammed',
    'Motorbike Not Starting',
    'Chain Loose & Noise',
    'Carburetor Overflow',
  ],
  'car-mechanic': [
    'Car Battery Dead / Jumpstart',
    'Brake Pads Squeaking',
    'Engine Overheating',
    'Pre-Purchase Inspection',
    'Radiator Coolant Leak',
    'Suspension Noise on Bumps',
  ],
  carpenter: [
    'Main Door Lock Jammed',
    'Cabinet Hinge Broken',
    'Wardrobe Door Misaligned',
    'Wooden Table Repair',
    'Door Stopper & Handle Fix',
    'Bed Frame Loose',
  ],
};

const COMMON_FAISALABAD_LANDMARKS: Record<string, string[]> = {
  'D-Ground, Peoples Colony No. 1': [
    'Near D-Ground Water Tank',
    'Opposite ChenOne Peoples Colony',
    'Behind Habib Bank D-Ground',
  ],
  'Kohinoor City, Jaranwala Road': [
    'Kohinoor One Executive Plaza',
    'Near KFC / McDonald Jaranwala Road',
    'Opposite Circle Club',
  ],
  'Madina Town, Susan Road': [
    'Near Susan Road Main Market',
    'Opposite Jamia Masjid Madina Town',
    'Behind Allied Hospital Doctors Hostel',
  ],
  'Canal Road, East Canal': [
    'Near Toyota Faisalabad Motors',
    'Opposite Citi Housing Canal Gate',
    'Near FDA City Interchange',
  ],
};

const CreateBookingModalContent: React.FC = () => {
  const {
    setIsCreateBookingOpen,
    selectedService,
    setSelectedService,
    selectedUstad,
    setSelectedUstad,
    categories,
    services,
    selectedArea,
    user,
    createBooking,
    openTrackingModal,
    openChatModal,
    setCustomerTab,
    showToast,
  } = useApp();

  const initialCategory: ServiceCategoryType =
    selectedService?.categoryId ||
    (selectedUstad && selectedUstad.skillCategories.length > 0 ? selectedUstad.skillCategories[0] : 'electrician');

  const initialServiceId: string =
    selectedService?.id ||
    (services.find((s) => s.categoryId === initialCategory)?.id || (services[0]?.id || ''));

  const [step, setStep] = useState<number>(1);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Form Fields
  const [selectedCategoryId, setSelectedCategoryId] = useState<ServiceCategoryType>(initialCategory);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [chosenServiceId, setChosenServiceId] = useState<string>(initialServiceId);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [problemImageUrl, setProblemImageUrl] = useState<string>('');
  const [address, setAddress] = useState<string>(
    user?.address || 'House 42, Street 3, Block B, Peoples Colony No. 1, Faisalabad'
  );
  const [areaName, setAreaName] = useState<string>(selectedArea?.name || 'D-Ground, Peoples Colony No. 1');
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduledTime, setScheduledTime] = useState<string>('Today, 2:00 PM - 4:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Voice note simulation
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceNoteRecorded, setVoiceNoteRecorded] = useState(false);

  const currentService = services.find((s) => s.id === chosenServiceId) || services[0];

  const categoryServices = services.filter((s) => {
    const matchesCat = s.categoryId === selectedCategoryId && s.isActive;
    const matchesSearch =
      !serviceSearch.trim() ||
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleClose = () => {
    setIsCreateBookingOpen(false);
    setSelectedService(null);
    setSelectedUstad(null);
    setCreatedBooking(null);
    setStep(1);
    setErrors({});
    setVoiceNoteRecorded(false);
    setIsRecordingVoice(false);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!chosenServiceId) newErrors.service = 'Please select a service';
    } else if (currentStep === 2) {
      if (!problemDescription.trim() || problemDescription.trim().length < 8) {
        newErrors.description = 'Please describe the issue or tap a quick tag below';
      }
    } else if (currentStep === 3) {
      if (!address.trim() || address.trim().length < 8) {
        newErrors.address = 'Please enter a complete street address in Faisalabad';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleAddQuickTag = (tag: string) => {
    setProblemDescription((prev) => {
      if (!prev.trim()) return tag;
      if (prev.includes(tag)) return prev;
      return `${prev}. ${tag}`;
    });
    setErrors((prev) => ({ ...prev, description: '' }));
  };

  const handleSimulateVoiceRecord = () => {
    if (voiceNoteRecorded) {
      setVoiceNoteRecorded(false);
      showToast('Audio note removed', 'info');
      return;
    }

    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      setVoiceNoteRecorded(true);
      showToast('10-second voice message recorded for Ustad (Urdu audio)', 'success');
      if (!problemDescription.trim()) {
        setProblemDescription('Audio note recorded: Explained fault sound & wiring condition to Ustad in Urdu.');
      }
    }, 1800);
  };

  const handleUseCurrentLocation = () => {
    const currentLoc = `${user?.address || 'House 42, Street 3, Block B, Peoples Colony No. 1, Faisalabad'}`;
    setAddress(currentLoc);
    setAreaName(selectedArea.name);
    showToast('Location populated from device GPS (Faisalabad)', 'info');
  };

  const handleSubmitBooking = async () => {
    if (!currentService) return;

    try {
      const fullDescription = voiceNoteRecorded
        ? `${problemDescription} [🎤 Attached Urdu Voice Note - 0:10]`
        : problemDescription;

      const newBooking = await createBooking({
        serviceId: currentService.id,
        serviceName: currentService.name,
        categoryId: currentService.categoryId,
        problemDescription: fullDescription,
        problemImageUrl: problemImageUrl || undefined,
        address,
        area: areaName,
        estimatedPrice: currentService.price,
        pricingType: currentService.pricingType,
        paymentMethod,
        scheduleType,
        scheduledTime: scheduleType === 'scheduled' ? scheduledTime : undefined,
        ustadId: selectedUstad?.id,
        ustadName: selectedUstad?.name,
        ustadPhone: selectedUstad?.phone,
        ustadAvatar: selectedUstad?.avatar,
      });

      setCreatedBooking(newBooking);
      setStep(5); // Move to celebratory confirmation state
    } catch (err: any) {
      showToast(err.message || 'Failed to submit booking', 'error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={step === 5 ? handleClose : undefined}>
      <div className="modal-surface create-booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="booking-modal-header">
          <div>
            <span className="booking-modal-step-tag">
              {step <= 4 ? `Step ${step} of 4` : 'Booking Confirmed'}
            </span>
            <h2 className="booking-modal-title">
              {step <= 4 ? 'Book a Verified Ustad' : 'Booking Successfully Dispatched!'}
            </h2>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Dots */}
        {step <= 4 && (
          <div className="booking-stepper-dots">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1. Service</div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2. Problem</div>
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3. Location</div>
            <div className={`step-dot ${step >= 4 ? 'active' : ''}`}>4. Review</div>
          </div>
        )}

        {/* STEP 1: SELECT CATEGORY & SERVICE */}
        {step === 1 && (
          <div className="step-content">
            <div className="field-group">
              <label className="field-label">1. Choose Service Trade</label>
              <div className="category-select-pills">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-pill-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      const matching = services.filter((s) => s.categoryId === cat.id);
                      if (matching.length > 0) setChosenServiceId(matching[0].id);
                    }}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick search input */}
            <div className="field-group">
              <div className="search-wrap service-search-box">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Filter services (e.g. switch, tap, AC, puncture)..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">2. Select Desired Service & Starting Rate</label>
              <div className="service-pick-list">
                {categoryServices.length === 0 ? (
                  <p className="no-srv-msg">No services match your search filter.</p>
                ) : (
                  categoryServices.map((srv) => (
                    <div
                      key={srv.id}
                      className={`service-pick-card ${chosenServiceId === srv.id ? 'selected' : ''}`}
                      onClick={() => setChosenServiceId(srv.id)}
                    >
                      <div className="pick-info">
                        <strong>{srv.name}</strong>
                        <p>{srv.description}</p>
                      </div>
                      <div className="pick-price">
                        <span className="price-val">Rs. {srv.price}</span>
                        <small className="pricing-tag">
                          {srv.pricingType === 'fixed' ? 'Fixed Labor' : 'Inspection Diagnostic'}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {errors.service && <span className="field-error-msg">{errors.service}</span>}
            </div>

            {/* Preferred or Assigned Ustad Indicator */}
            {selectedUstad ? (
              <div className="assigned-ustad-notice">
                <ShieldCheck size={16} className="text-success" />
                <span>
                  Direct Booking with: <strong>{selectedUstad.name}</strong> ({selectedUstad.rating}★ • {selectedUstad.serviceArea})
                </span>
              </div>
            ) : (
              <div className="assigned-ustad-notice auto-dispatch">
                <Sparkles size={16} className="text-primary" />
                <span>
                  <strong>⚡ Smart Dispatch Mode:</strong> The nearest verified {selectedCategoryId} within 25 mins in Faisalabad will be assigned immediately.
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PROBLEM DETAILS, QUICK TAGS, VOICE NOTE & PHOTO */}
        {step === 2 && (
          <div className="step-content">
            <div className="field-group">
              <label className="field-label">Describe the Issue or Problem *</label>
              <textarea
                className={`field-textarea ${errors.description ? 'error' : ''}`}
                rows={3}
                placeholder="Describe what is broken, sounds, sparking, water leaks, or required spare parts..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
              />
              {errors.description && <span className="field-error-msg">{errors.description}</span>}
            </div>

            {/* 1-Tap Problem Suggestions */}
            <div className="field-group">
              <label className="field-label text-muted">1-Tap Common Issue Tags</label>
              <div className="quick-tags-row">
                {(QUICK_ISSUE_TAGS[selectedCategoryId] || []).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`issue-tag-chip ${problemDescription.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleAddQuickTag(tag)}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Note Recording Simulator */}
            <div className="voice-recorder-card">
              <div className="voice-recorder-info">
                <div className={`mic-circle ${isRecordingVoice ? 'recording' : voiceNoteRecorded ? 'recorded' : ''}`}>
                  <Mic size={18} />
                </div>
                <div>
                  <strong>
                    {isRecordingVoice
                      ? 'Listening & Recording Audio (Urdu / Punjabi / English)...'
                      : voiceNoteRecorded
                      ? 'Voice Note Attached (0:10)'
                      : 'Record Audio Note for Ustad (Optional)'}
                  </strong>
                  <small>Ustads listen to problem sounds (e.g. motor hum, water hiss)</small>
                </div>
              </div>
              <button
                type="button"
                className={`voice-record-btn ${voiceNoteRecorded ? 'active' : ''}`}
                onClick={handleSimulateVoiceRecord}
                disabled={isRecordingVoice}
              >
                {isRecordingVoice ? 'Recording...' : voiceNoteRecorded ? 'Remove Note' : 'Record Audio'}
              </button>
            </div>

            {/* Problem Photo Selector */}
            <div className="field-group">
              <label className="field-label">
                <Camera size={15} /> Attach Problem Snapshot (Optional)
              </label>
              <small className="field-hint">
                Select a sample photo so the Ustad brings the appropriate replacement tools.
              </small>

              <div className="photo-samples-grid">
                {SAMPLE_PROBLEM_PHOTOS.filter(
                  (p) => p.category === selectedCategoryId || p.category === 'electrician'
                ).map((photo) => (
                  <div
                    key={photo.id}
                    className={`photo-sample-card ${problemImageUrl === photo.url ? 'selected' : ''}`}
                    onClick={() =>
                      setProblemImageUrl(problemImageUrl === photo.url ? '' : photo.url)
                    }
                  >
                    <img src={photo.url} alt={photo.title} />
                    <span>{photo.title}</span>
                  </div>
                ))}
              </div>

              {problemImageUrl && (
                <div className="selected-photo-preview">
                  <ImageIcon size={14} />
                  <span>Photo selected for Ustad review</span>
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => setProblemImageUrl('')}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: ADDRESS, MAP LOCATION & TIME */}
        {step === 3 && (
          <div className="step-content">
            <div className="field-group">
              <div className="label-with-action">
                <label className="field-label">Service Sector in Faisalabad</label>
                <button
                  type="button"
                  className="quick-gps-btn"
                  onClick={handleUseCurrentLocation}
                >
                  <Navigation size={13} /> Use Current GPS
                </button>
              </div>
              <select
                className="field-select"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              >
                {FAISALABAD_AREAS.map((area) => (
                  <option key={area.id} value={area.name}>
                    {area.name} ({area.urduName})
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Full Street Address & Nearby Landmark *</label>
              <input
                type="text"
                className={`field-input ${errors.address ? 'error' : ''}`}
                placeholder="House #, Street #, Landmark (e.g., Near D-Ground water tank)..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <span className="field-error-msg">{errors.address}</span>}
            </div>

            {/* Popular Landmark Suggestions */}
            {COMMON_FAISALABAD_LANDMARKS[areaName] && (
              <div className="landmarks-suggestion-box">
                <span className="landmark-title">Quick Landmark Suggestions:</span>
                <div className="landmark-pills">
                  {COMMON_FAISALABAD_LANDMARKS[areaName].map((landmark) => (
                    <button
                      key={landmark}
                      type="button"
                      className="landmark-chip"
                      onClick={() => setAddress((prev) => (prev ? `${prev}, ${landmark}` : landmark))}
                    >
                      + {landmark}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dispatch Timing */}
            <div className="field-group">
              <label className="field-label">Dispatch Timing</label>
              <div className="timing-options-grid">
                <button
                  type="button"
                  className={`timing-card ${scheduleType === 'now' ? 'active' : ''}`}
                  onClick={() => setScheduleType('now')}
                >
                  <Clock size={18} className="text-primary" />
                  <div>
                    <strong>⚡ Immediate Dispatch (Fast)</strong>
                    <small>Nearest Ustad departs in ~15-25 mins</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`timing-card ${scheduleType === 'scheduled' ? 'active' : ''}`}
                  onClick={() => setScheduleType('scheduled')}
                >
                  <Calendar size={18} className="text-warning" />
                  <div>
                    <strong>📅 Schedule Convenient Slot</strong>
                    <small>Choose custom date & time window</small>
                  </div>
                </button>
              </div>

              {scheduleType === 'scheduled' && (
                <div className="scheduled-select-wrap">
                  <select
                    className="field-select"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  >
                    <option value="Today, 2:00 PM - 4:00 PM">Today, 2:00 PM - 4:00 PM</option>
                    <option value="Today, 5:00 PM - 7:00 PM">Today, 5:00 PM - 7:00 PM</option>
                    <option value="Tomorrow, 10:00 AM - 12:00 PM">Tomorrow, 10:00 AM - 12:00 PM</option>
                    <option value="Tomorrow, 3:00 PM - 5:00 PM">Tomorrow, 3:00 PM - 5:00 PM</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW, PRICE ESTIMATE & PAYMENT METHOD */}
        {step === 4 && (
          <div className="step-content">
            <div className="review-summary-card">
              <div className="summary-row">
                <span className="summary-label">Selected Service:</span>
                <strong className="summary-value">{currentService?.name}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Category:</span>
                <span className="summary-value text-uppercase">{currentService?.categoryId}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Location:</span>
                <span className="summary-value">{address} ({areaName.split(',')[0]})</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Timing:</span>
                <span className="summary-value">
                  {scheduleType === 'now' ? 'Immediate Dispatch (15-25 min)' : scheduledTime}
                </span>
              </div>
              {voiceNoteRecorded && (
                <div className="summary-row">
                  <span className="summary-label">Audio Note:</span>
                  <span className="summary-value text-success font-semibold">✓ 10s Voice Memo Attached</span>
                </div>
              )}
            </div>

            {/* Transparent Cost Breakdown */}
            <div className="pricing-breakdown-card">
              <div className="breakdown-header">
                <strong>Transparent Price Estimate</strong>
                <span className="pricing-badge">
                  {currentService?.pricingType === 'fixed' ? 'Fixed Labor Rate' : 'Diagnostic Inspection'}
                </span>
              </div>

              <div className="breakdown-line">
                <span>Standard Labor / Diagnostic Inspection:</span>
                <span>Rs. {currentService?.price}</span>
              </div>
              <div className="breakdown-line">
                <span>Platform Booking Fee:</span>
                <span className="text-success">FREE (Saylani Faisalabad Pilot)</span>
              </div>
              <div className="breakdown-total">
                <span>Total Estimated Labor:</span>
                <strong>Rs. {currentService?.price}</strong>
              </div>

              <div className="cost-disclaimer">
                <AlertCircle size={14} />
                <span>
                  Hardware spare parts are not included. If replacement components (switches, pipes, capacitor) are needed, you may provide them or Ustad will procure with shop receipt.
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="field-group">
              <label className="field-label">Choose Payment Method</label>
              <div className="payment-options-row">
                <button
                  type="button"
                  className={`payment-option-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <Banknote size={18} />
                  <span>Cash on Delivery</span>
                </button>
                <button
                  type="button"
                  className={`payment-option-card ${paymentMethod === 'easypaisa' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('easypaisa')}
                >
                  <Smartphone size={18} />
                  <span>Easypaisa</span>
                </button>
                <button
                  type="button"
                  className={`payment-option-card ${paymentMethod === 'jazzcash' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('jazzcash')}
                >
                  <CreditCard size={18} />
                  <span>JazzCash</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CELEBRATORY BOOKING SUCCESS SCREEN */}
        {step === 5 && createdBooking && (
          <div className="booking-success-view">
            <div className="success-icon-seal">
              <CheckCircle2 size={44} className="text-success" />
            </div>

            <div className="success-title-box">
              <span className="order-id-pill">ORDER #{createdBooking.id}</span>
              <h2>Ustad Dispatched Successfully!</h2>
              <p>
                Your service order for <strong>{createdBooking.serviceName}</strong> has been confirmed. A verified technician in {createdBooking.area.split(',')[0]} has received the work order.
              </p>
            </div>

            <div className="dispatch-eta-card">
              <Clock size={20} className="text-primary" />
              <div>
                <strong>Estimated Arrival Time: 15–25 Minutes</strong>
                <span>Motorbike dispatched equipped with complete tool kit</span>
              </div>
            </div>

            <div className="success-action-buttons">
              <button
                type="button"
                className="btn-track-live-now"
                onClick={() => {
                  handleClose();
                  openTrackingModal(createdBooking);
                }}
              >
                <Compass size={18} /> Track Ustad Live on Map
              </button>

              <button
                type="button"
                className="btn-open-chat-now"
                onClick={() => {
                  handleClose();
                  openChatModal(createdBooking);
                }}
              >
                <MessageSquare size={16} /> Open Chat with Ustad
              </button>

              <button
                type="button"
                className="btn-view-bookings-now"
                onClick={() => {
                  handleClose();
                  setCustomerTab('bookings');
                }}
              >
                View in My Bookings List
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Controls (Steps 1 to 4) */}
        {step <= 4 && (
          <div className="booking-modal-footer">
            {step > 1 && (
              <button
                type="button"
                className="footer-btn-back"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                className="footer-btn-next"
                onClick={handleNext}
              >
                Continue to Step {step + 1} →
              </button>
            ) : (
              <button
                type="button"
                className="footer-btn-confirm"
                onClick={handleSubmitBooking}
              >
                Confirm & Request Ustad (Rs. {currentService?.price})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CreateBookingModal: React.FC = () => {
  const { isCreateBookingOpen, selectedService, selectedUstad } = useApp();
  if (!isCreateBookingOpen) return null;
  const modalKey = `${selectedService?.id || 'default'}-${selectedUstad?.id || 'none'}`;
  return <CreateBookingModalContent key={modalKey} />;
};
