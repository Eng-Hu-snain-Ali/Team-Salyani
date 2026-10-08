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
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Compass,
  UserPlus,
  Check,
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

          // Load related experiences by category
          const allRes = await experienceService.getExperiences({
            category: res.data.category,
          });
          if (allRes.data) {
            setRelated(allRes.data.filter((e) => e.id !== res.data.id).slice(0, 2));
          }
        }
      } catch {
        showToast('Could not load experience details', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedExperienceId, showToast]);

  if (loading || !experience) {
    return (
      <div className="experience-detail-loading-container">
        <div className="detail-loading-spinner" />
        <p>Loading real experience narrative...</p>
      </div>
    );
  }

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: experience.title,
          text: `Read real lessons from "${experience.title}" on LifeLore:`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard?.writeText(shareUrl);
    showToast('Link copied to clipboard!', 'success');
  };

  const handleToggleFollow = async () => {
    await userService.toggleFollow(experience.author.id);
    setIsFollowing((prev) => !prev);
    showToast(
      isFollowing
        ? `Unfollowed @${experience.author.username}`
        : `Following @${experience.author.username}`,
      'info'
    );
  };

  return (
    <article className="experience-detail-page">
      {/* Top Floating Back & Action Bar */}
      <nav className="detail-top-nav">
        <button
          type="button"
          className="detail-back-btn"
          onClick={goBack}
          aria-label="Back to previous screen"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="detail-top-actions">
          <button
            type="button"
            className={`detail-action-icon-btn ${experience.isLiked ? 'active' : ''}`}
            onClick={() => toggleLike(experience.id)}
            title="Like story"
            aria-label="Like story"
          >
            <Heart size={18} fill={experience.isLiked ? 'currentColor' : 'none'} />
            <span className="btn-count">{experience.likesCount}</span>
          </button>

          <button
            type="button"
            className={`detail-action-icon-btn ${experience.isSaved ? 'active' : ''}`}
            onClick={() => toggleSave(experience.id)}
            title="Save for later"
            aria-label="Save for later"
          >
            <Bookmark size={18} fill={experience.isSaved ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            className="detail-action-icon-btn"
            onClick={handleShare}
            title="Share experience"
            aria-label="Share experience"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="detail-header-block">
        <div className="detail-tags-row">
          <span className="detail-category-tag">{experience.category}</span>
          <span className="detail-format-tag">
            <BookOpen size={13} />
            <span>Structured Story</span>
          </span>
          <span className="detail-readtime-tag">
            <Clock size={13} />
            <span>{experience.readTimeMinutes} min read</span>
          </span>
        </div>

        <h1 className="detail-title">{experience.title}</h1>
        <p className="detail-lead-summary">{experience.description}</p>

        {/* Author Bio Banner */}
        <div className="detail-author-box">
          <img
            src={experience.author.avatar}
            alt={experience.author.name}
            className="detail-author-avatar"
          />
          <div className="detail-author-details">
            <div className="detail-author-name-row">
              <span className="detail-author-name">{experience.author.name}</span>
              <span className="detail-author-handle">@{experience.author.username}</span>
            </div>
            <p className="detail-author-bio">
              {experience.author.bio || experience.author.role || 'Contributor on LifeLore'}
            </p>
          </div>
          <button
            type="button"
            className={`btn-follow-author ${isFollowing ? 'following' : ''}`}
            onClick={handleToggleFollow}
          >
            {isFollowing ? (
              <>
                <Check size={14} />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus size={14} />
                <span>Follow</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Structured Long-Form Reading Content */}
      <main className="detail-reading-layout">
        {/* Section: Where I Started */}
        {experience.story.whereIStarted && (
          <section className="story-section">
            <div className="story-section-header">
              <span className="story-step-indicator">Step 01</span>
              <h2 className="story-section-title">Where I Started</h2>
            </div>
            <div className="story-body-text">
              <p>{experience.story.whereIStarted}</p>
            </div>
          </section>
        )}

        {/* Section: The Problem */}
        {experience.story.theProblem && (
          <section className="story-section problem-highlight">
            <div className="story-section-header">
              <span className="story-step-indicator problem">Step 02</span>
              <h2 className="story-section-title">The Problem & Unexpected Trap</h2>
            </div>
            <div className="story-body-text">
              <p>{experience.story.theProblem}</p>
            </div>
          </section>
        )}

        {/* Section: What I Tried */}
        {experience.story.whatITried && (
          <section className="story-section">
            <div className="story-section-header">
              <span className="story-step-indicator">Step 03</span>
              <h2 className="story-section-title">What I Tried Initially</h2>
            </div>
            <div className="story-body-text">
              <p>{experience.story.whatITried}</p>
            </div>
          </section>
        )}

        {/* Section: What Failed */}
        {experience.story.whatFailed && (
          <section className="story-section failure-box">
            <div className="story-section-header">
              <AlertTriangle size={18} className="failure-icon" />
              <h2 className="story-section-title">What Failed (The Mistakes)</h2>
            </div>
            <div className="story-body-text">
              <p>{experience.story.whatFailed}</p>
            </div>
          </section>
        )}

        {/* Section: What Worked */}
        {experience.story.whatWorked && (
          <section className="story-section success-box">
            <div className="story-section-header">
              <CheckCircle size={18} className="success-icon" />
              <h2 className="story-section-title">What Actually Worked (The Breakthrough)</h2>
            </div>
            <div className="story-body-text">
              <p>{experience.story.whatWorked}</p>
            </div>
          </section>
        )}

        {/* Section: What I Learned */}
        {experience.story.whatILearned && (
          <section className="story-section">
            <div className="story-section-header">
              <Lightbulb size={18} className="insight-icon" />
              <h2 className="story-section-title">What I Learned</h2>
            </div>
            <div className="story-body-text">
              <p>{experience.story.whatILearned}</p>
            </div>
          </section>
        )}

        {/* Section: What I Would Do Differently */}
        {experience.story.whatIWouldDoDifferently && (
          <section className="story-section differently-box">
            <div className="story-section-header">
              <Compass size={18} className="differently-icon" />
              <h2 className="story-section-title">What I Would Do Differently Today</h2>
            </div>
            <div className="story-body-text">
              <p>{experience.story.whatIWouldDoDifferently}</p>
            </div>
          </section>
        )}

        {/* Key Lessons Section (Numbered Cards 01, 02, 03) */}
        <section className="detail-key-lessons-block">
          <div className="key-lessons-header">
            <span className="lessons-badge">Core Takeaways</span>
            <h2 className="key-lessons-title">Key Lessons</h2>
            <p className="key-lessons-desc">
              Direct, actionable principles you can apply right away to avoid repeating this hurdle.
            </p>
          </div>

          <div className="key-lessons-list">
            {experience.lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} showActionStep={true} />
            ))}
          </div>
        </section>

        {/* "Was this experience helpful?" Feedback Section */}
        <section className="helpful-feedback-section">
          <div className="feedback-card">
            <h3 className="feedback-title">Was this experience helpful?</h3>
            <p className="feedback-desc">
              Your feedback trains our recommendation engine and supports genuine experience sharing.
            </p>

            <div className="feedback-buttons-row">
              <button
                type="button"
                className={`btn-helpful yes ${
                  experience.userHelpfulVote === 'yes' ? 'voted' : ''
                }`}
                onClick={() => markHelpful(experience.id, 'yes')}
              >
                <ThumbsUp size={16} />
                <span>Yes, it helped ({experience.helpfulCount})</span>
              </button>

              <button
                type="button"
                className={`btn-helpful no ${
                  experience.userHelpfulVote === 'no' ? 'voted' : ''
                }`}
                onClick={() => markHelpful(experience.id, 'no')}
              >
                <ThumbsDown size={16} />
                <span>Not really</span>
              </button>
            </div>
          </div>
        </section>

        {/* Threaded Discussion Section */}
        <CommentsSection experienceId={experience.id} />

        {/* Related Experiences */}
        {related.length > 0 && (
          <section className="related-experiences-section">
            <h3 className="related-heading">Related Experiences in {experience.category}</h3>
            <div className="cards-feed-grid">
              {related.map((rel) => (
                <ExperienceCard key={rel.id} experience={rel} />
              ))}
            </div>
          </section>
        )}
      </main>
    </article>
  );
};
