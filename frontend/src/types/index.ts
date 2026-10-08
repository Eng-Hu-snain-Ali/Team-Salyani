// ============================================================================
// LIFELORE DOMAIN TYPES & DATA CONTRACTS
// "Real Stories. Real Lessons."
// ============================================================================

export type ContentType = 'story' | 'video' | 'pdf' | 'image' | 'guide';

export type ExperienceCategory =
  | 'Career'
  | 'Education'
  | 'Business'
  | 'Technology'
  | 'Money'
  | 'Health'
  | 'Personal Growth'
  | 'Relationships'
  | 'Travel';

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
  myStory?: string;
  whereIStarted: string;
  theProblem: string;
  whatITried: string;
  whatFailed: string;
  whatWorked: string;
  whatILearned: string;
  whatIWouldDoDifferently: string;
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
  description: string;
  category: ExperienceCategory;
  tags: string[];
  contentType: ContentType;
  readTimeMinutes: number;
  story: StructuredStory;
  lessons: Array<Omit<Lesson, 'id'>>;
  media?: ExperienceMedia;
}
