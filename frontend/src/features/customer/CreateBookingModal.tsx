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
} from 'lucide-react';
import { SAMPLE_PROBLEM_PHOTOS, FAISALABAD_AREAS } from '../../constants';
import type { ServiceCategoryType, PricingType, PaymentMethod, ServiceItem } from '../../types';

export const CreateBookingModal: React.FC = () => {
  const {
    isCreateBookingOpen,
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
    showToast,
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [selectedCategoryId, setSelectedCategoryId] = useState<ServiceCategoryType>('electrician');
  const [chosenServiceId, setChosenServiceId] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [problemImageUrl, setProblemImageUrl] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduledTime, setScheduledTime] = useState<string>('Today, 2:00 PM - 4:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize or pre-fill from selectedService or user
  useEffect(() => {
    if (selectedService) {
      setSelectedCategoryId(selectedService.categoryId);
      setChosenServiceId(selectedService.id);
    } else if (services.length > 0) {
      const first = services.find((s) => s.categoryId === selectedCategoryId) || services[0];
      setChosenServiceId(first.id);
    }

    if (user?.address) {
      setAddress(user.address);
    } else {
      setAddress('House 12, Street 4, Block A, Peoples Colony, Faisalabad');
    }

    setAreaName(selectedArea.name);
  }, [selectedService, selectedCategoryId, services, user, selectedArea]);

  if (!isCreateBookingOpen) return null;

  const currentService = services.find((s) => s.id === chosenServiceId) || services[0];

  const categoryServices = services.filter(
    (s) => s.categoryId === selectedCategoryId && s.isActive
  );

  const handleClose = () => {
    setIsCreateBookingOpen(false);
    setSelectedService(null);
    setSelectedUstad(null);
    setStep(1);
    setErrors({});
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!chosenServiceId) newErrors.service = 'Please select a service';
    } else if (currentStep === 2) {
      if (!problemDescription.trim() || problemDescription.trim().length < 10) {
        newErrors.description = 'Please describe the problem in at least 10 characters';
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

  const handleSubmitBooking = async () => {
    if (!currentService) return;

    try {
      await createBooking({
        serviceId: currentService.id,
        serviceName: currentService.name,
        categoryId: currentService.categoryId,
        problemDescription,
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

      handleClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit booking', 'error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-surface create-booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="booking-modal-header">
          <div>
            <span className="booking-modal-step-tag">Step {step} of 4</span>
            <h2 className="booking-modal-title">Book a Verified Ustad</h2>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="booking-stepper-dots">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1. Service</div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2. Problem</div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3. Location</div>
          <div className={`step-dot ${step >= 4 ? 'active' : ''}`}>4. Confirm</div>
        </div>

        {/* STEP 1: SELECT CATEGORY & SERVICE */}
        {step === 1 && (
          <div className="step-content">
            <div className="field-group">
              <label className="field-label">1. Select Service Category</label>
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

            <div className="field-group">
              <label className="field-label">2. Select Specific Service</label>
              <div className="service-pick-list">
                {categoryServices.map((srv) => (
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
                      <span>Rs. {srv.price}</span>
                      <small>{srv.pricingType === 'fixed' ? 'Fixed Labor' : 'Inspection'}</small>
                    </div>
                  </div>
                ))}
              </div>
              {errors.service && <span className="field-error-msg">{errors.service}</span>}
            </div>

            {selectedUstad && (
              <div className="assigned-ustad-notice">
                <CheckCircle2 size={16} className="text-success" />
                <span>
                  Booking directly with: <strong>{selectedUstad.name}</strong> ({selectedUstad.serviceArea})
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PROBLEM DETAILS & PHOTO */}
        {step === 2 && (
          <div className="step-content">
            <div className="field-group">
              <label className="field-label">Describe the Problem *</label>
              <textarea
                className={`field-textarea ${errors.description ? 'error' : ''}`}
                rows={4}
                placeholder="Describe what is broken, abnormal sounds, sparking, water leaks, or specific requirements..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
              />
              {errors.description && <span className="field-error-msg">{errors.description}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">
                <Camera size={15} /> Attach Problem Photo (Optional)
              </label>
              <small className="field-hint">
                Select a sample photo or upload so the Ustad brings the right spare parts.
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
              <label className="field-label">Service Sector in Faisalabad</label>
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
              <label className="field-label">Full Street Address & Landmark *</label>
              <input
                type="text"
                className={`field-input ${errors.address ? 'error' : ''}`}
                placeholder="House #, Street #, Landmark (e.g., Near D-Ground water tank)..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <span className="field-error-msg">{errors.address}</span>}
            </div>

            <div className="field-group">
              <label className="field-label">Dispatch Timing</label>
              <div className="timing-options-grid">
                <button
                  type="button"
                  className={`timing-card ${scheduleType === 'now' ? 'active' : ''}`}
                  onClick={() => setScheduleType('now')}
                >
                  <Clock size={18} />
                  <div>
                    <strong>Immediate Dispatch</strong>
                    <small>Ustad arrives in ~20-30 mins</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`timing-card ${scheduleType === 'scheduled' ? 'active' : ''}`}
                  onClick={() => setScheduleType('scheduled')}
                >
                  <Calendar size={18} />
                  <div>
                    <strong>Schedule for Later</strong>
                    <small>Pick convenient time slot</small>
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
                <span className="summary-value">{currentService?.categoryId.toUpperCase()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Location:</span>
                <span className="summary-value">{address} ({areaName.split(',')[0]})</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Timing:</span>
                <span className="summary-value">
                  {scheduleType === 'now' ? 'Immediate Dispatch (15-30 min)' : scheduledTime}
                </span>
              </div>
            </div>

            {/* Transparent Cost Breakdown */}
            <div className="pricing-breakdown-card">
              <div className="breakdown-header">
                <strong>Transparent Price Estimate</strong>
                <span className="pricing-badge">{currentService?.pricingType === 'fixed' ? 'Fixed Price' : 'Inspection'}</span>
              </div>

              <div className="breakdown-line">
                <span>Standard Labor / Diagnostic:</span>
                <span>Rs. {currentService?.price}</span>
              </div>
              <div className="breakdown-line">
                <span>Platform Booking Fee:</span>
                <span className="text-success">FREE (Faisalabad Pilot)</span>
              </div>
              <div className="breakdown-total">
                <span>Estimated Total:</span>
                <strong>Rs. {currentService?.price}</strong>
              </div>

              <div className="cost-disclaimer">
                <AlertCircle size={13} />
                <span>
                  Hardware spare parts are not included. If replacement components are required, you may provide them or Ustad will supply with original receipt.
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

        {/* Modal Footer Controls */}
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
      </div>
    </div>
  );
};
