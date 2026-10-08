import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-header">
        <div className="skeleton-avatar" />
        <div className="skeleton-header-text">
          <div className="skeleton-line line-short" />
          <div className="skeleton-line line-xshort" />
        </div>
      </div>
      <div className="skeleton-line line-title" />
      <div className="skeleton-line line-body" />
      <div className="skeleton-line line-body-short" />
      <div className="skeleton-footer">
        <div className="skeleton-line line-badge" />
        <div className="skeleton-line line-badge" />
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="skeleton-list-container">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
