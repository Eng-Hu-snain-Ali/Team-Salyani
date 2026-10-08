import type { ExperienceCategory, ContentType } from '../types';

export const CATEGORIES: Array<{
  id: ExperienceCategory;
  label: string;
  iconName: string;
  description: string;
}> = [
  { id: 'Career', label: 'Career', iconName: 'Briefcase', description: 'Job hunting, promotions, career pivots, workplace navigation' },
  { id: 'Education', label: 'Education', iconName: 'GraduationCap', description: 'University journeys, exam preparation, self-study techniques' },
  { id: 'Technology', label: 'Technology', iconName: 'Laptop', description: 'Software engineering, tech transitions, digital infrastructure' },
  { id: 'Programming', label: 'Programming', iconName: 'Code', description: 'Coding roadmaps, bug debugging, tech stack choices, learning syntax' },
  { id: 'Freelancing', label: 'Freelancing', iconName: 'Compass', description: 'Finding first clients, pitching, pricing work, remote client management' },
  { id: 'Business', label: 'Business', iconName: 'TrendingUp', description: 'Starting ventures, early revenue, client acquisition, startup failures' },
  { id: 'Money', label: 'Money', iconName: 'Coins', description: 'Budgeting reality, early mistakes, saving tactics, cashflow lessons' },
  { id: 'Personal Growth', label: 'Personal Growth', iconName: 'Sparkles', description: 'Breaking bad habits, discipline, building authentic confidence' },
  { id: 'Productivity', label: 'Productivity', iconName: 'Clock', description: 'Time management, deep focus, overcoming procrastination, daily systems' },
  { id: 'Motivation', label: 'Motivation', iconName: 'Flame', description: 'Staying resilient, overcoming self-doubt, rebuilding after setbacks' },
  { id: 'Communication', label: 'Communication', iconName: 'MessageSquare', description: 'Public speaking, negotiations, difficult conversations, empathy' },
  { id: 'Health', label: 'Health', iconName: 'HeartPulse', description: 'Mental resilience, burnout recovery, sustainable fitness routines' },
  { id: 'Relationships', label: 'Relationships', iconName: 'Users', description: 'Healthy boundaries, hard conversations, managing expectations' },
  { id: 'Travel', label: 'Travel', iconName: 'MapPin', description: 'Moving abroad, culture shock, solo travel survival lessons' },
  { id: 'Student Life', label: 'Student Life', iconName: 'BookMarked', description: 'College survival, internships, balancing work and studies' },
];

export const CONTENT_TYPES: Array<{
  id: ContentType;
  label: string;
  badge: string;
  icon: string;
}> = [
  { id: 'story', label: 'Stories', badge: 'Story', icon: 'BookOpen' },
  { id: 'video', label: 'Videos', badge: 'Video', icon: 'Video' },
  { id: 'pdf', label: 'PDFs', badge: 'PDF', icon: 'FileText' },
  { id: 'guide', label: 'Guides', badge: 'Guide', icon: 'FileCheck' },
  { id: 'image', label: 'Images', badge: 'Visual', icon: 'Image' },
];

export const EXPLORE_TYPE_FILTERS = [
  { id: 'All', label: 'All' },
  { id: 'story', label: 'Stories' },
  { id: 'video', label: 'Videos' },
  { id: 'pdf', label: 'PDFs' },
  { id: 'guide', label: 'Guides' },
] as const;

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'most_helpful', label: 'Most Helpful' },
  { id: 'popularity', label: 'Trending' },
] as const;

export const DEFAULT_PAGE_SIZE = 10;
