import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-strong)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          marginBottom: '16px',
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5, marginBottom: actionLabel ? '20px' : '0' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
