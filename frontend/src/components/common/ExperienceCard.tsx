import React from 'react';
import type { Experience } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  ThumbsUp,
  Heart,
  MessageSquare,
  Bookmark,
  Video,
  FileText,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
  featured?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  featured = false,
}) => {
  const { openExperience, toggleLike, toggleSave } = useApp();

  const getTypeIcon = () => {
    switch (experience.contentType) {
      case 'video':
        return <Video size={13} />;
      case 'pdf':
        return <FileText size={13} />;
      case 'guide':
        return <Sparkles size={13} />;
      default:
        return <BookOpen size={13} />;
    }
  };

  const handleCardClick = () => {
    openExperience(experience.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(experience.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(experience.id);
  };

  return (
    <article
      className={`experience-card ${featured ? 'featured' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
    >
      {/* Top Metadata: Author & Category */}
      <div className="card-top-meta">
        <div className="card-author-info">
          <img
            src={experience.author.avatar}
            alt={experience.author.name}
            className="card-author-avatar"
            loading="lazy"
          />
          <div className="card-author-text">
            <span className="card-author-name">{experience.author.name}</span>
            <span className="card-author-role">
              {experience.author.role || `@${experience.author.username}`}
            </span>
          </div>
        </div>

        <div className="card-badges">
          <span className={`badge-type ${experience.contentType}`}>
            {getTypeIcon()}
            <span>
              {experience.contentType === 'video'
                ? 'Video'
                : experience.contentType === 'pdf'
                ? 'PDF Guide'
                : experience.contentType === 'guide'
                ? 'Framework'
                : 'Story'}
            </span>
          </span>
          <span className="badge-category">{experience.category}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="card-body">
        <h3 className="card-title">{experience.title}</h3>
        <p className="card-description">{experience.description}</p>
      </div>

      {/* Lessons Preview Pills */}
      {experience.lessons && experience.lessons.length > 0 && (
        <div className="card-lessons-preview">
          <span className="lessons-count-tag">
            <strong>{experience.lessons.length}</strong> Key Lessons
          </span>
          <span className="card-lesson-sample-title">
            "01 {experience.lessons[0].title}"
          </span>
        </div>
      )}

      {/* Card Footer: Metrics & Actions */}
      <div className="card-footer">
        <div className="card-footer-left">
          <div className="card-metric read-time">
            <Clock size={13} />
            <span>
              {experience.contentType === 'video'
                ? `${experience.readTimeMinutes} min watch`
                : `${experience.readTimeMinutes} min read`}
            </span>
          </div>

          <div
            className={`card-metric helpful ${
              experience.userHelpfulVote === 'yes' ? 'voted' : ''
            }`}
            title="People who found this experience directly helpful"
          >
            <ThumbsUp size={13} />
            <span>{experience.helpfulCount} helpful</span>
          </div>
        </div>

        <div className="card-footer-right">
          <button
            type="button"
            className={`card-action-btn like ${experience.isLiked ? 'active' : ''}`}
            onClick={handleLike}
            aria-label="Like experience"
          >
            <Heart size={15} fill={experience.isLiked ? 'currentColor' : 'none'} />
            <span className="action-count">{experience.likesCount}</span>
          </button>

          <div className="card-action-stat comments">
            <MessageSquare size={15} />
            <span className="action-count">{experience.commentsCount}</span>
          </div>

          <button
            type="button"
            className={`card-action-btn save ${experience.isSaved ? 'active' : ''}`}
            onClick={handleSave}
            aria-label={experience.isSaved ? 'Unsave experience' : 'Save experience'}
          >
            <Bookmark size={15} fill={experience.isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
};
