import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LessonCard } from '../../components/common/LessonCard';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { CommentsSection } from '../comments/CommentsSection';
import { experienceService, userService } from '../../services/api';
import type { Experience } from '../../types';
import {
  ArrowLeft,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bookmark,
  Share2,
  Check,
  UserPlus,
} from 'lucide-react';

export const ExperienceDetailView: React.FC = () => {
  const {
    selectedExperienceId,
    goBack,
    toggleLike,
    toggleSave,
    markHelpful,
    showToast,
  } = useApp();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [related, setRelated] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!selectedExperienceId) return;

    const loadExperience = async () => {
      try {
        setLoading(true);
        const res = await experienceService.getExperienceById(selectedExperienceId);
        if (res.data) {
          setExperience(res.data);
          const allRes = await experienceService.getExperiences({
            category: res.data.category,
          });
          if (allRes.data) {
            setRelated(allRes.data.filter((e) => e.id !== res.data.id).slice(0, 2));
          }
        }
      } catch {
        showToast('Could not load experience', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedExperienceId, showToast]);

  if (loading || !experience) {
    return (
      <div className="reading-loading-box">
        <p>Loading experience...</p>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: experience.title,
          text: `Read this real experience on Lived: ${experience.title}`,
          url,
        });
        return;
      } catch {
        // Fallback
      }
    }
    navigator.clipboard?.writeText(url);
    showToast('Link copied to clipboard.', 'success');
  };

  const handleToggleFollow = async () => {
    await userService.toggleFollow(experience.author.id);
    setIsFollowing(!isFollowing);
    showToast(
      isFollowing ? `Unfollowed @${experience.author.username}` : `Following @${experience.author.username}`,
      'info'
    );
  };

  const hasStructuredSections = Boolean(
    experience.story.whereIStarted ||
    experience.story.theProblem ||
    experience.story.whatFailed ||
    experience.story.whatWorked
  );

  return (
    <article className="clean-reading-page">
      {/* Top Simple Back Nav */}
      <div className="clean-nav-row">
        <button type="button" className="clean-back-btn" onClick={goBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Header Block: Content Type, Title, Author, Category */}
      <header className="clean-reading-header">
        <div className="clean-meta-tags">
          <span className="clean-type-badge">
            {experience.contentType === 'video'
              ? 'VIDEO • External Source: YouTube'
              : experience.contentType === 'pdf'
              ? 'PDF GUIDE'
              : experience.contentType === 'guide'
              ? 'ACTIONABLE GUIDE'
              : 'WRITTEN EXPERIENCE'}
          </span>
          <span className="clean-category-tag">{experience.category}</span>
          <span className="clean-readtime-tag">
            <Clock size={12} />
            <span>
              {experience.readTimeMinutes}{' '}
              {experience.contentType === 'video' ? 'min watch' : 'min read'}
            </span>
          </span>
        </div>

        <h1 className="clean-story-title">{experience.title}</h1>

        <div className="clean-author-bar">
          <img
            src={experience.author.avatar}
            alt={experience.author.name}
            className="clean-author-avatar"
          />
          <div className="clean-author-info">
            <span className="clean-author-name">{experience.author.name}</span>
            <span className="clean-author-role">
              {experience.author.role || `@${experience.author.username}`}
            </span>
          </div>

          <button
            type="button"
            className={`clean-follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleToggleFollow}
          >
            {isFollowing ? <Check size={13} /> : <UserPlus size={13} />}
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        </div>
      </header>

      {/* Main Distraction-Free Story Content */}
      <div className="clean-story-body">
        {/* Simple single text story */}
        {experience.story.content && (
          <div className="story-paragraphs">
            {experience.story.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* Structured story sections if present */}
        {hasStructuredSections && (
          <div className="story-structured-flow">
            {experience.story.whereIStarted && (
              <div className="story-chapter">
                <h3>Where I Started</h3>
                <p>{experience.story.whereIStarted}</p>
              </div>
            )}

            {experience.story.theProblem && (
              <div className="story-chapter">
                <h3>The Roadblock & Problem</h3>
                <p>{experience.story.theProblem}</p>
              </div>
            )}

            {experience.story.whatITried && (
              <div className="story-chapter">
                <h3>What I Tried</h3>
                <p>{experience.story.whatITried}</p>
              </div>
            )}

            {experience.story.whatFailed && (
              <div className="story-chapter">
                <h3>What Failed</h3>
                <p>{experience.story.whatFailed}</p>
              </div>
            )}

            {experience.story.whatWorked && (
              <div className="story-chapter">
                <h3>What Actually Worked</h3>
                <p>{experience.story.whatWorked}</p>
              </div>
            )}

            {experience.story.whatILearned && (
              <div className="story-chapter">
                <h3>What I Learned</h3>
                <p>{experience.story.whatILearned}</p>
              </div>
            )}

            {experience.story.whatIWouldDoDifferently && (
              <div className="story-chapter">
                <h3>What I Would Do Differently</h3>
                <p>{experience.story.whatIWouldDoDifferently}</p>
              </div>
            )}
          </div>
        )}

        {/* Key Lessons if present */}
        {experience.lessons && experience.lessons.length > 0 && (
          <section className="clean-lessons-section">
            <h3 className="clean-section-heading">Key Lessons</h3>
            <div className="clean-lessons-grid">
              {experience.lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} showActionStep={true} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Was this helpful? Section */}
      <section className="clean-helpful-box">
        <h4 className="helpful-question">Was this helpful?</h4>
        <div className="helpful-buttons">
          <button
            type="button"
            className={`btn-helpful-clean yes ${
              experience.userHelpfulVote === 'yes' ? 'voted' : ''
            }`}
            onClick={() => markHelpful(experience.id, 'yes')}
          >
            <ThumbsUp size={15} />
            <span>Yes, it helped ({experience.helpfulCount})</span>
          </button>

          <button
            type="button"
            className={`btn-helpful-clean no ${
              experience.userHelpfulVote === 'no' ? 'voted' : ''
            }`}
            onClick={() => markHelpful(experience.id, 'no')}
          >
            <ThumbsDown size={15} />
            <span>Not really</span>
          </button>
        </div>
      </section>

      {/* Social Action Bar (Like, Comment, Save, Share) */}
      <div className="clean-actions-toolbar">
        <button
          type="button"
          className={`clean-action-pill ${experience.isLiked ? 'liked' : ''}`}
          onClick={() => toggleLike(experience.id)}
        >
          <Heart size={16} fill={experience.isLiked ? 'currentColor' : 'none'} />
          <span>{experience.likesCount} Like</span>
        </button>

        <button
          type="button"
          className={`clean-action-pill ${experience.isSaved ? 'saved' : ''}`}
          onClick={() => toggleSave(experience.id)}
        >
          <Bookmark size={16} fill={experience.isSaved ? 'currentColor' : 'none'} />
          <span>{experience.isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button type="button" className="clean-action-pill" onClick={handleShare}>
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Threaded Discussion */}
      <CommentsSection experienceId={experience.id} />

      {/* Related Experiences */}
      {related.length > 0 && (
        <section className="clean-related-section">
          <h3 className="clean-section-heading">More in {experience.category}</h3>
          <div className="cards-feed-grid">
            {related.map((rel) => (
              <ExperienceCard key={rel.id} experience={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
