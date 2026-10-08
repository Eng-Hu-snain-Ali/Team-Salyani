import React from 'react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon-bubble">
        {icon || <Sparkles size={28} className="default-empty-icon" />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn-primary empty-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
