import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../constants';
import type {
  ContentType,
  ExperienceCategory,
  CreateExperiencePayload,
} from '../../types';
import {
  PenTool,
  Video,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const CreateExperienceView: React.FC = () => {
  const { publishExperience, showToast, setActiveTab } = useApp();

  // Basic Flow
  const [contentType, setContentType] = useState<ContentType>('story');
  const [title, setTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');

  // Media state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Optional Details (Collapsed by default)
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [category, setCategory] = useState<ExperienceCategory>('Career');
  const [tagsInput, setTagsInput] = useState('');
  const [whatILearned, setWhatILearned] = useState('');
  const [adviceForOthers, setAdviceForOthers] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Media selector helper
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          showToast(`File "${file.name}" ready to publish.`, 'success');
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleSaveDraft = () => {
    showToast('Draft saved to your device.', 'info');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please add a title for your experience.', 'error');
      return;
    }

    if (contentType === 'story' && !storyContent.trim()) {
      showToast('Please write a few sentences about your experience.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const optionalLessons = [];
      if (whatILearned.trim()) {
        optionalLessons.push({
          number: 1,
          title: whatILearned.trim().slice(0, 70),
          description: whatILearned.trim(),
          actionableStep: adviceForOthers.trim() || undefined,
        });
      }

      const payload: CreateExperiencePayload = {
        title: title.trim(),
        contentType,
        story: {
          content: storyContent.trim() || undefined,
          whatILearned: whatILearned.trim() || undefined,
          whatIWouldDoDifferently: adviceForOthers.trim() || undefined,
        },
        category: showOptionalDetails ? category : 'Career',
        tags: parsedTags.length > 0 ? parsedTags : ['Experience'],
        lessons: optionalLessons,
        media: uploadedFileName
          ? {
              type: contentType === 'video' ? 'video' : contentType === 'pdf' ? 'pdf' : 'image',
              url: 'https://example.com/uploads/' + uploadedFileName,
              fileName: uploadedFileName,
            }
          : undefined,
      };

      await publishExperience(payload);
      setActiveTab('home');
    } catch {
      showToast('Failed to publish. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-view-simple">
      <div className="create-simple-header">
        <h1 className="create-simple-title">Share Experience</h1>
        <p className="create-simple-sub">
          Share what you lived through. Your story might save someone else months of trial and error.
        </p>
      </div>

      <form onSubmit={handlePublish} className="create-simple-form">
        {/* Step 1: Format Toggle */}
        <div className="format-toggle-bar">
          <button
            type="button"
            className={`format-toggle-btn ${contentType === 'story' ? 'active' : ''}`}
            onClick={() => setContentType('story')}
          >
            <PenTool size={16} />
            <span>Write</span>
          </button>

          <button
            type="button"
            className={`format-toggle-btn ${contentType === 'video' ? 'active' : ''}`}
            onClick={() => setContentType('video')}
          >
            <Video size={16} />
            <span>Video</span>
          </button>

          <button
            type="button"
            className={`format-toggle-btn ${contentType === 'pdf' ? 'active' : ''}`}
            onClick={() => setContentType('pdf')}
          >
            <FileText size={16} />
            <span>PDF</span>
          </button>

          <button
            type="button"
            className={`format-toggle-btn ${contentType === 'image' ? 'active' : ''}`}
            onClick={() => setContentType('image')}
          >
            <ImageIcon size={16} />
            <span>Images</span>
          </button>
        </div>

        {/* Media Upload Area (Only if Video, PDF, or Images) */}
        {contentType !== 'story' && (
          <div className="simple-upload-box">
            <input
              type="file"
              id="simple-file-picker"
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
            <label htmlFor="simple-file-picker" className="simple-upload-label">
              <UploadCloud size={30} className="upload-icon-simple" />
              <span className="upload-main-text">
                {uploadedFileName ? 'Choose different file' : `Upload ${contentType.toUpperCase()}`}
              </span>
              <span className="upload-sub-text">Tap to select from your device</span>
            </label>

            {isUploading && (
              <div className="upload-progress-simple">
                <span>Uploading {uploadProgress}%</span>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadedFileName && !isUploading && (
              <div className="file-ready-tag">
                <FileCheck size={14} />
                <span>{uploadedFileName}</span>
              </div>
            )}
          </div>
        )}

        {/* Title Input */}
        <div className="simple-input-group">
          <input
            type="text"
            className="simple-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title: e.g. How I got my first freelance client"
            autoFocus
            required
          />
        </div>

        {/* Story Textarea (If Written or supplemental notes) */}
        <div className="simple-input-group">
          <textarea
            className="simple-story-textarea"
            rows={contentType === 'story' ? 10 : 4}
            value={storyContent}
            onChange={(e) => setStoryContent(e.target.value)}
            placeholder={
              contentType === 'story'
                ? "Tell your story...\n\nWhat happened? What problems occurred? What worked and what did you learn?"
                : "Add notes or a brief explanation of what this media covers (optional)..."
            }
            required={contentType === 'story'}
          />
        </div>

        {/* Optional Collapsed Section */}
        <div className="optional-accordion-box">
          <button
            type="button"
            className="optional-toggle-btn"
            onClick={() => setShowOptionalDetails(!showOptionalDetails)}
          >
            <span>Add more details (optional)</span>
            {showOptionalDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showOptionalDetails && (
            <div className="optional-expanded-fields">
              <div className="optional-field-row">
                <div className="form-group">
                  <label className="input-field-label">Category</label>
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
                  <label className="input-field-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-text-input"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Freelancing, First Client, Sales"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-field-label">What I learned</label>
                <input
                  type="text"
                  className="form-text-input"
                  value={whatILearned}
                  onChange={(e) => setWhatILearned(e.target.value)}
                  placeholder="Key takeaway (e.g. Always qualify client budget upfront)"
                />
              </div>

              <div className="form-group">
                <label className="input-field-label">Advice for others</label>
                <input
                  type="text"
                  className="form-text-input"
                  value={adviceForOthers}
                  onChange={(e) => setAdviceForOthers(e.target.value)}
                  placeholder="What would you tell someone starting out?"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="create-simple-footer">
          <button type="button" className="btn-ghost" onClick={handleSaveDraft}>
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary create-publish-main-btn"
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Experience'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
