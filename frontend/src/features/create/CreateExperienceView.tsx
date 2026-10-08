import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { CATEGORIES, CONTENT_TYPES } from '../../constants';
import type {
  ContentType,
  ExperienceCategory,
  CreateExperiencePayload,
} from '../../types';
import {
  BookOpen,
  Video,
  FileText,
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  Plus,
  Trash2,
  Eye,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const CreateExperienceView: React.FC = () => {
  const { publishExperience, showToast, setActiveTab } = useApp();

  // Form State
  const [contentType, setContentType] = useState<ContentType>('story');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExperienceCategory>('Business');
  const [tagsInput, setTagsInput] = useState('Career, Startup, Mistakes');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);

  // Structured Story Fields
  const [whereIStarted, setWhereIStarted] = useState('');
  const [theProblem, setTheProblem] = useState('');
  const [whatITried, setWhatITried] = useState('');
  const [whatFailed, setWhatFailed] = useState('');
  const [whatWorked, setWhatWorked] = useState('');
  const [whatILearned, setWhatILearned] = useState('');
  const [whatIWouldDoDifferently, setWhatIWouldDoDifferently] = useState('');

  // Key Lessons Builder
  const [lessons, setLessons] = useState<
    Array<{ number: number; title: string; description: string; actionableStep: string }>
  >([
    {
      number: 1,
      title: 'Validate before spending money',
      description: 'Get confirmation from real people before committing your savings.',
      actionableStep: 'Talk to 5 prospective customers face to face.',
    },
  ]);

  // Upload UI State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lesson handlers
  const handleAddLesson = () => {
    if (lessons.length >= 5) {
      showToast('Maximum 5 key lessons allowed per experience.', 'info');
      return;
    }
    setLessons((prev) => [
      ...prev,
      {
        number: prev.length + 1,
        title: '',
        description: '',
        actionableStep: '',
      },
    ]);
  };

  const handleUpdateLesson = (
    index: number,
    field: 'title' | 'description' | 'actionableStep',
    val: string
  ) => {
    setLessons((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: val } : l))
    );
  };

  const handleRemoveLesson = (index: number) => {
    if (lessons.length <= 1) return;
    setLessons((prev) =>
      prev.filter((_, i) => i !== index).map((l, i) => ({ ...l, number: i + 1 }))
    );
  };

  // Simulated Media Upload UI (frontend ready for backend multipart endpoint)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(10);

    // Realistic upload progress simulation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          showToast(`File "${file.name}" ready for upload`, 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleSaveDraft = () => {
    showToast('Draft saved locally in your drafts folder.', 'info');
  };

  const handlePublish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      showToast('Please provide a descriptive title for your experience.', 'error');
      return;
    }

    if (!whereIStarted.trim() || !whatWorked.trim() || !whatILearned.trim()) {
      showToast('Please fill in the core story sections (Where I Started, What Worked, and What I Learned).', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: CreateExperiencePayload = {
        title: title.trim(),
        description: description.trim() || whereIStarted.slice(0, 150) + '...',
        category,
        tags: parsedTags.length > 0 ? parsedTags : [category],
        contentType,
        readTimeMinutes: Number(readTimeMinutes) || 5,
        story: {
          whereIStarted,
          theProblem,
          whatITried,
          whatFailed,
          whatWorked,
          whatILearned,
          whatIWouldDoDifferently,
        },
        lessons: lessons.filter((l) => l.title.trim()),
        media: uploadedFileName
          ? {
              type: contentType === 'video' ? 'video' : contentType === 'pdf' ? 'pdf' : 'image',
              url: 'https://example.com/uploads/' + uploadedFileName,
              fileName: uploadedFileName,
            }
          : undefined,
      };

      await publishExperience(payload);
      setIsPreviewOpen(false);
      setActiveTab('home');
    } catch {
      showToast('Failed to publish experience. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-experience-container">
      {/* Header */}
      <div className="create-header-banner">
        <span className="create-tag">Knowledge Sharing</span>
        <h1 className="create-page-title">Share Your Experience</h1>
        <p className="create-page-subtitle">
          "Your experience might save someone else's time."
        </p>
      </div>

      <form onSubmit={handlePublish} className="create-form-main">
        {/* 1. Format Selector Tabs */}
        <div className="create-section-card">
          <label className="field-group-label">1. Choose Content Format</label>
          <p className="field-group-desc">
            How would you like to communicate your real experience?
          </p>

          <div className="format-selector-grid">
            {CONTENT_TYPES.map((type) => {
              const isSelected = contentType === type.id;
              const getIcon = () => {
                switch (type.id) {
                  case 'video':
                    return <Video size={20} />;
                  case 'pdf':
                    return <FileText size={20} />;
                  case 'guide':
                    return <Sparkles size={20} />;
                  case 'image':
                    return <ImageIcon size={20} />;
                  default:
                    return <BookOpen size={20} />;
                }
              };

              return (
                <button
                  key={type.id}
                  type="button"
                  className={`format-choice-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setContentType(type.id)}
                >
                  <div className="format-icon-wrap">{getIcon()}</div>
                  <span className="format-name">{type.label}</span>
                  <span className="format-badge">{type.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Media Upload UI (If Video, PDF, or Images selected) */}
        {contentType !== 'story' && (
          <div className="create-section-card upload-section">
            <label className="field-group-label">
              Upload {contentType === 'video' ? 'Video File' : contentType === 'pdf' ? 'PDF Document' : 'Visual Asset'}
            </label>
            <p className="field-group-desc">
              Attach media to accompany your structured breakdown. Ready for API upload.
            </p>

            <div className="upload-dropzone-box">
              <input
                type="file"
                id="media-file-input"
                className="file-hidden-input"
                onChange={handleFileSelect}
                accept={
                  contentType === 'video'
                    ? 'video/mp4,video/webm'
                    : contentType === 'pdf'
                    ? 'application/pdf'
                    : 'image/*'
                }
              />
              <label htmlFor="media-file-input" className="dropzone-label">
                <UploadCloud size={36} className="upload-cloud-icon" />
                <span className="dropzone-main-text">
                  Click to select {contentType.toUpperCase()} from your device
                </span>
                <span className="dropzone-sub-text">
                  MP4, WebM, PDF, or PNG up to 100MB
                </span>
              </label>

              {/* Upload Progress State */}
              {isUploading && (
                <div className="upload-progress-container">
                  <div className="progress-info-row">
                    <span>Uploading {uploadedFileName}...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Success State */}
              {uploadedFileName && !isUploading && (
                <div className="upload-success-chip">
                  <FileCheck size={16} className="file-check-icon" />
                  <span className="uploaded-name">{uploadedFileName}</span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => {
                      setUploadedFileName(null);
                      setUploadProgress(0);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {uploadError && (
                <div className="upload-error-box">
                  <AlertCircle size={15} />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Title, Category & Core Metadata */}
        <div className="create-section-card">
          <label className="field-group-label">2. Overview & Context</label>

          <div className="form-group">
            <label className="input-field-label">Experience Title *</label>
            <input
              type="text"
              className="form-text-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I Lost $8,000 on My First Venture and Pivoted"
              required
            />
            <span className="input-hint">
              Make it specific and honest. Highlight the stakes and the outcome.
            </span>
          </div>

          <div className="form-row-two-col">
            <div className="form-group">
              <label className="input-field-label">Category *</label>
              <select
                className="form-select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExperienceCategory)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-field-label">Est. Reading/Watch Time (mins)</label>
              <input
                type="number"
                min={1}
                max={60}
                className="form-text-input"
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-field-label">Tags (comma separated)</label>
            <input
              type="text"
              className="form-text-input"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Career, Cold Outreach, Remote Work"
            />
          </div>

          <div className="form-group">
            <label className="input-field-label">Short Summary (Preview)</label>
            <textarea
              rows={2}
              className="form-textarea-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A 2-sentence summary that appears on feed cards..."
            />
          </div>
        </div>

        {/* 4. The Structured Experience Narrative */}
        <div className="create-section-card">
          <label className="field-group-label">3. Structured Story Breakdown</label>
          <p className="field-group-desc">
            LifeLore narratives follow a proven problem-solution structure so readers can extract practical intuition.
          </p>

          <div className="story-step-box">
            <label className="story-label">
              <span className="badge-step">01</span> Where I Started (The Initial Context)
            </label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={whereIStarted}
              onChange={(e) => setWhereIStarted(e.target.value)}
              placeholder="What was your baseline? Your age, job, financial situation, or assumptions before the event..."
              required
            />
          </div>

          <div className="story-step-box">
            <label className="story-label">
              <span className="badge-step problem">02</span> The Problem & Roadblock
            </label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={theProblem}
              onChange={(e) => setTheProblem(e.target.value)}
              placeholder="What unexpected challenge or trap occurred? What were the stakes?"
            />
          </div>

          <div className="story-step-box">
            <label className="story-label">
              <span className="badge-step">03</span> What I Tried
            </label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={whatITried}
              onChange={(e) => setWhatITried(e.target.value)}
              placeholder="What early tactics or conventional advice did you follow?"
            />
          </div>

          <div className="story-step-box danger-highlight">
            <label className="story-label">
              <span className="badge-step failed">04</span> What Failed (The Mistakes)
            </label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={whatFailed}
              onChange={(e) => setWhatFailed(e.target.value)}
              placeholder="What did NOT work? Where did time or money get wasted? Be candid."
            />
          </div>

          <div className="story-step-box success-highlight">
            <label className="story-label">
              <span className="badge-step worked">05</span> What Worked (The Solution)
            </label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={whatWorked}
              onChange={(e) => setWhatWorked(e.target.value)}
              placeholder="What finally turned things around? The breakthrough strategy..."
              required
            />
          </div>

          <div className="story-step-box">
            <label className="story-label">
              <span className="badge-step">06</span> What I Learned
            </label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={whatILearned}
              onChange={(e) => setWhatILearned(e.target.value)}
              placeholder="The mindset shift or deep principle you walked away with..."
              required
            />
          </div>

          <div className="story-step-box">
            <label className="story-label">
              <span className="badge-step">07</span> What I Would Do Differently
            </label>
            <textarea
              rows={3}
              className="form-textarea-input"
              value={whatIWouldDoDifferently}
              onChange={(e) => setWhatIWouldDoDifferently(e.target.value)}
              placeholder="If you had a time machine, what exact step would you change?"
            />
          </div>
        </div>

        {/* 5. Key Lessons Builder */}
        <div className="create-section-card">
          <div className="lessons-builder-header">
            <div>
              <label className="field-group-label">4. Key Lessons (Numbered Cards)</label>
              <p className="field-group-desc">
                Concise golden rules readers will remember and apply.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary add-lesson-btn"
              onClick={handleAddLesson}
            >
              <Plus size={14} />
              <span>Add Lesson</span>
            </button>
          </div>

          <div className="lessons-builder-list">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="lesson-builder-item">
                <div className="lesson-item-header">
                  <span className="lesson-badge-number">
                    {String(lesson.number).padStart(2, '0')}
                  </span>
                  <span className="lesson-tag-title">Rule #{lesson.number}</span>
                  {lessons.length > 1 && (
                    <button
                      type="button"
                      className="lesson-remove-btn"
                      onClick={() => handleRemoveLesson(idx)}
                      aria-label="Remove lesson"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="lesson-inputs-group">
                  <input
                    type="text"
                    className="form-text-input"
                    value={lesson.title}
                    onChange={(e) => handleUpdateLesson(idx, 'title', e.target.value)}
                    placeholder="Lesson title (e.g. Validate demand before touching inventory)"
                  />
                  <textarea
                    rows={2}
                    className="form-textarea-input"
                    value={lesson.description}
                    onChange={(e) => handleUpdateLesson(idx, 'description', e.target.value)}
                    placeholder="Detailed explanation of why this matters..."
                  />
                  <input
                    type="text"
                    className="form-text-input action-input"
                    value={lesson.actionableStep}
                    onChange={(e) => handleUpdateLesson(idx, 'actionableStep', e.target.value)}
                    placeholder="Actionable step (e.g. Talk to 5 customers before coding)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="create-action-toolbar">
          <button
            type="button"
            className="btn-secondary toolbar-draft-btn"
            onClick={handleSaveDraft}
          >
            <Bookmark size={15} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            className="btn-secondary toolbar-preview-btn"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye size={15} />
            <span>Preview</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary toolbar-publish-btn"
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Experience'}</span>
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Experience Preview"
        subtitle="This is how readers will see your story on LifeLore"
        maxWidth="lg"
      >
        <div className="preview-modal-content">
          <div className="preview-badge-row">
            <span className="badge-category">{category}</span>
            <span className="badge-type story">{contentType.toUpperCase()}</span>
            <span className="readtime-tag">{readTimeMinutes} min read</span>
          </div>

          <h2 className="preview-story-title">{title || 'Untitled Experience'}</h2>
          <p className="preview-story-desc">
            {description || whereIStarted.slice(0, 160) || 'No summary provided.'}
          </p>

          <div className="preview-section-preview">
            <h4>Where I Started</h4>
            <p>{whereIStarted || '...'}</p>
          </div>

          <div className="preview-section-preview">
            <h4>What Failed</h4>
            <p>{whatFailed || '...'}</p>
          </div>

          <div className="preview-section-preview">
            <h4>What Worked</h4>
            <p>{whatWorked || '...'}</p>
          </div>

          <div className="preview-lessons-preview">
            <h4>Key Lessons ({lessons.length})</h4>
            {lessons.map((l, i) => (
              <div key={i} className="mini-lesson-card">
                <span className="number">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{l.title || 'Lesson Title'}</strong>
                  <p>{l.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-buttons-row">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setIsPreviewOpen(false)}
            >
              Back to Editing
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => handlePublish()}
              disabled={isSubmitting}
            >
              Confirm & Publish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
