import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { Modal } from '../../components/common/Modal';
import { CATEGORIES } from '../../constants';
import { TEAM_MEMBERS, TEAM_PROFILE } from '../../data/mockData';
import type { ExperienceCategory } from '../../types';
import {
  Users,
  BookOpen,
  Bookmark,
  Info,
  ThumbsUp,
  Sparkles,
  Layers,
  Code,
  Globe,
  LogOut,
  LogIn,
  UserCheck,
  Edit3,
  MapPin,
  Briefcase,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    profileViewMode,
    setProfileViewMode,
    updateUser,
    logoutUser,
    openAuthModal,
    experiences,
    savedExperiences,
    setActiveTab,
  } = useApp();

  // Local tab within the Team Profile
  const [teamTab, setTeamTab] = useState<'about' | 'members' | 'project' | 'experiences' | 'community'>('about');

  // Local tab within individual User Profile
  const [userTab, setUserTab] = useState<'experiences' | 'saved' | 'about'>('experiences');

  // Edit user modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editBio, setEditBio] = useState(user.bio);
  const [editRole, setEditRole] = useState(user.role || '');
  const [editLocation, setEditLocation] = useState(user.location || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [editInterests, setEditInterests] = useState<ExperienceCategory[]>(user.interests);

  const toggleInterest = (cat: ExperienceCategory) => {
    setEditInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name: editName,
      username: editUsername,
      bio: editBio,
      role: editRole,
      location: editLocation,
      avatar: editAvatar,
      interests: editInterests,
    });
    setIsEditModalOpen(false);
  };

  const teamExperiences = experiences.filter((e) => e.author.id === 'usr_team_lived' || e.author.username === 'the_team');
  const myExperiences = experiences.filter((e) => e.author.id === user.id);

  return (
    <div className="profile-view-container">
      {/* Top Profile Switcher Bar */}
      <div className="profile-mode-switch-bar">
        <button
          type="button"
          className={`mode-switch-btn ${profileViewMode === 'team' ? 'active' : ''}`}
          onClick={() => setProfileViewMode('team')}
        >
          <Users size={15} />
          <span>The Team (Project)</span>
        </button>

        <button
          type="button"
          className={`mode-switch-btn ${profileViewMode === 'user' ? 'active' : ''}`}
          onClick={() => setProfileViewMode('user')}
        >
          <UserCheck size={15} />
          <span>{isAuthenticated ? `My Account (${user.name})` : 'Individual Profile'}</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. THE TEAM PROFILE (Default / Core Identity)                         */}
      {/* ==================================================================== */}
      {profileViewMode === 'team' && (
        <div className="team-profile-section">
          {/* Team Header Card */}
          <section className="profile-header-card team-hero-card">
            <div className="profile-hero-row">
              {/* Professional Lived Team Monogram Avatar */}
              <div className="team-brand-avatar-box">
                <div className="team-brand-symbol">
                  <span>L</span>
                </div>
              </div>

              <div className="profile-meta-main">
                <div className="profile-name-action-row">
                  <div>
                    <div className="team-title-row">
                      <h1 className="profile-user-name">The Team</h1>
                      <span className="team-verified-badge">Team Project</span>
                    </div>
                    <span className="profile-user-handle">@the_team • Lived</span>
                  </div>

                  <div className="team-header-badges">
                    <span className="team-role-pill">
                      <Briefcase size={12} />
                      <span>{TEAM_PROFILE.role}</span>
                    </span>
                  </div>
                </div>

                <p className="profile-bio-text">{TEAM_PROFILE.bio}</p>

                <div className="profile-tags-row">
                  <span className="profile-tag-item">
                    <Globe size={12} />
                    <span>Collaborative MVP</span>
                  </span>
                  <span className="profile-tag-item">
                    <Code size={12} />
                    <span>Frontend Engineering</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="profile-stats-grid">
              <div className="stat-card">
                <span className="stat-number">5</span>
                <span className="stat-label">Team Members</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{teamExperiences.length || 5}</span>
                <span className="stat-label">Experiences Shared</span>
              </div>
              <div className="stat-card helpful-stat">
                <span className="stat-number">
                  <ThumbsUp size={15} />
                  4,210
                </span>
                <span className="stat-label">People Helped</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">1,540</span>
                <span className="stat-label">Community Learners</span>
              </div>
            </div>
          </section>

          {/* Team Tabs */}
          <div className="profile-tabs-bar">
            <button
              type="button"
              className={`profile-tab-item ${teamTab === 'about' ? 'active' : ''}`}
              onClick={() => setTeamTab('about')}
            >
              <Info size={15} />
              <span>About the Team</span>
            </button>

            <button
              type="button"
              className={`profile-tab-item ${teamTab === 'members' ? 'active' : ''}`}
              onClick={() => setTeamTab('members')}
            >
              <Users size={15} />
              <span>Team Members (5)</span>
            </button>

            <button
              type="button"
              className={`profile-tab-item ${teamTab === 'project' ? 'active' : ''}`}
              onClick={() => setTeamTab('project')}
            >
              <Compass size={15} />
              <span>Our Project</span>
            </button>

            <button
              type="button"
              className={`profile-tab-item ${teamTab === 'experiences' ? 'active' : ''}`}
              onClick={() => setTeamTab('experiences')}
            >
              <BookOpen size={15} />
              <span>Experiences Shared</span>
            </button>

            <button
              type="button"
              className={`profile-tab-item ${teamTab === 'community' ? 'active' : ''}`}
              onClick={() => setTeamTab('community')}
            >
              <Layers size={15} />
              <span>Community</span>
            </button>
          </div>

          {/* Team Tab Content */}
          <div className="profile-tab-content">
            {/* Tab: About the Team */}
            {teamTab === 'about' && (
              <div className="team-about-panel">
                <div className="about-section-box highlight-box">
                  <div className="about-header-row">
                    <Sparkles size={18} className="about-icon text-brand" />
                    <h3>About Lived</h3>
                  </div>
                  <p className="team-about-lead">
                    "Lived is a team-built experience-sharing platform designed to help people learn
                    from real stories, practical experiences and useful ideas shared by others."
                  </p>
                </div>

                <div className="about-section-box">
                  <div className="about-header-row">
                    <Compass size={18} className="about-icon" />
                    <h3>Why We Built This</h3>
                  </div>
                  <p className="about-body-text">
                    Modern social media is dominated by curated highlight reels, sponsored flexing,
                    and noise. When someone attempts a new career move, starts coding, deals with
                    burnout, or launches their first venture, they rarely need another generic motivational
                    quote. They need the unvarnished reality: what failed, how much money was lost,
                    and the specific steps that finally worked.
                  </p>
                </div>

                <div className="about-section-box">
                  <div className="about-header-row">
                    <CheckCircle2 size={18} className="about-icon text-accent" />
                    <h3>The Core Philosophy</h3>
                  </div>
                  <div className="philosophy-steps-list">
                    <div className="phi-item">
                      <span className="phi-num">01</span>
                      <div>
                        <strong>Simple to Share:</strong> Anyone can post a real takeaway in under
                        one minute without mandatory multi-step questionnaires.
                      </div>
                    </div>
                    <div className="phi-item">
                      <span className="phi-num">02</span>
                      <div>
                        <strong>Easy to Discover:</strong> Curated categories, practical video
                        breakdowns, and concept guides make high-yield lessons effortless to find.
                      </div>
                    </div>
                    <div className="phi-item">
                      <span className="phi-num">03</span>
                      <div>
                        <strong>Valuable to Learn:</strong> Focused editorial reading experience
                        with actionable takeaways and community helpfulness ratings.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Team Members */}
            {teamTab === 'members' && (
              <div className="team-members-panel">
                <div className="team-members-intro">
                  <h3>Project Contributors</h3>
                  <p>
                    Clean member cards ready to be updated with our actual team members as the project
                    progresses.
                  </p>
                </div>

                <div className="team-members-grid">
                  {TEAM_MEMBERS.map((member) => (
                    <div key={member.id} className="team-member-card">
                      <div className="member-avatar-badge">
                        <span>{member.initials}</span>
                      </div>
                      <div className="member-info">
                        <h4 className="member-name">{member.name}</h4>
                        <span className="member-role">{member.role}</span>
                        <p className="member-bio">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Our Project */}
            {teamTab === 'project' && (
              <div className="team-project-panel">
                <div className="about-section-box">
                  <div className="about-header-row">
                    <Code size={18} className="about-icon text-brand" />
                    <h3>Project Architecture & Technology Stack</h3>
                  </div>
                  <div className="project-specs-grid">
                    <div className="spec-card">
                      <span className="spec-label">Core Frontend</span>
                      <strong className="spec-value">React 19 + TypeScript + Vite</strong>
                    </div>
                    <div className="spec-card">
                      <span className="spec-label">Design System</span>
                      <strong className="spec-value">Vanilla CSS (Custom Lived Tokens)</strong>
                    </div>
                    <div className="spec-card">
                      <span className="spec-label">Architecture</span>
                      <strong className="spec-value">API-Ready Clean Abstractions</strong>
                    </div>
                    <div className="spec-card">
                      <span className="spec-label">Target Loop</span>
                      <strong className="spec-value">Experience → Share → Discover → Learn</strong>
                    </div>
                  </div>
                </div>

                <div className="about-section-box">
                  <div className="about-header-row">
                    <Layers size={18} className="about-icon" />
                    <h3>Backend Integration Readiness</h3>
                  </div>
                  <p className="about-body-text">
                    This frontend is structured with clean, typed API client interfaces for
                    Authentication, Experiences, Videos, Comments, and Categories. The backend team
                    can replace the mock providers by specifying <code>VITE_API_URL</code> without
                    altering any component logic.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Experiences Shared */}
            {teamTab === 'experiences' && (
              <div className="team-experiences-panel">
                <div className="cards-feed-grid">
                  {experiences.slice(0, 5).map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Community */}
            {teamTab === 'community' && (
              <div className="team-community-panel">
                <div className="about-section-box">
                  <div className="about-header-row">
                    <Users size={18} className="about-icon text-brand" />
                    <h3>Lived Community Standards</h3>
                  </div>
                  <blockquote className="community-creed">
                    "We do not post highlight reels. We post candid mistakes, unvarnished numbers,
                    and hard-won lessons so the next person climbs higher, faster."
                  </blockquote>
                  <div className="community-rules-list">
                    <div className="c-rule-item">
                      <strong>1. Real & Verifiable:</strong> Share only what you have genuinely lived
                      through.
                    </div>
                    <div className="c-rule-item">
                      <strong>2. Constructive Lessons:</strong> Focus on what you would do
                      differently so others can avoid the same pitfall.
                    </div>
                    <div className="c-rule-item">
                      <strong>3. Respectful Mentorship:</strong> Every question deserves a
                      supportive, practical answer.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. INDIVIDUAL USER PROFILE (For Real Registered Users)                 */}
      {/* ==================================================================== */}
      {profileViewMode === 'user' && (
        <div className="user-profile-section">
          {isAuthenticated ? (
            <>
              {/* Registered User Header */}
              <section className="profile-header-card">
                <div className="profile-hero-row">
                  <div className="profile-avatar-wrapper">
                    <img src={user.avatar} alt={user.name} className="profile-large-avatar" />
                  </div>

                  <div className="profile-meta-main">
                    <div className="profile-name-action-row">
                      <div>
                        <h1 className="profile-user-name">{user.name}</h1>
                        <span className="profile-user-handle">@{user.username}</span>
                      </div>

                      <div className="profile-action-btns-row">
                        <button
                          type="button"
                          className="btn-secondary edit-profile-btn"
                          onClick={() => {
                            setEditName(user.name);
                            setEditUsername(user.username);
                            setEditBio(user.bio);
                            setEditRole(user.role || '');
                            setEditLocation(user.location || '');
                            setEditAvatar(user.avatar);
                            setEditInterests(user.interests);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Edit Profile</span>
                        </button>

                        <button
                          type="button"
                          className="btn-secondary logout-btn"
                          onClick={logoutUser}
                          title="Log Out"
                        >
                          <LogOut size={14} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>

                    <p className="profile-bio-text">{user.bio}</p>

                    <div className="profile-tags-row">
                      {user.role && (
                        <span className="profile-tag-item">
                          <Briefcase size={12} />
                          <span>{user.role}</span>
                        </span>
                      )}
                      {user.location && (
                        <span className="profile-tag-item">
                          <MapPin size={12} />
                          <span>{user.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="profile-stats-grid">
                  <div className="stat-card">
                    <span className="stat-number">{myExperiences.length}</span>
                    <span className="stat-label">Experiences Shared</span>
                  </div>
                  <div className="stat-card helpful-stat">
                    <span className="stat-number">
                      <ThumbsUp size={15} />
                      {user.helpfulCount}
                    </span>
                    <span className="stat-label">People Helped</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{user.followersCount}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{savedExperiences.length}</span>
                    <span className="stat-label">Saved</span>
                  </div>
                </div>
              </section>

              {/* User Tabs */}
              <div className="profile-tabs-bar">
                <button
                  type="button"
                  className={`profile-tab-item ${userTab === 'experiences' ? 'active' : ''}`}
                  onClick={() => setUserTab('experiences')}
                >
                  <BookOpen size={16} />
                  <span>My Experiences ({myExperiences.length})</span>
                </button>

                <button
                  type="button"
                  className={`profile-tab-item ${userTab === 'saved' ? 'active' : ''}`}
                  onClick={() => setUserTab('saved')}
                >
                  <Bookmark size={16} />
                  <span>Saved ({savedExperiences.length})</span>
                </button>

                <button
                  type="button"
                  className={`profile-tab-item ${userTab === 'about' ? 'active' : ''}`}
                  onClick={() => setUserTab('about')}
                >
                  <Info size={16} />
                  <span>About & Interests</span>
                </button>
              </div>

              {/* User Tab Content */}
              <div className="profile-tab-content">
                {userTab === 'experiences' && (
                  <div className="profile-stream">
                    {myExperiences.length > 0 ? (
                      <div className="cards-feed-grid">
                        {myExperiences.map((exp) => (
                          <ExperienceCard key={exp.id} experience={exp} />
                        ))}
                      </div>
                    ) : (
                      <div className="profile-empty-experiences">
                        <Sparkles size={32} className="empty-sparkle-icon" />
                        <h3>Share your first real experience</h3>
                        <p>
                          Every mistake you solved or transition you survived can save months for someone
                          walking in your footsteps.
                        </p>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => setActiveTab('create')}
                        >
                          Share Experience
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {userTab === 'saved' && (
                  <div className="profile-stream">
                    {savedExperiences.length > 0 ? (
                      <div className="cards-feed-grid">
                        {savedExperiences.map((exp) => (
                          <ExperienceCard key={exp.id} experience={exp} />
                        ))}
                      </div>
                    ) : (
                      <div className="profile-empty-experiences">
                        <Bookmark size={32} />
                        <h3>No saved experiences yet</h3>
                        <p>Explore stories and bookmark lessons you want to refer back to.</p>
                      </div>
                    )}
                  </div>
                )}

                {userTab === 'about' && (
                  <div className="profile-about-panel">
                    <div className="about-section-box">
                      <div className="about-header-row">
                        <Layers size={18} className="about-icon" />
                        <h3>My Interests</h3>
                      </div>
                      <div className="about-interests-chips">
                        {user.interests.map((cat) => (
                          <span key={cat} className="about-interest-pill">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest State: Prompt to Login or Register */
            <div className="guest-profile-cta-card">
              <div className="guest-cta-icon-box">
                <UserCheck size={36} />
              </div>
              <h2>Create Your Learner Profile</h2>
              <p>
                Sign in or register to publish your real experiences, save actionable lessons,
                and track how many people your lessons have helped.
              </p>
              <div className="guest-cta-buttons">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => openAuthModal('register')}
                >
                  <UserCheck size={16} />
                  <span>Register Free</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openAuthModal('login')}
                >
                  <LogIn size={16} />
                  <span>Log In</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSaveProfile} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="edit-name">Display Name</label>
            <input
              id="edit-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-username">Username</label>
            <input
              id="edit-username"
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="text-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-role">Headline / Role</label>
            <input
              id="edit-role"
              type="text"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              placeholder="e.g. Frontend Developer, Founder, Student"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-location">Location</label>
            <input
              id="edit-location"
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="e.g. San Francisco, Remote, London"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-bio">Bio</label>
            <textarea
              id="edit-bio"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="textarea-input"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Interests</label>
            <div className="interests-checkbox-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`interest-select-pill ${
                    editInterests.includes(cat.id) ? 'selected' : ''
                  }`}
                  onClick={() => toggleInterest(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
