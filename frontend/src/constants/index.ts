import type { SkillCategory, ChallengeDifficulty } from '../types';

export const SKILL_CATEGORIES: Array<{
  id: SkillCategory;
  name: string;
  iconName: string;
  color: string;
  badgeBg: string;
  description: string;
}> = [
  {
    id: 'decision-making',
    name: 'Decision Making',
    iconName: 'Compass',
    color: '#2563EB',
    badgeBg: 'rgba(37, 99, 235, 0.12)',
    description: 'Evaluating trade-offs, handling peer pressure, avoiding bias, and committing to clear choices.',
  },
  {
    id: 'money-management',
    name: 'Money Management',
    iconName: 'Wallet',
    color: '#16A34A',
    badgeBg: 'rgba(22, 163, 74, 0.12)',
    description: 'Budgeting with limited funds, separating needs vs wants, cashflow buffers, and avoiding debt traps.',
  },
  {
    id: 'time-management',
    name: 'Time Management',
    iconName: 'Clock',
    color: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    description: 'Ruthless prioritization, deep focus scheduling, setting boundaries, and conquering procrastination.',
  },
  {
    id: 'communication',
    name: 'Communication',
    iconName: 'MessageSquare',
    color: '#7C3AED',
    badgeBg: 'rgba(124, 58, 237, 0.12)',
    description: 'Difficult workplace conversations, active listening, de-escalating conflict, and constructive persuasion.',
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    iconName: 'Cpu',
    color: '#0891B2',
    badgeBg: 'rgba(8, 145, 178, 0.12)',
    description: 'Breaking messy problems into steps, identifying root causes, and testing high-leverage solutions.',
  },
];

export const DIFFICULTY_LEVELS: ChallengeDifficulty[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

export const AGE_GROUPS = [
  { id: '16-19', label: '16–19 years', sub: 'High School & Prep' },
  { id: '20-24', label: '20–24 years', sub: 'College & Early Career' },
  { id: '25-34', label: '25–34 years', sub: 'Working Professional' },
  { id: '35+', label: '35+ years', sub: 'Experienced Leader & Pivot' },
];

export const LEARNING_GOALS = [
  { id: 'goal_financial', label: 'Stop overspending & build an emergency reserve', category: 'money-management' },
  { id: 'goal_priorities', label: 'Overcome procrastination & manage conflicting deadlines', category: 'time-management' },
  { id: 'goal_conflict', label: 'Handle tough conversations calmly without burning bridges', category: 'communication' },
  { id: 'goal_decisions', label: 'Make confident life decisions despite uncertainty', category: 'decision-making' },
  { id: 'goal_problem', label: 'Systematically diagnose and solve complex setbacks', category: 'problem-solving' },
  { id: 'goal_boundaries', label: 'Say no clearly without feeling guilty or awkward', category: 'communication' },
];

export const APP_CONFIG = {
  appName: 'USTAD ONLINE',
  tagline: 'Learn. Decide. Improve.',
  description: 'A practical life-learning platform that helps users improve real-life decision-making skills through interactive scenarios, consequences, feedback, and progress tracking.',
};
