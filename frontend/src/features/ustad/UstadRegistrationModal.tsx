import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Wrench,
  Camera,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';
import type { ServiceCategoryType } from '../../types';

export const UstadRegistrationModal: React.FC = () => {
  const {
    isUstadRegisterModalOpen,
    setIsUstadRegisterModalOpen,
    registerUstad,
    currentUstad,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92 300 ');
  const [cnic, setCnic] = useState('33100-');
  const [experienceYears, setExperienceYears] = useState(5);
  const [serviceArea, setServiceArea] = useState('D-Ground, Peoples Colony No. 1');
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategoryType[]>(['electrician']);
  const [bio, setBio] = useState('');
  const [cnicFrontUploaded, setCnicFrontUploaded] = useState(false);
  const [cnicBackUploaded, setCnicBackUploaded] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isUstadRegisterModalOpen) return null;

  const toggleCategory = (cat: ServiceCategoryType) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!phone.trim() || phone.trim().length < 11) newErrors.phone = 'Valid phone number required';
    if (!cnic.trim() || cnic.trim().length < 13) newErrors.cnic = '13-digit CNIC required (33100-XXXXXXX-X)';
    if (selectedCategories.length === 0) newErrors.categories = 'Select at least one skill';
    if (!bio.trim() || bio.trim().length < 15) newErrors.bio = 'Provide a brief bio of your workshop experience';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerUstad({
        name,
        phone,
        cnic,
        skillCategories: selectedCategories,
        experienceYears,
        serviceArea,
        bio,
      });
      setIsUstadRegisterModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsUstadRegisterModalOpen(false)}>
      <div
        className="modal-surface ustad-register-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="register-modal-header">
          <div>
            <span className="verify-badge">
              <ShieldCheck size={14} /> Official Verification Desk
            </span>
            <h2 className="modal-title">Register as an Ustad / Mechanic</h2>
            <p className="modal-subtitle">
              Join Faisalabad's on-demand network. Earn transparent daily payouts.
            </p>
          </div>
          <button
            className="close-btn"
            onClick={() => setIsUstadRegisterModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Security Notice */}
        <div className="identity-privacy-box">
          <Lock size={16} className="lock-icon" />
          <div>
            <strong>Identity Protection Guarantee:</strong>
            <p>
              Your CNIC and certificates are encrypted. Only verified Faisalabad administrators review documents. CNIC numbers are never displayed publicly.
            </p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="register-form-body">
          <div className="form-two-col">
            <div className="form-group">
              <label className="form-label">Full Name (As per CNIC) *</label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Ustad Tariq Mehmood"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="field-err">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+92 3XX XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <span className="field-err">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-two-col">
            <div className="form-group">
              <label className="form-label">CNIC Number (13 Digits) *</label>
              <input
                type="text"
                className={`form-input ${errors.cnic ? 'error' : ''}`}
                placeholder="33100-XXXXXXX-X"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
              {errors.cnic && <span className="field-err">{errors.cnic}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Experience (Years) *</label>
              <input
                type="number"
                min={1}
                max={40}
                className="form-input"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Skill Categories */}
          <div className="form-group">
            <label className="form-label">Select Your Skills (Primary Categories) *</label>
            <div className="skills-select-grid">
              {(
                [
                  'electrician',
                  'plumber',
                  'ac-technician',
                  'bike-mechanic',
                  'car-mechanic',
                  'carpenter',
                ] as ServiceCategoryType[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`skill-check-btn ${selectedCategories.includes(cat) ? 'checked' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <Wrench size={14} />
                  <span>{cat.replace('-', ' ')}</span>
                </button>
              ))}
            </div>
            {errors.categories && <span className="field-err">{errors.categories}</span>}
          </div>

          {/* Service Area */}
          <div className="form-group">
            <label className="form-label">Primary Service Area in Faisalabad</label>
            <select
              className="form-select"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
            >
              {FAISALABAD_AREAS.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Document Uploads Mock Interface */}
          <div className="form-group">
            <label className="form-label">Verification Documents Upload</label>
            <div className="doc-uploads-row">
              <div
                className={`upload-box ${cnicFrontUploaded ? 'uploaded' : ''}`}
                onClick={() => setCnicFrontUploaded(!cnicFrontUploaded)}
              >
                {cnicFrontUploaded ? (
                  <CheckCircle2 size={24} className="text-success" />
                ) : (
                  <Upload size={24} />
                )}
                <span>CNIC Front (Mock Upload)</span>
                <small>{cnicFrontUploaded ? 'Attached' : 'Click to simulate'}</small>
              </div>

              <div
                className={`upload-box ${cnicBackUploaded ? 'uploaded' : ''}`}
                onClick={() => setCnicBackUploaded(!cnicBackUploaded)}
              >
                {cnicBackUploaded ? (
                  <CheckCircle2 size={24} className="text-success" />
                ) : (
                  <Upload size={24} />
                )}
                <span>CNIC Back (Mock Upload)</span>
                <small>{cnicBackUploaded ? 'Attached' : 'Click to simulate'}</small>
              </div>

              <div
                className={`upload-box ${certificateUploaded ? 'uploaded' : ''}`}
                onClick={() => setCertificateUploaded(!certificateUploaded)}
              >
                {certificateUploaded ? (
                  <CheckCircle2 size={24} className="text-success" />
                ) : (
                  <FileText size={24} />
                )}
                <span>Skill Certificate (Optional)</span>
                <small>{certificateUploaded ? 'Attached' : 'Click to simulate'}</small>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Workshop Bio & Tool Equipment *</label>
            <textarea
              className={`form-textarea ${errors.bio ? 'error' : ''}`}
              rows={3}
              placeholder="e.g. Master technician with 10 years experience. Own complete electrical tool kit, multimeters, and personal motorbike for doorstep dispatch..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            {errors.bio && <span className="field-err">{errors.bio}</span>}
          </div>

          <div className="form-actions-row">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsUstadRegisterModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn-primary">
              Submit Application for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
