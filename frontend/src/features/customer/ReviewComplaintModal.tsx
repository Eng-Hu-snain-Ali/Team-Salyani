import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import {
  X,
  Star,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Tag,
} from 'lucide-react';

export const ReviewComplaintModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    reviewBooking,
    submitCustomerReview,
    isComplaintModalOpen,
    setIsComplaintModalOpen,
    complaintBooking,
    submitCustomerComplaint,
    showToast,
  } = useApp();

  // Review Form
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Honest Price', 'On Time']);

  // Complaint Form
  const [complaintSubject, setComplaintSubject] = useState<string>('Overcharging on spare parts');
  const [complaintDescription, setComplaintDescription] = useState<string>('');

  const availableTags = [
    'On Time',
    'Honest Price',
    'Clean Work',
    'Polite Behavior',
    'Equipped Tools',
    'Fast Diagnostic',
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = async () => {
    if (!reviewBooking) return;
    if (reviewBooking.status !== 'completed') {
      showToast('Reviews can only be submitted for completed bookings.', 'error');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      showToast('Please write a brief comment describing your experience.', 'warning');
      return;
    }

    await submitCustomerReview({
      bookingId: reviewBooking.id,
      ustadId: reviewBooking.ustadId || 'ustad',
      rating,
      comment,
      tags: selectedTags,
    });

    setComment('');
  };

  const handleSubmitComplaint = async () => {
    if (!complaintBooking) return;
    if (!complaintDescription.trim() || complaintDescription.trim().length < 10) {
      showToast('Please provide details for the complaint (min 10 characters).', 'warning');
      return;
    }

    await submitCustomerComplaint({
      bookingId: complaintBooking.id,
      subject: complaintSubject,
      description: complaintDescription,
    });

    setComplaintDescription('');
  };

  return (
    <>
      {/* 1. REVIEW MODAL */}
      {isReviewModalOpen && reviewBooking && (
        <div className="modal-backdrop" onClick={() => setIsReviewModalOpen(false)}>
          <div
            className="modal-surface review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="review-modal-header">
              <div>
                <span className="badge-completed">Verified Completed Booking</span>
                <h2 className="review-title">Rate & Review Ustad</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setIsReviewModalOpen(false)}
                aria-label="Close review modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="review-modal-body">
              <div className="review-ustad-hero">
                <strong>{reviewBooking.ustadName || 'Ustad'}</strong>
                <span>{reviewBooking.serviceName} • Booking #{reviewBooking.id}</span>
              </div>

              {/* Interactive Stars */}
              <div className="star-rating-block">
                <span className="star-label">How was your service experience?</span>
                <RatingStars
                  rating={rating}
                  size={32}
                  interactive
                  onRatingChange={(newVal) => setRating(newVal)}
                />
                <span className="star-desc-text">
                  {rating === 5 && '⭐⭐⭐⭐⭐ Exceptional / Zabardast!'}
                  {rating === 4 && '⭐⭐⭐⭐ Very Good work'}
                  {rating === 3 && '⭐⭐⭐ Average service'}
                  {rating === 2 && '⭐⭐ Below expectations'}
                  {rating === 1 && '⭐ Poor experience'}
                </span>
              </div>

              {/* Tag selector */}
              <div className="review-tags-picker">
                <span className="tags-label">Select highlights:</span>
                <div className="tags-chips-row">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-picker-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => handleToggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div className="review-input-group">
                <label className="input-label">Detailed Review:</label>
                <textarea
                  className="review-textarea"
                  rows={4}
                  placeholder="Share details about punctuality, cleanliness, quality of repair, or attitude..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="review-modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="submit-review-btn"
                  onClick={handleSubmitReview}
                >
                  Submit Verified Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPLAINT MODAL */}
      {isComplaintModalOpen && complaintBooking && (
        <div className="modal-backdrop" onClick={() => setIsComplaintModalOpen(false)}>
          <div
            className="modal-surface complaint-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="complaint-modal-header">
              <div className="header-alert-icon">
                <ShieldAlert size={24} className="text-danger" />
              </div>
              <div>
                <h2 className="complaint-title">Lodge Customer Complaint</h2>
                <span className="complaint-sub">
                  Booking #{complaintBooking.id} • {complaintBooking.serviceName}
                </span>
              </div>
              <button
                className="close-btn"
                onClick={() => setIsComplaintModalOpen(false)}
                aria-label="Close complaint modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="complaint-modal-body">
              <div className="complaint-warning-banner">
                <AlertCircle size={16} />
                <span>
                  Our Faisalabad Trust & Safety Team investigates all reports. Your complaint will be reviewed by admin within 2 hours.
                </span>
              </div>

              <div className="field-group">
                <label className="field-label">Subject / Issue Category</label>
                <select
                  className="field-select"
                  value={complaintSubject}
                  onChange={(e) => setComplaintSubject(e.target.value)}
                >
                  <option value="Overcharging on spare parts">Overcharging on spare parts / labor</option>
                  <option value="Workmanship fault or recurring issue">Workmanship fault or recurring issue</option>
                  <option value="Ustad was significantly late">Ustad was significantly late</option>
                  <option value="Unprofessional behavior">Unprofessional or impolite behavior</option>
                  <option value="Damage to property or fixtures">Damage to property or fixtures</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Describe the problem in detail *</label>
                <textarea
                  className="field-textarea"
                  rows={4}
                  placeholder="Provide complete facts about what happened, amounts charged, or damages..."
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                />
              </div>

              <div className="complaint-modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setIsComplaintModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="submit-complaint-btn"
                  onClick={handleSubmitComplaint}
                >
                  Submit Official Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
