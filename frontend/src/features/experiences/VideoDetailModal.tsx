import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
  Tv,
} from 'lucide-react';

export const VideoDetailModal: React.FC = () => {
  const { selectedVideo, closeVideoDetail, showToast } = useApp();

  if (!selectedVideo) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedVideo.youtubeUrl);
      showToast('Video link copied to clipboard!', 'success');
    }
  };

  return (
    <Modal
      isOpen={Boolean(selectedVideo)}
      onClose={closeVideoDetail}
      maxWidth="md"
      title=""
    >
      <div className="video-modal-content">
        {/* Source Badge Bar */}
        <div className="video-source-banner">
          <div className="source-tag">
            <Tv size={14} />
            <span>From YouTube • External Educational Resource</span>
          </div>
          <span className="source-category-pill">{selectedVideo.category}</span>
        </div>

        {/* Video Embed Player */}
        <div className="video-player-container">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeVideoId}?rel=0`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-iframe-player"
          />
        </div>

        {/* Video Header Details */}
        <div className="video-header-details">
          <h2 className="video-detail-title">{selectedVideo.title}</h2>

          <div className="video-meta-subbar">
            <span className="video-creator-text">
              By <strong>{selectedVideo.creator}</strong>
            </span>
            <span className="dot-sep">•</span>
            <span className="video-duration-text">
              <Clock size={13} />
              {selectedVideo.duration}
            </span>
            {selectedVideo.viewsCount && (
              <>
                <span className="dot-sep">•</span>
                <span className="video-views-text">{selectedVideo.viewsCount}</span>
              </>
            )}
          </div>
        </div>

        {/* Video Description */}
        <p className="video-full-description">{selectedVideo.description}</p>

        {/* Why Watch This */}
        <div className="video-takeaways-box">
          <div className="takeaway-header">
            <Sparkles size={16} className="text-brand" />
            <h3>Why watch this?</h3>
          </div>
          <p className="why-watch-text">{selectedVideo.whyWatchThis}</p>
        </div>

        {/* Key Takeaways */}
        <div className="video-takeaways-box">
          <div className="takeaway-header">
            <CheckCircle2 size={16} className="text-accent" />
            <h3>Key Takeaways</h3>
          </div>
          <ul className="key-takeaways-list">
            {selectedVideo.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="takeaway-item">
                <span className="takeaway-bullet-num">0{idx + 1}</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions Bar */}
        <div className="video-modal-actions-bar">
          <a
            href={selectedVideo.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary external-yt-link"
          >
            <span>Open on YouTube</span>
            <ExternalLink size={14} />
          </a>

          <button
            type="button"
            className="btn-secondary share-video-btn"
            onClick={handleShare}
          >
            <Share2 size={14} />
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
