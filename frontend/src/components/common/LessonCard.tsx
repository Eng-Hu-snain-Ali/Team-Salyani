import React from 'react';
import type { Lesson } from '../../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  category?: string;
  onClick?: () => void;
  showActionStep?: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  category,
  onClick,
  showActionStep = true,
}) => {
  const formattedNumber = String(lesson.number).padStart(2, '0');

  return (
    <div
      className={`lesson-card ${onClick ? 'interactive' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="lesson-card-header">
        <span className="lesson-number-badge">{formattedNumber}</span>
        {category && <span className="lesson-category-tag">{category}</span>}
      </div>

      <h4 className="lesson-card-title">{lesson.title}</h4>
      <p className="lesson-card-description">{lesson.description}</p>

      {showActionStep && lesson.actionableStep && (
        <div className="lesson-actionable-box">
          <CheckCircle2 size={15} className="lesson-action-icon" />
          <span className="lesson-action-text">
            <strong>Action:</strong> {lesson.actionableStep}
          </span>
        </div>
      )}

      {onClick && (
        <div className="lesson-card-footer">
          <span className="lesson-read-source">Read full case story</span>
          <ArrowRight size={14} />
        </div>
      )}
    </div>
  );
};
