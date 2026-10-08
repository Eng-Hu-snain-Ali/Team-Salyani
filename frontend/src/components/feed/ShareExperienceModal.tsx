import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Lightbulb } from 'lucide-react';
import type { MentorExperience } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareExperienceModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { createExperience, user } = useApp();

  const [title, setTitle] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [authorRole, setAuthorRole] = useState('Founder / Young Entrepreneur');
  const [category, setCategory] = useState<MentorExperience['category']>('business_launch');
  const [summary, setSummary] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [takeaway1, setTakeaway1] = useState('');
  const [takeaway2, setTakeaway2] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fullStory.trim() || !lessonLearned.trim()) return;

    createExperience({
      authorName: user.name,
      authorRole: authorRole || 'Entrepreneur & Member',
      authorAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      businessType: businessType || 'General Business & Career',
      title,
      category,
      summary: summary.trim() || title,
      fullStory,
      lessonLearned,
      keyTakeaways: [takeaway1, takeaway2].filter(Boolean),
      readMinutes: Math.max(2, Math.round(fullStory.split(/\s+/).length / 100)),
    });

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div 
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border-hover)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={20} color="#F59E0B" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Share Your Real Business Experience</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          Help young minds break free from mindless phone scrolling by sharing an authentic lesson from your entrepreneurial journey, business struggle, or breakthrough.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Experience Headline / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The $2,000 Client Contract I Almost Lost Due to Lack of Written Terms"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                color: '#FFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Short Teaser / Summary
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-2 sentences summarizing the dilemma and context..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                color: '#FFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MentorExperience['category'])}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  color: '#FFF',
                  fontSize: '0.88rem',
                }}
              >
                <option value="business_launch">Business Launch</option>
                <option value="costly_mistake">Costly Mistake / Failure</option>
                <option value="sales_negotiation">Sales & Negotiation</option>
                <option value="mindset_shift">Mindset Shift</option>
                <option value="growth_hack">Growth & Marketing</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Business Niche / Field
              </label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g., E-Commerce, Local Agency, Tech"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                  color: '#FFF',
                  fontSize: '0.88rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Your Role or Background
            </label>
            <input
              type="text"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="e.g., 3-Year Agency Owner / Freelancer"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                color: '#FFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              The Real Story (What happened, the dilemma, how you solved it) *
            </label>
            <textarea
              required
              rows={5}
              value={fullStory}
              onChange={(e) => setFullStory(e.target.value)}
              placeholder="Detail the actual situation, what mistakes you made, and what the real-life outcome was..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                color: '#FFF',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FBBF24', display: 'block', marginBottom: 4 }}>
              The #1 Critical Lesson Learned *
            </label>
            <input
              type="text"
              required
              value={lessonLearned}
              onChange={(e) => setLessonLearned(e.target.value)}
              placeholder="e.g., Never begin execution on client work until a 50% deposit has cleared."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#FFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Key Takeaway #1
              </label>
              <input
                type="text"
                value={takeaway1}
                onChange={(e) => setTakeaway1(e.target.value)}
                placeholder="Actionable advice..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                  color: '#FFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Key Takeaway #2
              </label>
              <input
                type="text"
                value={takeaway2}
                onChange={(e) => setTakeaway2(e.target.value)}
                placeholder="Actionable advice..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                  color: '#FFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '10px 20px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
              <Send size={16} />
              <span>Publish Experience</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
