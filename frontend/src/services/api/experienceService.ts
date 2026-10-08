import { apiClient } from './apiClient';
import type {
  Experience,
  FilterOptions,
  ApiResponse,
  CreateExperiencePayload,
  Lesson,
} from '../../types';
import { INITIAL_EXPERIENCES } from '../../data/mockData';

class ExperienceService {
  private localExperiences: Experience[] = [...INITIAL_EXPERIENCES];

  /**
   * Fetch experiences with filter, search, sorting and pagination
   */
  async getExperiences(filters: FilterOptions = {}): Promise<ApiResponse<Experience[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Experience[]>>('/experiences', {
        category: filters.category !== 'All' ? filters.category : undefined,
        contentType: filters.contentType !== 'All' ? filters.contentType : undefined,
        sortBy: filters.sortBy,
        q: filters.searchQuery,
        page: filters.page || 1,
        limit: filters.limit || 10,
      });
    }

    // Local in-memory development provider
    let results = [...this.localExperiences];

    if (filters.category && filters.category !== 'All') {
      results = results.filter((e) => e.category === filters.category);
    }

    if (filters.contentType && filters.contentType !== 'All') {
      results = results.filter((e) => e.contentType === filters.contentType);
    }

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.author.name.toLowerCase().includes(q) ||
          e.lessons.some((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
      );
    }

    if (filters.sortBy === 'popularity') {
      results.sort((a, b) => b.likesCount + b.helpfulCount - (a.likesCount + a.helpfulCount));
    } else if (filters.sortBy === 'most_helpful') {
      results.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else {
      // Newest
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return {
      success: true,
      data: results,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalItems: results.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  /**
   * Fetch single experience details
   */
  async getExperienceById(id: string): Promise<ApiResponse<Experience>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Experience>>(`/experiences/${id}`);
    }

    const found = this.localExperiences.find((e) => e.id === id);
    if (!found) {
      throw new Error(`Experience with ID ${id} not found.`);
    }

    return {
      success: true,
      data: found,
    };
  }

  /**
   * Fetch personalized recommendations based on user interests
   */
  async getRecommended(interests: string[] = []): Promise<ApiResponse<Experience[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Experience[]>>('/experiences/recommended');
    }

    const recommended = this.localExperiences.filter((e) =>
      interests.length === 0 || interests.includes(e.category)
    );

    return {
      success: true,
      data: recommended.length > 0 ? recommended : this.localExperiences.slice(0, 3),
    };
  }

  /**
   * Fetch trending experiences
   */
  async getTrending(limit = 4): Promise<ApiResponse<Experience[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Experience[]>>('/experiences/trending', { limit });
    }

    const sorted = [...this.localExperiences].sort(
      (a, b) => b.helpfulCount + b.likesCount - (a.helpfulCount + a.likesCount)
    );

    return {
      success: true,
      data: sorted.slice(0, limit),
    };
  }

  /**
   * Fetch bite-sized Short Lessons
   */
  async getShortLessons(limit = 6): Promise<ApiResponse<Array<Lesson & { experienceId: string; experienceTitle: string; category: string }>>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get('/lessons/short', { limit });
    }

    const lessonsList: Array<Lesson & { experienceId: string; experienceTitle: string; category: string }> = [];
    this.localExperiences.forEach((exp) => {
      exp.lessons.forEach((lesson) => {
        lessonsList.push({
          ...lesson,
          experienceId: exp.id,
          experienceTitle: exp.title,
          category: exp.category,
        });
      });
    });

    return {
      success: true,
      data: lessonsList.slice(0, limit),
    };
  }

  /**
   * Create & Publish a new experience
   */
  async createExperience(payload: CreateExperiencePayload): Promise<ApiResponse<Experience>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<Experience>>('/experiences', payload);
    }

    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      title: payload.title,
      description:
        payload.description ||
        (payload.story.content ? payload.story.content.slice(0, 140) + '...' : '') ||
        'Real experience shared on Lived.',
      author: {
        id: 'usr_me_01',
        name: 'Alex Chen',
        username: 'alexchen_dev',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Community Member',
        bio: 'Learning from real human experiences on Lived.',
      },
      category: payload.category || 'Personal Growth',
      tags: payload.tags && payload.tags.length > 0 ? payload.tags : ['Experience'],
      contentType: payload.contentType,
      readTimeMinutes: payload.readTimeMinutes || 3,
      story: payload.story,
      lessons: (payload.lessons || []).map((l, index) => ({
        id: `les_${Date.now()}_${index}`,
        number: index + 1,
        title: l.title,
        description: l.description,
        actionableStep: l.actionableStep,
      })),
      media: payload.media,
      likesCount: 0,
      commentsCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.localExperiences.unshift(newExp);

    return {
      success: true,
      data: newExp,
      message: 'Experience successfully published!',
    };
  }

  /**
   * Submit helpfulness feedback: Yes (helpful) or No (not really)
   */
  async markHelpful(id: string, vote: 'yes' | 'no'): Promise<ApiResponse<{ helpfulCount: number; notHelpfulCount: number }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post(`/experiences/${id}/helpful`, { vote });
    }

    const target = this.localExperiences.find((e) => e.id === id);
    if (!target) throw new Error('Experience not found');

    if (target.userHelpfulVote === vote) {
      // Toggle off
      if (vote === 'yes') target.helpfulCount = Math.max(0, target.helpfulCount - 1);
      if (vote === 'no') target.notHelpfulCount = Math.max(0, target.notHelpfulCount - 1);
      target.userHelpfulVote = null;
    } else {
      // Remove old vote if any
      if (target.userHelpfulVote === 'yes') target.helpfulCount = Math.max(0, target.helpfulCount - 1);
      if (target.userHelpfulVote === 'no') target.notHelpfulCount = Math.max(0, target.notHelpfulCount - 1);

      // Apply new
      if (vote === 'yes') target.helpfulCount += 1;
      if (vote === 'no') target.notHelpfulCount += 1;
      target.userHelpfulVote = vote;
    }

    return {
      success: true,
      data: {
        helpfulCount: target.helpfulCount,
        notHelpfulCount: target.notHelpfulCount,
      },
    };
  }

  /**
   * Toggle Like
   */
  async toggleLike(id: string): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post(`/experiences/${id}/like`);
    }

    const target = this.localExperiences.find((e) => e.id === id);
    if (!target) throw new Error('Experience not found');

    target.isLiked = !target.isLiked;
    target.likesCount += target.isLiked ? 1 : -1;

    return {
      success: true,
      data: {
        isLiked: target.isLiked,
        likesCount: target.likesCount,
      },
    };
  }

  /**
   * Toggle Bookmark / Save
   */
  async toggleSave(id: string): Promise<ApiResponse<{ isSaved: boolean }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post(`/experiences/${id}/save`);
    }

    const target = this.localExperiences.find((e) => e.id === id);
    if (!target) throw new Error('Experience not found');

    target.isSaved = !target.isSaved;

    return {
      success: true,
      data: {
        isSaved: Boolean(target.isSaved),
      },
    };
  }

  /**
   * Fetch Saved experiences
   */
  async getSavedExperiences(): Promise<ApiResponse<Experience[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Experience[]>>('/experiences/saved');
    }

    const saved = this.localExperiences.filter((e) => e.isSaved);
    return {
      success: true,
      data: saved,
    };
  }
}

export const experienceService = new ExperienceService();
