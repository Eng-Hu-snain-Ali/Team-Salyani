import { apiClient } from './apiClient';
import type { SkillData, SkillCategory, ApiResponse } from '../../types';
import { INITIAL_SKILLS } from '../../data/mockData';

class SkillService {
  private localSkills: SkillData[] = [...INITIAL_SKILLS];

  async getSkills(): Promise<ApiResponse<SkillData[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<SkillData[]>>('/skills');
    }

    return {
      success: true,
      data: [...this.localSkills],
    };
  }

  async getSkillById(id: SkillCategory): Promise<ApiResponse<SkillData>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<SkillData>>(`/skills/${id}`);
    }

    const found = this.localSkills.find((s) => s.id === id);
    if (!found) {
      throw new Error(`Skill "${id}" not found.`);
    }

    return {
      success: true,
      data: found,
    };
  }

  async updateSkillScore(
    id: SkillCategory,
    delta: number,
    challengeTitle: string
  ): Promise<ApiResponse<SkillData>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<SkillData>>(`/skills/${id}/progress`, {
        delta,
        challengeTitle,
      });
    }

    const target = this.localSkills.find((s) => s.id === id);
    if (!target) {
      throw new Error(`Skill "${id}" not found.`);
    }

    target.score = Math.min(100, Math.max(0, target.score + delta));
    target.history.unshift({
      date: 'Just now',
      delta,
      challengeTitle,
    });

    return {
      success: true,
      data: target,
    };
  }
}

export const skillService = new SkillService();
