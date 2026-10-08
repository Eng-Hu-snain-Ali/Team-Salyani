import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { EmptyState } from '../../components/common/EmptyState';
import type { ContentType } from '../../types';
import { Bookmark, BookOpen, Video, FileText, Layers } from 'lucide-react';

export const SavedView: React.FC = () => {
  const { savedExperiences, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<ContentType | 'All'>('All');

  const filtered = savedExperiences.filter((item) => {
    if (filterType === 'All') return true;
    return item.contentType === filterType;
  });

  const tabs: Array<{ id: ContentType | 'All'; label: string; icon: React.ReactNode }> = [
    { id: 'All', label: 'All Saved', icon: <Layers size={14} /> },
    { id: 'story', label: 'Stories', icon: <BookOpen size={14} /> },
    { id: 'video', label: 'Videos', icon: <Video size={14} /> },
    { id: 'pdf', label: 'PDFs', icon: <FileText size={14} /> },
  ];

  return (
    <div className="saved-view-container">
      {/* Header */}
      <div className="saved-header-box">
        <div className="saved-title-row">
          <div className="saved-icon-badge">
            <Bookmark size={22} />
          </div>
          <div>
            <h1 className="saved-page-title">Saved Experiences</h1>
            <p className="saved-page-desc">
              Your personal library of hard-won wisdom, frameworks, and practical lessons.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="saved-tabs-row">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`saved-tab-btn ${filterType === tab.id ? 'active' : ''}`}
              onClick={() => setFilterType(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="tab-count-pill">
                {savedExperiences.filter((e) =>
                  tab.id === 'All' ? true : e.contentType === tab.id
                ).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Stream */}
      <div className="saved-content-stream">
        {filtered.length > 0 ? (
          <div className="cards-feed-grid">
            {filtered.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark size={32} />}
            title="No saved experiences in this category"
            description="When you find an experience with valuable lessons, tap the bookmark icon to save it for your next challenge."
            actionLabel="Discover Experiences"
            onAction={() => setActiveTab('explore')}
          />
        )}
      </div>
    </div>
  );
};
