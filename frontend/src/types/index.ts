// ============================================================================
// LIVED DOMAIN TYPES & DATA CONTRACTS
// "Real experiences. Real lessons."
// ============================================================================

export type ContentType = 'story' | 'video' | 'pdf' | 'image' | 'guide';

export type ExperienceCategory =
  | 'Career'
  | 'Education'
  | 'Technology'
  | 'Programming'
  | 'Freelancing'
  | 'Business'
  | 'Money'
  | 'Personal Growth'
  | 'Productivity'
  | 'Motivation'
  | 'Communication'
  | 'Health'
  | 'Relationships'
  | 'Travel'
  | 'Student Life';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  location?: string;
  role?: string;
  interests: ExperienceCategory[];
  currentGoal?: string;
  followersCount: number;
  followingCount: number;
  experiencesCount: number;
  helpfulCount: number;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  number: number; // e.g. 1 -> displayed as "01"
  title: string;
  description: string;
  actionableStep?: string;
}

export interface StructuredStory {
  content?: string;
  myStory?: string;
  whereIStarted?: string;
  theProblem?: string;
  whatITried?: string;
  whatFailed?: string;
  whatWorked?: string;
  whatILearned?: string;
  whatIWouldDoDifferently?: string;
}

export interface ExperienceMedia {
  type: 'video' | 'image' | 'pdf';
  url: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  durationSeconds?: number;
}

export interface Experience {
  id: string;
  title: string;
  description: string; // short summary
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role?: string;
    bio?: string;
  };
  category: ExperienceCategory;
  tags: string[];
  contentType: ContentType;
  readTimeMinutes: number; // or watch time for video
  coverImage?: string;
  
  // Structured long-form story
  story: StructuredStory;
  
  // High-yield takeaway cards
  lessons: Lesson[];
  
  // Optional attached media (video, PDF, image gallery)
  media?: ExperienceMedia;
  
  // Engagement & Feedback
  likesCount: number;
  commentsCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  userHelpfulVote?: 'yes' | 'no' | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  experienceId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string | null; // For threaded replies
  replies?: Comment[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  actor: {
    id: string;
    name: string;
    avatar: string;
  };
  type: 'like' | 'comment' | 'reply' | 'follow' | 'helpful';
  targetId: string; // experienceId or commentId
  targetTitle?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SavedExperience {
  experienceId: string;
  savedAt: string;
  category: ExperienceCategory;
  contentType: ContentType;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// API & Pagination Contracts (For Backend Developers)
// ----------------------------------------------------------------------------

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export interface FilterOptions {
  category?: ExperienceCategory | 'All';
  contentType?: ContentType | 'All';
  sortBy?: 'popularity' | 'newest' | 'most_helpful';
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface CreateExperiencePayload {
  title: string;
  description?: string;
  category?: ExperienceCategory;
  tags?: string[];
  contentType: ContentType;
  readTimeMinutes?: number;
  story: StructuredStory;
  lessons?: Array<Omit<Lesson, 'id'>>;
  media?: ExperienceMedia;
}

// ----------------------------------------------------------------------------
// Team Profile Models
// ----------------------------------------------------------------------------
export interface TeamMember {
  id: string;
  name: string; // e.g. "Team Member 01"
  role: string; // e.g. "Frontend & UI Design"
  bio: string;
  avatar?: string;
  initials: string;
  github?: string;
  linkedin?: string;
}

// ----------------------------------------------------------------------------
// Curated Video & Knowledge Discovery Models
// ----------------------------------------------------------------------------
export interface ExploreVideo {
  id: string;
  title: string;
  description: string;
  creator: string; // e.g. "Steve Jobs / Stanford", "Ali Abdaal", "CS50"
  source: 'YouTube' | 'External Resource';
  category: ExperienceCategory;
  duration: string; // e.g. "14:20"
  thumbnailUrl: string;
  youtubeVideoId: string; // Embeddable ID e.g. "UF8uR6Z6KLc"
  youtubeUrl: string;
  whyWatchThis: string;
  keyTakeaways: string[];
  viewsCount?: string;
}

export interface ExploreIdea {
  id: string;
  title: string;
  summary: string;
  category: ExperienceCategory;
  readTimeMinutes: number;
  coreInsight: string;
  actionSteps: string[];
}

// ----------------------------------------------------------------------------
// Authentication API Contracts
// ----------------------------------------------------------------------------
export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  avatar?: string;
  interests?: ExperienceCategory[];
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email?: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}
