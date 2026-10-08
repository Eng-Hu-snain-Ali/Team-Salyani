import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'var(--color-primary)',
  height = 8,
  showLabel = false,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Mastery</span>
          <span style={{ color: 'var(--text-main)' }}>{clamped}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height: `${height}px` }}>
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
