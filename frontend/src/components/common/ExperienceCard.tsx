import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Experience } from '../../types';
import {
  Clock,
  ThumbsUp,
  Bookmark,
  Video,
  FileText,
  BookOpen,
} from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const { openExperience, toggleSave } = useApp();

  const getTypeLabel = () => {
    switch (experience.contentType) {
      case 'video':
        return { label: 'Video', icon: <Video size={12} /> };
      case 'pdf':
        return { label: 'PDF', icon: <FileText size={12} /> };
      default:
        return { label: 'Story', icon: <BookOpen size={12} /> };
    }
  };

  const typeInfo = getTypeLabel();

  const handleCardClick = () => {
    openExperience(experience.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(experience.id);
  };

  return (
    <article
      className="clean-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
    >
      {/* Top Author & Tags Bar */}
      <div className="clean-card-meta">
        <div className="clean-author-cell">
          <img
            src={experience.author.avatar}
            alt={experience.author.name}
            className="clean-card-avatar"
            loading="lazy"
          />
          <span className="clean-card-author-name">{experience.author.name}</span>
        </div>

        <div className="clean-card-tags">
          <span className="clean-category-pill">{experience.category}</span>
          <span className="clean-type-pill">
            {typeInfo.icon}
            <span>{typeInfo.label}</span>
          </span>
        </div>
      </div>

      {/* Main Title & Preview */}
      <div className="clean-card-content">
        <h3 className="clean-card-title">{experience.title}</h3>
        <p className="clean-card-preview">{experience.description}</p>
      </div>

      {/* Footer Metrics (Read time, Helpful, Save) */}
      <div className="clean-card-footer">
        <div className="clean-footer-left">
          <div className="clean-metric-item">
            <Clock size={13} />
            <span>
              {experience.contentType === 'video'
                ? `${experience.readTimeMinutes} min watch`
                : `${experience.readTimeMinutes} min read`}
            </span>
          </div>

          <div
            className={`clean-metric-item helpful ${
              experience.userHelpfulVote === 'yes' ? 'voted' : ''
            }`}
          >
            <ThumbsUp size={13} />
            <span>{experience.helpfulCount} helpful</span>
          </div>
        </div>

        <div className="clean-footer-right">
          <button
            type="button"
            className={`clean-save-icon-btn ${experience.isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            title={experience.isSaved ? 'Saved' : 'Save experience'}
            aria-label={experience.isSaved ? 'Saved' : 'Save experience'}
          >
            <Bookmark size={15} fill={experience.isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
};
