import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  MapPin,
  ShieldCheck,
  Award,
  Smartphone,
  ExternalLink,
  GraduationCap,
  Building,
  Check,
  Cpu,
  Lock,
  Layers,
  Wrench,
  Zap,
  Star,
  LogOut,
  Sun,
  Moon,
  CheckCircle2,
  FolderGit2,
  Sparkles,
  Phone,
  Compass,
  ArrowRight,
  Shield,
  HelpCircle,
  FileCode,
  Radio,
  Sliders,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';

interface TeamMember {
  name: string;
  role: string;
  badge: string;
  tags: string[];
  summary: string;
  initials: string;
  avatarColor: 'blue' | 'purple' | 'cyan' | 'emerald' | 'amber';
  isLead?: boolean;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Engr. Husnain Ali',
    role: 'Lead Full-Stack Architect & Team Lead',
    badge: 'Team Lead',
    isLead: true,
    initials: 'HA',
    avatarColor: 'blue',
    summary:
      'Orchestrated end-to-end architecture, multi-portal state synchronization, 10% commission financial ledger, and team Git release management.',
    tags: ['Architecture', 'React 19', 'TypeScript', 'Commission Engine', 'Team Lead'],
  },
  {
    name: 'Frontend & UI/UX Specialist',
    role: 'UI/UX Design Systems & Mobile Ergonomics',
    badge: 'Design & UX',
    initials: 'FE',
    avatarColor: 'purple',
    summary:
      'Engineered mobile-first interface, interactive Faisalabad dispatch map, multi-theme design tokens, and customer booking flow.',
    tags: ['Design System', 'Faisalabad Map', 'Micro-Interactions', 'Responsive UI'],
  },
  {
    name: 'Artisan & Dispatch Specialist',
    role: 'Artisan Operations & Field Dispatch Engineer',
    badge: 'Field Ops',
    initials: 'DO',
    avatarColor: 'cyan',
    summary:
      'Built Ustad field technician workstation, real-time incoming job radar, multi-step job lifecycle, and route dispatch logic.',
    tags: ['Ustad Portal', 'Job Radar', 'Workflow Stepper', 'Artisan Workflows'],
  },
  {
    name: 'Cloud Data & Security Architect',
    role: 'Cloud Firestore & Data Privacy Engineer',
    badge: 'Backend & Sec',
    initials: 'SE',
    avatarColor: 'emerald',
    summary:
      'Architected Cloud Firestore data models, NADRA biometric CNIC privacy shielding, and simulated phone OTP auth security.',
    tags: ['Firestore', 'CNIC Privacy Shield', 'OTP Auth', 'Data Models'],
  },
  {
    name: 'QA & Compliance Lead',
    role: 'Quality Assurance & Dispute Resolution Lead',
    badge: 'QA & Trust',
    initials: 'QA',
    avatarColor: 'amber',
    summary:
      'Designed government NADRA audit dossier, complaints triage mediation desk, cross-device QA, and strict zero-error builds.',
    tags: ['NADRA Dossier', 'Dispute Triage', 'Cross-Browser QA', 'Test Coverage'],
  },
];

