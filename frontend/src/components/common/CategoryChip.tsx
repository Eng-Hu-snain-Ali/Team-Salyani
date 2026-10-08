import React from 'react';
import type { ExperienceCategory } from '../../types';
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  Code,
  Coins,
  HeartPulse,
  Sparkles,
  Users,
  Compass,
} from 'lucide-react';

interface CategoryChipProps {
  category: ExperienceCategory | 'All';
  isSelected?: boolean;
  onClick: () => void;
  count?: number;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected = false,
  onClick,
  count,
}) => {
  const getIcon = () => {
    switch (category) {
      case 'Career':
        return <Briefcase size={14} />;
      case 'Education':
        return <GraduationCap size={14} />;
      case 'Business':
        return <TrendingUp size={14} />;
      case 'Technology':
        return <Code size={14} />;
      case 'Money':
        return <Coins size={14} />;
      case 'Health':
        return <HeartPulse size={14} />;
      case 'Personal Growth':
        return <Sparkles size={14} />;
      case 'Relationships':
        return <Users size={14} />;
      case 'Travel':
        return <Compass size={14} />;
      default:
        return <Sparkles size={14} />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`category-chip ${isSelected ? 'active' : ''}`}
      aria-pressed={isSelected}
    >
      <span className="chip-icon">{getIcon()}</span>
      <span className="chip-label">{category}</span>
      {count !== undefined && <span className="chip-count">{count}</span>}
    </button>
  );
};
