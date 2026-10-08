import { apiClient } from './apiClient';
import type {
  Challenge,
  ChallengeAttemptResult,
  SkillCategory,
  ChallengeDifficulty,
  OptionId,
  ApiResponse,
} from '../../types';
import { INITIAL_CHALLENGES } from '../../data/mockData';

export interface ChallengeFilters {
  category?: SkillCategory | 'All';
  difficulty?: ChallengeDifficulty | 'All';
  searchQuery?: string;
}

class ChallengeService {
  private localChallenges: Challenge[] = [...INITIAL_CHALLENGES];

  async getChallenges(filters: ChallengeFilters = {}): Promise<ApiResponse<Challenge[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Challenge[]>>('/challenges', {
        category: filters.category !== 'All' ? filters.category : undefined,
        difficulty: filters.difficulty !== 'All' ? filters.difficulty : undefined,
        q: filters.searchQuery,
      });
    }

    let results = [...this.localChallenges];

    if (filters.category && filters.category !== 'All') {
      results = results.filter((c) => c.category === filters.category);
    }

    if (filters.difficulty && filters.difficulty !== 'All') {
      results = results.filter((c) => c.difficulty === filters.difficulty);
    }

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return {
      success: true,
      data: results,
    };
  }

  async getChallengeById(id: string): Promise<ApiResponse<Challenge>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Challenge>>(`/challenges/${id}`);
    }

    const found = this.localChallenges.find((c) => c.id === id);
    if (!found) {
      throw new Error(`Challenge with ID "${id}" not found.`);
    }

    return {
      success: true,
      data: found,
    };
  }

  async getDailyChallenge(): Promise<ApiResponse<Challenge>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Challenge>>('/challenges/daily');
    }

    const daily = this.localChallenges.find((c) => c.isDaily) || this.localChallenges[0];
    return {
      success: true,
      data: daily,
    };
  }

  async getRecommendedChallenges(limit = 3): Promise<ApiResponse<Challenge[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Challenge[]>>('/challenges/recommended', { limit });
    }

    const list = this.localChallenges.filter((c) => !c.completed).slice(0, limit);
    return {
      success: true,
      data: list.length > 0 ? list : this.localChallenges.slice(0, limit),
    };
  }

  async submitDecision(
    challengeId: string,
    optionId: OptionId,
    writtenResponse?: string
  ): Promise<ApiResponse<ChallengeAttemptResult>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<ChallengeAttemptResult>>(`/challenges/${challengeId}/attempt`, {
        optionId,
        writtenResponse,
      });
    }

    const challenge = this.localChallenges.find((c) => c.id === challengeId);
    if (!challenge) {
      throw new Error(`Challenge with ID "${challengeId}" not found.`);
    }

    const selectedOption = challenge.options.find((o) => o.id === optionId);
    if (!selectedOption) {
      throw new Error(`Invalid option "${optionId}" selected.`);
    }

    // Mark completed locally
    challenge.completed = true;
    challenge.completedAt = new Date().toISOString();
    challenge.userChoiceId = optionId;
    challenge.userWrittenResponse = writtenResponse;

    const result: ChallengeAttemptResult = {
      challengeId,
      selectedOption,
      writtenResponse,
      xpEarned: challenge.xpReward,
      skillDelta: selectedOption.skillImpact,
      newSkillScore: 70, // will be orchestrated in AppContext
      newTotalXp: 470,
      newLevel: 3,
      completedAt: challenge.completedAt,
    };

    return {
      success: true,
      data: result,
      message: 'Decision recorded successfully.',
    };
  }
}

export const challengeService = new ChallengeService();
