import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { LessonCard } from '../../components/common/LessonCard';
import { ExperienceCard } from '../../components/common/ExperienceCard';
import { CommentsSection } from '../comments/CommentsSection';
import { experienceService, userService } from '../../services/api';
import type { Experience } from '../../types';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bookmark,
  Share2,
  Clock,
  Video,
  UserPlus,
  Check,
} from 'lucide-react';

export const VideoExperienceView: React.FC = () => {
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!selectedExperienceId) return;

    const loadData = async () => {
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
        showToast('Could not load video experience', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedExperienceId, showToast]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share && experience) {
      try {
        await navigator.share({
          title: experience.title,
          text: `Watch real lessons from "${experience.title}" on Lived:`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback
      }
    }
    navigator.clipboard?.writeText(shareUrl);
    showToast('Link copied to clipboard!', 'success');
  };

  const handleToggleFollow = async () => {
    if (experience) {
      await userService.toggleFollow(experience.author.id);
      setIsFollowing((prev) => !prev);
      showToast(
        isFollowing
          ? `Unfollowed @${experience.author.username}`
          : `Following @${experience.author.username}`,
        'info'
      );
    }
  };

  if (loading || !experience) {
    return (
      <div className="experience-detail-loading-container">
        <div className="detail-loading-spinner" />
        <p>Loading video breakdown...</p>
      </div>
    );
  }

  return (
    <article className="video-experience-page">
      {/* Top Floating Nav */}
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
            title="Like video"
            aria-label="Like video"
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
            title="Share video"
            aria-label="Share video"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Modern Cinematic Video Player */}
      <div className="cinematic-player-wrapper">
        <div className="player-aspect-container" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={experience.media?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            poster={experience.coverImage}
            className="html-video-element"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            playsInline
          />

          {/* Central Play/Pause Overlay button */}
          {!isPlaying && (
            <div className="player-central-overlay">
              <button
                type="button"
                className="big-play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label="Play video"
              >
                <Play size={28} fill="currentColor" />
              </button>
            </div>
          )}

          {/* Custom Player Controls Bar */}
          <div
            className="player-controls-bar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrubber Progress Bar */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="player-timeline-slider"
              aria-label="Seek video"
            />

            <div className="controls-row">
              <div className="controls-left">
                <button
                  type="button"
                  className="control-icon-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                </button>

                <button
                  type="button"
                  className="control-icon-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <span className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="controls-right">
                <span className="quality-badge">HD</span>
                <button
                  type="button"
                  className="control-icon-btn"
                  onClick={handleToggleFullscreen}
                  aria-label="Full screen"
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Information Header */}
      <div className="video-info-container">
        <div className="detail-tags-row">
          <span className="detail-category-tag">{experience.category}</span>
          <span className="detail-format-tag video">
            <Video size={13} />
            <span>Video Experience</span>
          </span>
          <span className="detail-readtime-tag">
            <Clock size={13} />
            <span>{experience.readTimeMinutes} min watch</span>
          </span>
        </div>

        <h1 className="video-title">{experience.title}</h1>
        <p className="video-description">{experience.description}</p>

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
              {experience.author.bio || experience.author.role}
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

        {/* Video Key Lessons Section */}
        <section className="detail-key-lessons-block">
          <div className="key-lessons-header">
            <span className="lessons-badge">Video Insights</span>
            <h2 className="key-lessons-title">Key Lessons from this Breakdown</h2>
            <p className="key-lessons-desc">
              Core principles and execution steps highlighted in the video.
            </p>
          </div>

          <div className="key-lessons-list">
            {experience.lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} showActionStep={true} />
            ))}
          </div>
        </section>

        {/* Helpful Feedback Box */}
        <section className="helpful-feedback-section">
          <div className="feedback-card">
            <h3 className="feedback-title">Was this video experience helpful?</h3>
            <p className="feedback-desc">
              Your rating helps this video reach other learners tackling similar challenges.
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

        {/* Discussion Section */}
        <CommentsSection experienceId={experience.id} />

        {/* Related Experiences */}
        {related.length > 0 && (
          <section className="related-experiences-section">
            <h3 className="related-heading">More in {experience.category}</h3>
            <div className="cards-feed-grid">
              {related.map((rel) => (
                <ExperienceCard key={rel.id} experience={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
