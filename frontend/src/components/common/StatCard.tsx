import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  subtitle,
  trend,
  color,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-label">
        <span style={{ color: color || 'var(--color-primary)' }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      {(subtitle || trend) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          {subtitle && <span>{subtitle}</span>}
          {trend && <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{trend}</span>}
        </div>
      )}
    </div>
  );
};
