import { apiClient } from './apiClient';
import type { ExploreVideo, ApiResponse, ExperienceCategory } from '../../types';
import { CURATED_VIDEOS } from '../../data/mockData';

class VideoService {
  private videos: ExploreVideo[] = [...CURATED_VIDEOS];

  async getVideos(params?: {
    category?: ExperienceCategory | 'All';
    searchQuery?: string;
  }): Promise<ApiResponse<ExploreVideo[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<ExploreVideo[]>>('/videos', params);
    }

    let filtered = [...this.videos];
    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter((v) => v.category === params.category);
    }
    if (params?.searchQuery && params.searchQuery.trim().length > 0) {
      const q = params.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.creator.toLowerCase().includes(q) ||
          v.whyWatchThis.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: filtered,
    };
  }

  async getVideoById(id: string): Promise<ApiResponse<ExploreVideo>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<ExploreVideo>>(`/videos/${id}`);
    }

    const video = this.videos.find((v) => v.id === id);
    if (!video) {
      return {
        success: false,
        data: this.videos[0],
        error: 'Video resource not found',
      };
    }

    return {
      success: true,
      data: video,
    };
  }
}

export const videoService = new VideoService();
