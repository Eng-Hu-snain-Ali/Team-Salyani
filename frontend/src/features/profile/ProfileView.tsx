import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  LogOut,
  Wrench,
  LayoutDashboard,
  Code2,
  CheckCircle2,
  GitBranch,
  Layers,
  Sparkles,
  Lock,
  Award,
  Smartphone,
  ExternalLink,
  GraduationCap,
  Building,
  Check,
  Cpu,
  ShieldAlert,
  Fingerprint,
  Zap,
  Star,
  Activity,
  FolderGit2,
} from 'lucide-react';
import { FAISALABAD_AREAS } from '../../constants';

interface TeamMember {
  name: string;
  role: string;
  badge: string;
  responsibilities: string[];
  initials: string;
  avatarColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Engr. Husnain Ali',
    role: 'Lead Full-Stack Architect & Team Lead',
    badge: 'Team Lead',
    initials: 'HA',
    avatarColor: 'blue',
    responsibilities: [
      'Platform Architecture & State Management Engine',
      '10% Commission Calculation & Wallet Financial Ledger',
      'Git Workflow & Team Repository Lead',
    ],
  },
  {
    name: 'Frontend Engineering Specialist',
    role: 'UI/UX & Design Systems Lead',
    badge: 'UI/UX Lead',
    initials: 'FE',
    avatarColor: 'purple',
    responsibilities: [
      'Responsive Mobile-First Interface & Theme Tokens',
      'Interactive Faisalabad Vector SVG Dispatch Map',
      'Customer Booking Flow & Sound Memo Simulator',
    ],
  },
  {
    name: 'Mobile & Dispatch Specialist',
    role: 'Artisan & Field Operations Engineer',
    badge: 'Field Ops',
    initials: 'DO',
    avatarColor: 'amber',
    responsibilities: [
      'Ustad Field Portal & Real-Time Job Radar',
      'Active Job Execution Lifecycle Stepper',
      'Faisalabad Pilot Geo-Locality Dispatch Engine',
    ],
  },
  {
    name: 'Data Architecture & Security Engineer',
    role: 'Database & Cloud Firestore Architect',
    badge: 'Backend/Sec',
    initials: 'SE',
    avatarColor: 'green',
    responsibilities: [
      'Cloud Firestore Typed Data Contracts & Schemas',
      'NADRA CNIC Privacy Shielding & Encryption Protocol',
      'Phone OTP Simulated Auth & Security Rule Matrices',
    ],
  },
  {
    name: 'QA & Compliance Lead',
    role: 'Quality Assurance & Dispute Mediation Specialist',
    badge: 'QA & Trust',
    initials: 'QA',
    avatarColor: 'red',
    responsibilities: [
      'Government Compliance & NADRA Audit Dossier',
      'Dispute Resolution Triage Desk & Remedy Logic',
      'Cross-Browser Strict Verification & Zero-Error Builds',
    ],
  },
];

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    setActiveRole,
    logoutUser,
    bookings,
    showToast,
    isAdminAuthenticated,
    setIsAdminAuthModalOpen,
  } = useApp();

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
    showToast('Testing service address updated', 'success');
  };

  const completedJobsCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="customer-profile-container team-profile-showcase">
      {/* 1. TOP INSTITUTIONAL ACCREDITATION CREST */}
      <div className="institutional-crest-bar">
        <div className="crest-content">
          <GraduationCap size={18} className="text-primary" />
          <span className="crest-title">
            Saylani Mass IT Training (SMIT) • Official Team Project Initiative
          </span>
          <span className="crest-tag">Faisalabad Campus</span>
        </div>
      </div>

      {/* 2. EXECUTIVE TEAM HERO BANNER */}
      <div className="executive-team-hero-card">
        <div className="hero-emblem-cluster">
          <div className="executive-avatar-emblem">
            <Users size={38} className="text-white" />
          </div>
          <span className="verified-institute-seal" title="SMIT Accredited">
            <Award size={14} className="text-white" />
          </span>
        </div>

        <div className="executive-title-block">
          <div className="team-badge-row">
            <h1 className="executive-team-name">Team Saylani</h1>
            <span className="project-badge-pill">Collaborative Engineering Group</span>
            <span className="engineers-count-pill">5 Core Developers</span>
          </div>

          <h2 className="executive-platform-title">
            USTAD ONLINE — On-Demand Mechanic & Handyman Service Platform
          </h2>

          <p className="executive-tagline">
            "Reliable Ustads. Transparent Prices." — Pakistan's premier skilled labor dispatch network, piloting across Faisalabad Metropolitan.
          </p>

          <div className="executive-meta-chips">
            <span className="exec-chip">
              <Building size={13} className="text-primary" /> Saylani Mass IT Training (SMIT)
            </span>
            <span className="exec-chip">
              <MapPin size={13} className="text-danger" /> Pilot Region: Faisalabad, Punjab
            </span>
            <span className="exec-chip">
              <Cpu size={13} className="text-success" /> React 19 • TypeScript • Vite
            </span>
            <span className="exec-chip">
              <CheckCircle2 size={13} className="text-primary" /> 10% Commission Engine Built-in
            </span>
          </div>
        </div>
      </div>

      {/* 3. KEY ENGINEERING STATS & PLATFORM ARCHITECTURE */}
      <div className="team-architecture-kpi-grid">
        <div className="arch-kpi-card">
          <div className="arch-icon-box blue">
            <Layers size={22} />
          </div>
          <div className="arch-kpi-text">
            <strong>3 Integrated Portals</strong>
            <span>Customer App • Ustad Field App • Admin Web Panel</span>
          </div>
        </div>

        <div className="arch-kpi-card">
          <div className="arch-icon-box green">
            <Wrench size={22} />
          </div>
          <div className="arch-kpi-text">
            <strong>6 Essential Trades</strong>
            <span>Electrician, Plumber, AC, Bike, Car, Carpenter</span>
          </div>
        </div>

        <div className="arch-kpi-card">
          <div className="arch-icon-box amber">
            <Zap size={22} />
          </div>
          <div className="arch-kpi-text">
            <strong>10% Platform Cut</strong>
            <span>90% Net take-home for verified Ustads</span>
          </div>
        </div>

        <div className="arch-kpi-card">
          <div className="arch-icon-box purple">
            <ShieldCheck size={22} />
          </div>
          <div className="arch-kpi-text">
            <strong>NADRA CNIC Shield</strong>
            <span>Biometric privacy compliance on public profiles</span>
          </div>
        </div>
      </div>

      {/* 4. MEET THE ENGINEERING TEAM (ROLE & RESPONSIBILITY MATRIX) */}
      <div className="team-section-card">
        <div className="section-title-header">
          <div className="header-icon-seal">
            <Code2 size={20} className="text-primary" />
          </div>
          <div>
            <h3>Engineering Roster & Role Distribution</h3>
            <p>Collaborative multi-role development team structure</p>
          </div>
        </div>

        <div className="team-roster-grid">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className={`member-dossier-card border-${member.avatarColor}`}>
              <div className="member-header">
                <div className={`member-avatar-circle bg-${member.avatarColor}`}>
                  {member.initials}
                </div>
                <div className="member-title-col">
                  <div className="member-name-row">
                    <h4>{member.name}</h4>
                    <span className={`member-role-badge badge-${member.avatarColor}`}>
                      {member.badge}
                    </span>
                  </div>
                  <span className="member-role-title">{member.role}</span>
                </div>
              </div>

              <div className="member-tasks-list">
                <span className="tasks-heading">Core Contributions:</span>
                <ul>
                  {member.responsibilities.map((task, idx) => (
                    <li key={idx}>
                      <Check size={12} className="text-success task-check" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="member-card-footer">
                <span className="status-live-indicator">
                  <span className="live-dot" /> Verified Contributor
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. GITHUB REPOSITORY & SPECIFICATIONS CARD */}
      <div className="team-section-card repository-specs-card">
        <div className="section-title-header">
          <div className="header-icon-seal">
            <FolderGit2 size={20} className="text-primary" />
          </div>
          <div>
            <h3>Official Repository & Technical Blueprint</h3>
            <p>Git tracking, target repository, and production specifications</p>
          </div>
        </div>

        <div className="specs-items-table">
          <div className="spec-row">
            <span className="spec-label">
              <GitBranch size={15} /> Authorized Team Repository:
            </span>
            <span className="spec-value">
              <a
                href="https://github.com/Eng-Hu-snain-Ali/Team-Salyani.git"
                target="_blank"
                rel="noreferrer"
                className="repo-link"
              >
                https://github.com/Eng-Hu-snain-Ali/Team-Salyani.git
                <ExternalLink size={13} />
              </a>
            </span>
          </div>

          <div className="spec-row">
            <span className="spec-label">
              <Activity size={15} /> Active Git Branch:
            </span>
            <span className="spec-value">
              <code className="git-branch-code">main</code> (Synchronized & Clean Working Tree)
            </span>
          </div>

          <div className="spec-row">
            <span className="spec-label">
              <Cpu size={15} /> Technical Stack:
            </span>
            <span className="spec-value">
              React 19 • TypeScript (Strict Typecheck) • Vite 8 • Vanilla CSS Design System
            </span>
          </div>

          <div className="spec-row">
            <span className="spec-label">
              <Lock size={15} /> Security & Authorization:
            </span>
            <span className="spec-value">
              Admin Master Passcode Gate (<code>admin123</code>) • Shielded CNIC Records
            </span>
          </div>

          <div className="spec-row">
            <span className="spec-label">
              <MapPin size={15} /> Target Launch Market:
            </span>
            <span className="spec-value">
              Faisalabad, Pakistan (D-Ground, Kohinoor City, Madina Town, Peoples Colony, Canal Road)
            </span>
          </div>
        </div>
      </div>

      {/* 6. INTERACTIVE APPLICATION PORTAL SWITCHER (TESTING SANDBOX) */}
      <div className="team-section-card sandbox-card">
        <div className="section-title-header">
          <div className="header-icon-seal">
            <Smartphone size={20} className="text-primary" />
          </div>
          <div>
            <h3>Multi-Role Interactive Sandbox</h3>
            <p>Switch between the three purpose-built platform experiences for evaluation</p>
          </div>
        </div>

        <div className="sandbox-grid-three">
          {/* Customer View */}
          <div
            className="sandbox-role-box customer-box"
            onClick={() => {
              setActiveRole('customer');
              showToast('Switched to Customer Mobile App', 'info');
            }}
          >
            <div className="sandbox-box-header">
              <div className="sandbox-badge blue">CUSTOMER APP</div>
              <Smartphone size={20} className="text-primary" />
            </div>
            <h4>Customer Experience</h4>
            <p>
              Browse 6 categories, view transparent rate cards, book with voice note, and live track Ustads across Faisalabad.
            </p>
            <button type="button" className="sandbox-launch-btn">
              Launch Customer View →
            </button>
          </div>

          {/* Ustad Portal */}
          <div
            className="sandbox-role-box ustad-box"
            onClick={() => {
              setActiveRole('ustad');
              showToast('Switched to Ustad / Mechanic Portal', 'info');
            }}
          >
            <div className="sandbox-box-header">
              <div className="sandbox-badge amber">USTAD PORTAL</div>
              <Wrench size={20} className="text-warning" />
            </div>
            <h4>Ustad Field Portal</h4>
            <p>
              Technician dashboard, online availability toggle, incoming job requests radar, active jobs stepper, and 10% wallet ledger.
            </p>
            <button type="button" className="sandbox-launch-btn">
              Launch Ustad View →
            </button>
          </div>

          {/* Admin Web Panel */}
          <div
            className="sandbox-role-box admin-box"
            onClick={() => {
              if (isAdminAuthenticated) {
                setActiveRole('admin');
                showToast('Switched to Admin Web Panel', 'info');
              } else {
                setIsAdminAuthModalOpen(true);
              }
            }}
          >
            <div className="sandbox-box-header">
              <div className="sandbox-badge red">
                {isAdminAuthenticated ? 'ADMIN CONSOLE' : 'PASSCODE PROTECTED'}
              </div>
              <Lock size={18} className="text-danger" />
            </div>
            <h4>Admin Web Panel</h4>
            <p>
              NADRA CNIC verification dossier audit, rate card CRUD, bookings audit ledger, commission engine, and dispute triage desk.
            </p>
            <button type="button" className="sandbox-launch-btn admin-launch">
              {isAdminAuthenticated ? 'Open Admin Console →' : 'Enter Passcode to Open 🔒'}
            </button>
          </div>
        </div>
      </div>

      {/* 7. PRIMARY TESTING SERVICE ADDRESS CONFIGURATION */}
      <div className="team-section-card">
        <div className="section-header-line">
          <div>
            <h3>Simulated Dispatch Test Location</h3>
            <p>Coordinates used for calculating arrival ETA and technician dispatch in Faisalabad</p>
          </div>
          <button
            className="edit-addr-btn"
            onClick={() => setIsEditingAddress(!isEditingAddress)}
          >
            {isEditingAddress ? 'Cancel' : 'Change Location'}
          </button>
        </div>

        {isEditingAddress ? (
          <form onSubmit={handleSaveAddress} className="edit-address-form">
            <div className="form-group">
              <label className="form-label">Sector</label>
              <select
                className="form-select"
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

            <div className="form-group">
              <label className="form-label">Street Address & Landmark</label>
              <input
                type="text"
                className="form-input"
                value={newStreetAddress}
                onChange={(e) => setNewStreetAddress(e.target.value)}
              />
            </div>

            <button type="submit" className="save-addr-btn">
              Save Test Address
            </button>
          </form>
        ) : (
          <div className="address-display-box">
            <MapPin size={18} className="pin-icon" />
            <div>
              <strong>{user.address}</strong>
              <span>Active Sector: {user.area}</span>
            </div>
          </div>
        )}
      </div>

      {/* 8. SIGN OUT ACTION */}
      <div className="profile-footer-buttons">
        <button
          className="logout-action-btn"
          onClick={logoutUser}
        >
          <LogOut size={16} /> Reset & Sign Out Testing Session
        </button>
      </div>
    </div>
  );
};
