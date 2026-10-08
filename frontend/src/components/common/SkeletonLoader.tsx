import React from 'react';

export const SkeletonLoader: React.FC<{ height?: number; width?: string; borderRadius?: string }> = ({
  height = 20,
  width = '100%',
  borderRadius = 'var(--radius-md)',
}) => {
  return (
    <div
      style={{
        height: `${height}px`,
        width,
        borderRadius,
        backgroundColor: 'var(--bg-surface-elevated)',
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    />
  );
};

export const SkeletonChallengeCard: React.FC = () => {
  return (
    <div className="ustad-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SkeletonLoader height={24} width="35%" borderRadius="var(--radius-pill)" />
        <SkeletonLoader height={24} width="20%" borderRadius="var(--radius-pill)" />
      </div>
      <SkeletonLoader height={22} width="80%" />
      <SkeletonLoader height={48} width="100%" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <SkeletonLoader height={18} width="30%" />
        <SkeletonLoader height={18} width="25%" />
      </div>
    </div>
  );
};
