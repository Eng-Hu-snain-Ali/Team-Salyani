import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const IdeaDetailModal: React.FC = () => {
  const { selectedIdea, closeIdeaDetail, setActiveTab } = useApp();

  if (!selectedIdea) return null;

  return (
    <Modal
      isOpen={Boolean(selectedIdea)}
      onClose={closeIdeaDetail}
      maxWidth="md"
      title=""
    >
      <div className="idea-modal-content">
        <div className="idea-badge-bar">
          <span className="idea-category-pill">{selectedIdea.category}</span>
          <span className="idea-readtime-pill">
            <Clock size={12} />
            {selectedIdea.readTimeMinutes} min read
          </span>
        </div>

        <h2 className="idea-modal-title">{selectedIdea.title}</h2>
        <p className="idea-modal-summary">{selectedIdea.summary}</p>

        {/* Core Insight Callout */}
        <div className="idea-core-insight-card">
          <div className="insight-header">
            <Sparkles size={16} className="text-brand" />
            <h3>Core Mental Model</h3>
          </div>
          <blockquote className="insight-quote">
            "{selectedIdea.coreInsight}"
          </blockquote>
        </div>

        {/* Actionable Steps */}
        <div className="idea-action-steps-card">
          <div className="steps-header">
            <CheckCircle2 size={16} className="text-accent" />
            <h3>Practical Implementation Steps</h3>
          </div>
          <div className="steps-list">
            {selectedIdea.actionSteps.map((step, idx) => (
              <div key={idx} className="step-card-row">
                <span className="step-badge">0{idx + 1}</span>
                <p className="step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Related Prompt */}
        <div className="idea-footer-prompt">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              closeIdeaDetail();
              setActiveTab('explore');
            }}
          >
            <span>Explore Related Stories</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
