import type { ExperienceCategory, ContentType } from '../types';

export const CATEGORIES: Array<{
  id: ExperienceCategory;
  label: string;
  iconName: string;
  description: string;
}> = [
  { id: 'Career', label: 'Career', iconName: 'Briefcase', description: 'Job hunting, promotions, career pivots, workplace navigation' },
  { id: 'Education', label: 'Education', iconName: 'GraduationCap', description: 'University journeys, exam preparation, self-study techniques' },
  { id: 'Business', label: 'Business', iconName: 'TrendingUp', description: 'Starting ventures, early revenue, client acquisition, startup failures' },
  { id: 'Technology', label: 'Technology', iconName: 'Code', description: 'Coding roadmaps, engineering challenges, tech transitions' },
  { id: 'Money', label: 'Money', iconName: 'Coins', description: 'Budgeting reality, early mistakes, saving tactics, cashflow lessons' },
  { id: 'Health', label: 'Health', iconName: 'HeartPulse', description: 'Mental resilience, burnout recovery, fitness routines that stuck' },
  { id: 'Personal Growth', label: 'Personal Growth', iconName: 'Sparkles', description: 'Breaking bad habits, discipline, building authentic confidence' },
  { id: 'Relationships', label: 'Relationships', iconName: 'Users', description: 'Boundaries, hard conversations, managing family expectations' },
  { id: 'Travel', label: 'Travel', iconName: 'Compass', description: 'Moving abroad, culture shock, solo travel survival lessons' },
];

export const CONTENT_TYPES: Array<{
  id: ContentType;
  label: string;
  badge: string;
  icon: string;
}> = [
  { id: 'story', label: 'Written Story', badge: 'Story', icon: 'BookOpen' },
  { id: 'video', label: 'Video Experience', badge: 'Video', icon: 'Video' },
  { id: 'pdf', label: 'PDF / Document', badge: 'PDF Guide', icon: 'FileText' },
  { id: 'guide', label: 'Actionable Guide', badge: 'Guide', icon: 'FileCheck' },
  { id: 'image', label: 'Visual Breakdown', badge: 'Visual', icon: 'Image' },
];

export const SORT_OPTIONS = [
  { id: 'most_helpful', label: 'Most Helpful' },
  { id: 'popularity', label: 'Trending / Popular' },
  { id: 'newest', label: 'Newest First' },
] as const;

export const DEFAULT_PAGE_SIZE = 10;
