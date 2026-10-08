import React, { useState, useEffect } from 'react';
import type { Comment } from '../../types';
import { commentService } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  MessageSquare,
  ThumbsUp,
  CornerDownRight,
  Flag,
  Send,
  ShieldCheck,
} from 'lucide-react';

interface CommentsSectionProps {
  experienceId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ experienceId }) => {
  const { user, showToast } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Off-topic or non-constructive');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const res = await commentService.getComments(experienceId);
        if (res.data) setComments(res.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [experienceId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const res = await commentService.createComment(experienceId, newCommentText.trim());
      if (res.data) {
        setComments((prev) => [res.data, ...prev]);
        setNewCommentText('');
        showToast('Your reflection was posted to the discussion.', 'success');
      }
    } catch {
      showToast('Could not post reflection', 'error');
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    try {
      const res = await commentService.createComment(experienceId, replyText.trim(), parentId);
      if (res.data) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), res.data],
              };
            }
            return c;
          })
        );
        setReplyText('');
        setReplyingToId(null);
        showToast('Reply added to thread', 'success');
      }
    } catch {
      showToast('Could not post reply', 'error');
    }
  };

  const handleLikeComment = async (id: string) => {
    await commentService.toggleCommentLike(id);
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likesCount: c.likesCount + (isLiked ? 1 : -1),
          };
        }
        return c;
      })
    );
  };

  const handleReport = async () => {
    if (reportingCommentId) {
      await commentService.reportComment(reportingCommentId, reportReason);
      setReportingCommentId(null);
      showToast('Report submitted. Our moderation team will review this shortly.', 'info');
    }
  };

  return (
    <section className="discussion-section">
      <div className="discussion-header">
        <div className="discussion-title-wrap">
          <MessageSquare size={20} className="discussion-icon" />
          <h3 className="discussion-heading">Community Discussion & Practical Q&A</h3>
          <span className="discussion-count">({comments.length})</span>
        </div>
        <div className="discussion-guideline-pill">
          <ShieldCheck size={14} />
          <span>Keep discussions actionable & respectful</span>
        </div>
      </div>

      {/* Write Comment Box */}
      <form onSubmit={handlePostComment} className="comment-composer-form">
        <div className="composer-row">
          <img src={user.avatar} alt={user.name} className="composer-avatar" />
          <div className="composer-input-wrap">
            <textarea
              className="composer-textarea"
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Ask a clarifying question or share how this lesson relates to your experience..."
            />
            <div className="composer-actions-bar">
              <span className="composer-hint">
                Constructive feedback helps authors and peers grow.
              </span>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="btn-primary composer-submit-btn"
              >
                <Send size={14} />
                <span>Post Reflection</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-stream">
        {isLoading ? (
          <div className="comments-loading">Loading discussion thread...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments-box">
            <p>No questions yet. Be the first to start a practical dialogue!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-thread-card">
              <div className="comment-card-header">
                <div className="comment-author-meta">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="comment-author-avatar"
                  />
                  <div>
                    <span className="comment-author-name">{comment.author.name}</span>
                    <span className="comment-author-handle">@{comment.author.username}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="comment-report-btn"
                  onClick={() => setReportingCommentId(comment.id)}
                  title="Report comment"
                  aria-label="Report comment"
                >
                  <Flag size={12} />
                </button>
              </div>

              <div className="comment-content-body">{comment.content}</div>

              <div className="comment-actions-bar">
                <button
                  type="button"
                  className={`comment-action-pill ${comment.isLiked ? 'active' : ''}`}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp size={13} />
                  <span>{comment.likesCount}</span>
                </button>

                <button
                  type="button"
                  className="comment-action-pill reply-btn"
                  onClick={() =>
                    setReplyingToId(replyingToId === comment.id ? null : comment.id)
                  }
                >
                  <CornerDownRight size={13} />
                  <span>Reply</span>
                </button>
              </div>

              {/* Reply Box if opened */}
              {replyingToId === comment.id && (
                <div className="comment-reply-composer">
                  <input
                    type="text"
                    className="reply-input"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author.name}...`}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn-primary reply-send-btn"
                    onClick={() => handlePostReply(comment.id)}
                    disabled={!replyText.trim()}
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="nested-replies-list">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="nested-reply-item">
                      <div className="nested-author-row">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="nested-author-avatar"
                        />
                        <span className="nested-author-name">{reply.author.name}</span>
                        <span className="nested-author-handle">@{reply.author.username}</span>
                      </div>
                      <div className="nested-reply-content">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={Boolean(reportingCommentId)}
        onClose={() => setReportingCommentId(null)}
        title="Report Comment"
        subtitle="Help keep Lived a high-trust, educational environment."
      >
        <div className="report-modal-body">
          <label className="input-label">Reason for reporting:</label>
          <select
            className="input-select"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          >
            <option value="Off-topic or non-constructive">Off-topic or non-constructive</option>
            <option value="Hostile or toxic tone">Hostile or toxic tone</option>
            <option value="Misleading or false financial claim">Misleading or false financial claim</option>
            <option value="Spam or self-promotion">Spam or self-promotion</option>
          </select>

          <div className="modal-buttons-row">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setReportingCommentId(null)}
            >
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={handleReport}>
              Submit Report
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};