type ProfileTab = 'team' | 'ecosystem' | 'account';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    activeRole,
    setActiveRole,
    logoutUser,
    bookings,
    showToast,
    isAdminAuthenticated,
    setIsAdminAuthModalOpen,
    theme,
    toggleTheme,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ProfileTab>('team');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newStreetAddress, setNewStreetAddress] = useState(user.address);
  const [newArea, setNewArea] = useState(user.area);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      address: newStreetAddress,
      area: newArea,
    });
    setIsEditingAddress(false);
    showToast('Faisalabad service location updated successfully', 'success');
  };

  const completedJobsCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="pro-profile-view">
      {/* 1. TOP INSTITUTIONAL ACCREDITATION PILL */}
      <div className="pro-institutional-banner">
        <div className="pro-banner-inner">
          <div className="pro-banner-left">
            <GraduationCap size={16} className="text-primary-glow" />
            <span className="pro-banner-badge">SMIT CAPSTONE INITIATIVE</span>
            <span className="pro-banner-text">
              Saylani Mass IT Training • Faisalabad Innovation Lab
            </span>
          </div>
          <div className="pro-banner-right">
            <span className="pro-campus-tag">
              <Building size={12} /> Faisalabad Campus
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE HERO IDENTITY CARD */}
      <div className="pro-hero-card">
        <div className="pro-hero-bg-glow" />
        <div className="pro-hero-content">
          <div className="pro-hero-top-row">
            <div className="pro-avatar-container">
              <div className="pro-avatar-crest">
                <Users size={34} className="pro-crest-icon" />
              </div>
              <div className="pro-verified-seal" title="SMIT Verified Project">
                <Award size={14} className="text-white" />
              </div>
            </div>

            <div className="pro-hero-info">
              <div className="pro-title-line">
                <h1 className="pro-team-title">Team Saylani</h1>
                <span className="pro-org-type-chip">Verified Engineering Team</span>
                <span className="pro-member-count-pill">5 Full-Stack Developers</span>
              </div>
              <h2 className="pro-platform-name">
                USTAD ONLINE <span className="pro-platform-dot">•</span> On-Demand Mechanic & Handyman Service Platform
              </h2>
              <p className="pro-mission-quote">
                "Reliable Ustads. Transparent Prices." — Pakistan's premier skilled labor dispatch network, piloting across Faisalabad Metropolitan.
              </p>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="pro-metrics-ribbon">
            <div className="pro-metric-item">
              <div className="pro-metric-val">6</div>
              <div className="pro-metric-lbl">Trade Categories</div>
            </div>
            <div className="pro-metric-divider" />
            <div className="pro-metric-item">
              <div className="pro-metric-val">3</div>
              <div className="pro-metric-lbl">Portals in 1 App</div>
            </div>
            <div className="pro-metric-divider" />
            <div className="pro-metric-item">
              <div className="pro-metric-val">10%</div>
              <div className="pro-metric-lbl">Fair Commission</div>
            </div>
            <div className="pro-metric-divider" />
            <div className="pro-metric-item">
              <div className="pro-metric-val">4.98★</div>
              <div className="pro-metric-lbl">Quality Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEGMENTED TAB SWITCHER */}
      <div className="pro-tab-bar">
        <button
          type="button"
          className={`pro-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={16} />
          <span>Team Saylani Roster</span>
        </button>

        <button
          type="button"
          className={`pro-tab-btn ${activeTab === 'ecosystem' ? 'active' : ''}`}
          onClick={() => setActiveTab('ecosystem')}
        >
          <Layers size={16} />
          <span>Platform Ecosystem</span>
        </button>

        <button
          type="button"
          className={`pro-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <Sliders size={16} />
          <span>Account & Settings</span>
        </button>
      </div>

      {/* TAB 1: TEAM SAYLANI ROSTER & ROLES */}
      {activeTab === 'team' && (
        <div className="pro-tab-pane animate-fade-in">
          {/* Institutional Project Mission Card */}
          <div className="pro-section-card pro-mission-card">
            <div className="pro-card-header">
              <div className="pro-icon-seal blue">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="pro-card-title">Project Mission & Capstone Mandate</h3>
                <p className="pro-card-subtitle">
                  Saylani Mass IT Training (SMIT) • Faisalabad Skilled Labor Modernization
                </p>
              </div>
            </div>
            <div className="pro-mission-body">
              <p>
                <strong>USTAD ONLINE</strong> is an enterprise-grade digital dispatch ecosystem designed by{' '}
                <strong>Team Saylani</strong> to formalize Pakistan's informal artisan trade economy. Built with strict
                focus on <strong>Faisalabad Metropolitan</strong>, it connects household consumers and stranded motorists
                with verified mechanics, electricians, plumbers, and technicians within 15–30 minutes at guaranteed,
                pre-approved standard rates.
              </p>
              <div className="pro-pills-row">
                <span className="pro-pill">
                  <CheckCircle2 size={13} className="text-success" /> 90% Net Take-Home for Ustads
                </span>
                <span className="pro-pill">
                  <CheckCircle2 size={13} className="text-success" /> Biometric NADRA Trust Shield
                </span>
                <span className="pro-pill">
                  <CheckCircle2 size={13} className="text-success" /> Anti-Price-Gouging Standard Rate Cards
                </span>
              </div>
            </div>
          </div>

          {/* Core Engineering Leadership Spotlight */}
          <div className="pro-section-card">
            <div className="pro-card-header">
              <div className="pro-icon-seal emerald">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="pro-card-title">Engineering Leadership & Core Contributors</h3>
                <p className="pro-card-subtitle">
                  Multi-disciplinary development team behind USTAD ONLINE
                </p>
              </div>
            </div>

            <div className="pro-roster-grid">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className={`pro-member-card ${member.isLead ? 'is-lead-highlight' : ''}`}
                >
                  <div className="pro-member-top">
                    <div className={`pro-avatar-bubble avatar-${member.avatarColor}`}>
                      {member.initials}
                    </div>
                    <div className="pro-member-meta">
                      <div className="pro-name-row">
                        <h4 className="pro-member-name">{member.name}</h4>
                        <span className={`pro-role-pill pill-${member.avatarColor}`}>
                          {member.badge}
                        </span>
                      </div>
                      <span className="pro-member-role">{member.role}</span>
                    </div>
                  </div>

                  <p className="pro-member-summary">{member.summary}</p>

                  <div className="pro-member-tags">
                    {member.tags.map((tag) => (
                      <span key={tag} className="pro-tag-item">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pro-member-footer">
                    <span className="pro-verified-contributor">
                      <span className="pro-pulse-dot" /> Verified Contributor
                    </span>
                    {member.isLead && (
                      <span className="pro-lead-flag">
                        <Award size={12} /> Project Lead
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Accreditation Footer */}
          <div className="pro-smit-footer-card">
            <div className="pro-smit-logo-cluster">
              <Building size={26} className="text-primary" />
              <div>
                <h4>Saylani Mass IT Training (SMIT)</h4>
                <span>Faisalabad Campus • Vocational Software Engineering Track</span>
              </div>
            </div>
            <div className="pro-smit-accreditation-badge">
              <span>Capstone ID:</span>
              <strong>SMIT-FSD-USTAD-2026</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM ECOSYSTEM & SANDBOX */}
      {activeTab === 'ecosystem' && (
        <div className="pro-tab-pane animate-fade-in">
          {/* Interactive 3-Portal Sandbox Switcher */}
          <div className="pro-section-card">
            <div className="pro-card-header">
              <div className="pro-icon-seal blue">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="pro-card-title">Three Purpose-Built Platform Portals</h3>
                <p className="pro-card-subtitle">
                  Experience each role instantly to evaluate the full business workflow
                </p>
              </div>
            </div>

            <div className="pro-portals-grid">
              {/* Customer Portal */}
              <div
                className={`pro-portal-card ${activeRole === 'customer' ? 'active-portal' : ''}`}
                onClick={() => {
                  setActiveRole('customer');
                  showToast('Switched to Customer Mobile App', 'info');
                }}
              >
                <div className="pro-portal-header">
                  <div className="pro-portal-tag blue">CUSTOMER APP</div>
                  {activeRole === 'customer' && <span className="pro-active-badge">Active View</span>}
                </div>
                <div className="pro-portal-icon-box blue">
                  <Smartphone size={24} />
                </div>
                <h4>Customer Experience</h4>
                <p>
                  Browse 6 skilled trades, view transparent rate cards, book with 1-tap issue chips or voice notes, and live track Ustads across Faisalabad.
                </p>
                <button type="button" className="pro-portal-action-btn blue">
                  {activeRole === 'customer' ? 'Currently Active' : 'Launch Customer View →'}
                </button>
              </div>

              {/* Ustad Portal */}
              <div
                className={`pro-portal-card ${activeRole === 'ustad' ? 'active-portal' : ''}`}
                onClick={() => {
                  setActiveRole('ustad');
                  showToast('Switched to Ustad Field Portal', 'info');
                }}
              >
                <div className="pro-portal-header">
                  <div className="pro-portal-tag amber">USTAD PORTAL</div>
                  {activeRole === 'ustad' && <span className="pro-active-badge">Active View</span>}
                </div>
                <div className="pro-portal-icon-box amber">
                  <Wrench size={24} />
                </div>
                <h4>Ustad Field Workstation</h4>
                <p>
                  Real-time incoming job radar, online availability toggle, active job execution stepper, customer call trigger, and 10% commission wallet.
                </p>
                <button type="button" className="pro-portal-action-btn amber">
                  {activeRole === 'ustad' ? 'Currently Active' : 'Launch Ustad View →'}
                </button>
              </div>

              {/* Admin Portal */}
              <div
                className={`pro-portal-card ${activeRole === 'admin' ? 'active-portal' : ''}`}
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setActiveRole('admin');
                    showToast('Switched to Admin Web Panel', 'info');
                  } else {
                    setIsAdminAuthModalOpen(true);
                  }
                }}
              >
                <div className="pro-portal-header">
                  <div className="pro-portal-tag red">
                    {isAdminAuthenticated ? 'ADMIN CONSOLE' : 'PASSCODE GATE'}
                  </div>
                  {activeRole === 'admin' && <span className="pro-active-badge">Active View</span>}
                </div>
                <div className="pro-portal-icon-box red">
                  <Lock size={24} />
                </div>
                <h4>Admin Management Panel</h4>
                <p>
                  NADRA CNIC verification dossier audit, rate card CRUD, bookings audit ledger, commission revenue calculator, and dispute triage desk.
                </p>
                <button type="button" className="pro-portal-action-btn red">
                  {isAdminAuthenticated ? 'Open Admin Console →' : 'Enter Passcode to Open 🔒'}
                </button>
              </div>
            </div>
          </div>

          {/* Core Architectural Pillars */}
          <div className="pro-section-card">
            <div className="pro-card-header">
              <div className="pro-icon-seal purple">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="pro-card-title">Architectural Pillars & Security Standards</h3>
                <p className="pro-card-subtitle">
                  Engineered to meet institutional and real-world deployment standards
                </p>
              </div>
            </div>

            <div className="pro-pillars-grid">
              <div className="pro-pillar-card">
                <div className="pro-pillar-icon blue">
                  <Zap size={20} />
                </div>
                <div className="pro-pillar-body">
                  <strong>10% Fair Commission Model</strong>
                  <p>
                    Ustads keep 90% of their billings. Platform fee is deducted transparently from the in-app wallet ledger.
                  </p>
                </div>
              </div>

              <div className="pro-pillar-card">
                <div className="pro-pillar-icon emerald">
                  <ShieldCheck size={20} />
                </div>
                <div className="pro-pillar-body">
                  <strong>Biometric NADRA Privacy Shield</strong>
                  <p>
                    All public customer views mask technician CNIC numbers to prevent identity exposure while keeping verified badges.
                  </p>
                </div>
              </div>

              <div className="pro-pillar-card">
                <div className="pro-pillar-icon purple">
                  <MapPin size={20} />
                </div>
                <div className="pro-pillar-body">
                  <strong>Hyperlocal Faisalabad Radar</strong>
                  <p>
                    Zone dispatch across D-Ground, Kohinoor City, Madina Town, Peoples Colony, and Canal Road with arrival ETAs.
                  </p>
                </div>
              </div>

              <div className="pro-pillar-card">
                <div className="pro-pillar-icon amber">
                  <Radio size={20} />
                </div>
                <div className="pro-pillar-body">
                  <strong>Multi-Modal Booking Flow</strong>
                  <p>
                    Combines 1-tap issue chips with simulated voice note recording to serve customers in urgent roadside situations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Repository & Git Specifications */}
          <div className="pro-section-card">
            <div className="pro-card-header">
              <div className="pro-icon-seal blue">
                <FolderGit2 size={20} />
              </div>
              <div>
                <h3 className="pro-card-title">Authorized Git Repository</h3>
                <p className="pro-card-subtitle">
                  Source control repository for Team Saylani
                </p>
              </div>
            </div>

            <div className="pro-repo-box">
              <div className="pro-repo-details">
                <div className="pro-repo-line">
                  <span className="pro-repo-label">Target Repository:</span>
                  <a
                    href="https://github.com/Eng-Hu-snain-Ali/Team-Salyani.git"
                    target="_blank"
                    rel="noreferrer"
                    className="pro-repo-link"
                  >
                    https://github.com/Eng-Hu-snain-Ali/Team-Salyani.git
                    <ExternalLink size={13} />
                  </a>
                </div>
                <div className="pro-repo-line">
                  <span className="pro-repo-label">Primary Branch:</span>
                  <span className="pro-branch-badge">
                    <FileCode size={13} /> main (Clean Working Tree)
                  </span>
                </div>
                <div className="pro-repo-line">
                  <span className="pro-repo-label">Tech Stack:</span>
                  <span className="pro-stack-text">React 19 • TypeScript Strict • Vite 8 • Vanilla CSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNT & SETTINGS */}
      {activeTab === 'account' && (
        <div className="pro-tab-pane animate-fade-in">
          {/* Active Testing User Dossier */}
          <div className="pro-section-card">
            <div className="pro-card-header">
              <div className="pro-icon-seal blue">
                <Users size={20} />
              </div>
              <div>
                <h3 className="pro-card-title">Customer Testing Profile</h3>
                <p className="pro-card-subtitle">
                  Active customer persona details used during dispatch simulation
                </p>
              </div>
            </div>

            <div className="pro-account-details-grid">
              <div className="pro-account-item">
                <span className="pro-item-label">Account Name</span>
                <span className="pro-item-val">{user.name}</span>
              </div>
              <div className="pro-account-item">
                <span className="pro-item-label">Registered Phone</span>
                <span className="pro-item-val font-mono">{user.phone}</span>
              </div>
              <div className="pro-account-item">
                <span className="pro-item-label">Authentication Status</span>
                <span className="pro-status-badge success">
                  <CheckCircle2 size={12} /> Phone OTP Verified
                </span>
              </div>
              <div className="pro-account-item">
                <span className="pro-item-label">Completed Bookings</span>
                <span className="pro-item-val">{completedJobsCount} Services Completed</span>
              </div>
            </div>
          </div>

          {/* Faisalabad Service Location */}
          <div className="pro-section-card">
            <div className="pro-card-header between">
              <div className="pro-card-header-left">
                <div className="pro-icon-seal emerald">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="pro-card-title">Faisalabad Dispatch Address</h3>
                  <p className="pro-card-subtitle">
                    Coordinates used to compute arrival ETAs and technician routing
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="pro-btn-secondary"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
              >
                {isEditingAddress ? 'Cancel' : 'Edit Location'}
              </button>
            </div>

            {isEditingAddress ? (
              <form onSubmit={handleSaveAddress} className="pro-address-form">
                <div className="pro-form-group">
                  <label className="pro-form-label">Sector / Area</label>
                  <select
                    className="pro-form-select"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  >
                    {FAISALABAD_AREAS.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name} ({a.urduName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pro-form-group">
                  <label className="pro-form-label">Street Address & Landmark</label>
                  <input
                    type="text"
                    className="pro-form-input"
                    value={newStreetAddress}
                    onChange={(e) => setNewStreetAddress(e.target.value)}
                    placeholder="e.g. House 42, Street 3, D-Ground"
                  />
                </div>

                <button type="submit" className="pro-btn-primary">
                  Save Service Location
                </button>
              </form>
            ) : (
              <div className="pro-address-display-box">
                <div className="pro-address-icon-box">
                  <MapPin size={22} className="text-primary" />
                </div>
                <div className="pro-address-text">
                  <strong>{user.address}</strong>
                  <span>Sector: {user.area}, Faisalabad, Punjab, Pakistan</span>
                </div>
              </div>
            )}
          </div>

          {/* Application Preferences & Theme Switcher */}
          <div className="pro-section-card">
            <div className="pro-card-header">
              <div className="pro-icon-seal amber">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="pro-card-title">Application Preferences</h3>
                <p className="pro-card-subtitle">Theme, language, and system configuration</p>
              </div>
            </div>

            <div className="pro-settings-list">
              <div className="pro-setting-row">
                <div className="pro-setting-info">
                  <strong>Visual Appearance</strong>
                  <span>Switch between High-Contrast Dark Mode and Clean Light Mode</span>
                </div>
                <button
                  type="button"
                  className="pro-theme-toggle-btn"
                  onClick={toggleTheme}
                  title="Toggle Dark/Light Mode"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={16} className="text-warning" />
                      <span>Switch to Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="text-primary" />
                      <span>Switch to Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pro-setting-row">
                <div className="pro-setting-info">
                  <strong>Pilot City</strong>
                  <span>Initial rollout market for Ustad Online</span>
                </div>
                <span className="pro-setting-pill">Faisalabad Metropolitan</span>
              </div>

              <div className="pro-setting-row">
                <div className="pro-setting-info">
                  <strong>Interface Language</strong>
                  <span>Bilingual support across Roman Urdu & English</span>
                </div>
                <span className="pro-setting-pill">English / اردو</span>
              </div>
            </div>
          </div>

          {/* Reset / Sign Out */}
          <div className="pro-footer-actions">
            <button
              type="button"
              className="pro-signout-btn"
              onClick={logoutUser}
            >
              <LogOut size={16} /> Reset & Sign Out Testing Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
