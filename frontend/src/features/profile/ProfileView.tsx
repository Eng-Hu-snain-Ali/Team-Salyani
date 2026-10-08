import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { Modal } from '../../components/common/Modal';
import { CATEGORIES } from '../../constants';
import type { ExperienceCategory } from '../../types';
import {
  Edit3,
  Bookmark,
  BookOpen,
  Info,
  ThumbsUp,
  Users,
  Target,
  Sparkles,
  MapPin,
  Briefcase,
  Layers,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUser, experiences, savedExperiences, setActiveTab } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'experiences' | 'saved' | 'about'>('experiences');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editBio, setEditBio] = useState(user.bio);
  const [editRole, setEditRole] = useState(user.role || '');
  const [editLocation, setEditLocation] = useState(user.location || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [editInterests, setEditInterests] = useState<ExperienceCategory[]>(user.interests);

  const myExperiences = experiences.filter((e) => e.author.id === user.id);

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

  return (
    <div className="profile-view-container">
      {/* Profile Header Card */}
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
            <span className="stat-number">{myExperiences.length || user.experiencesCount}</span>
            <span className="stat-label">Experiences Shared</span>
          </div>
          <div className="stat-card helpful-stat">
            <span className="stat-number">
              <ThumbsUp size={16} />
              {user.helpfulCount}
            </span>
            <span className="stat-label">People Helped</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{user.followersCount}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{user.followingCount}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="profile-tabs-bar">
        <button
          type="button"
          className={`profile-tab-item ${activeTab === 'experiences' ? 'active' : ''}`}
          onClick={() => setActiveTabLocal('experiences')}
        >
          <BookOpen size={16} />
          <span>My Experiences ({myExperiences.length})</span>
        </button>

        <button
          type="button"
          className={`profile-tab-item ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTabLocal('saved')}
        >
          <Bookmark size={16} />
          <span>Saved ({savedExperiences.length})</span>
        </button>

        <button
          type="button"
          className={`profile-tab-item ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTabLocal('about')}
        >
          <Info size={16} />
          <span>About & Growth Goals</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="profile-tab-content">
        {/* Panel 1: My Experiences */}
        {activeTab === 'experiences' && (
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
                  Share an Experience
                </button>
              </div>
            )}
          </div>
        )}

        {/* Panel 2: Saved */}
        {activeTab === 'saved' && (
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

        {/* Panel 3: About & Goals */}
        {activeTab === 'about' && (
          <div className="profile-about-panel">
            <div className="about-section-box">
              <div className="about-header-row">
                <Target size={18} className="about-icon" />
                <h3>Current Learning & Growth Goal</h3>
              </div>
              <p className="about-goal-text">
                {user.currentGoal || 'Developing practical business and career intuition.'}
              </p>
            </div>

            <div className="about-section-box">
              <div className="about-header-row">
                <Layers size={18} className="about-icon" />
                <h3>Topics of Interest</h3>
              </div>
              <div className="about-interests-chips">
                {user.interests.map((cat) => (
                  <span key={cat} className="about-interest-pill">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="about-section-box">
              <div className="about-header-row">
                <Users size={18} className="about-icon" />
                <h3>LifeLore Community Creed</h3>
              </div>
              <blockquote className="community-creed">
                "We don't post highlight reels. We post candid mistakes, unvarnished numbers, and
                hard-won lessons so the next person climbs higher, faster."
              </blockquote>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        subtitle="Update your public profile and topics of interest"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="edit-profile-form">
          <div className="form-group">
            <label className="input-field-label">Full Name</label>
            <input
              type="text"
              className="form-text-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>

          <div className="form-row-two-col">
            <div className="form-group">
              <label className="input-field-label">Username</label>
              <input
                type="text"
                className="form-text-input"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-field-label">Role / Headline</label>
              <input
                type="text"
                className="form-text-input"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                placeholder="e.g. Frontend Engineer"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-field-label">Bio</label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell others what you've learned and what you're working on..."
            />
          </div>

          <div className="form-group">
            <label className="input-field-label">Avatar Image URL</label>
            <input
              type="url"
              className="form-text-input"
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="input-field-label">Topics of Interest</label>
            <div className="interests-selection-grid">
              {CATEGORIES.map((cat) => {
                const isSelected = editInterests.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`interest-select-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleInterest(cat.id)}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="modal-buttons-row">
            <button
              type="button"
              className="btn-ghost"
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
