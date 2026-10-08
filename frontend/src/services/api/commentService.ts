import { apiClient } from './apiClient';
import type { Comment, ApiResponse } from '../../types';

class CommentService {
  private localComments: Record<string, Comment[]> = {
    exp_01: [
      {
        id: 'cmt_01',
        experienceId: 'exp_01',
        author: {
          id: 'usr_03',
          name: 'Maya Lin',
          username: 'mayacodes',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        },
        content: 'This resonated so deeply. I made almost the exact same mistake trying to start a custom planner brand. The "pre-order before manufacturing" rule is the single most valuable lesson any first-time entrepreneur can learn.',
        likesCount: 38,
        isLiked: false,
        createdAt: '2026-09-29T11:20:00Z',
        replies: [
          {
            id: 'cmt_01_rep_1',
            experienceId: 'exp_01',
            parentId: 'cmt_01',
            author: {
              id: 'usr_02',
              name: 'Tariq Rehman',
              username: 'tariq_builds',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            },
            content: '100%, Maya. People are often embarrassed to talk about money they lost early on, but sharing the exact dollar figure helps others realize they aren\'t broken—they just skipped validation.',
            likesCount: 19,
            isLiked: false,
            createdAt: '2026-09-29T14:45:00Z',
          },
        ],
      },
      {
        id: 'cmt_02',
        experienceId: 'exp_01',
        author: {
          id: 'usr_05',
          name: 'Julian Vance',
          username: 'julian_vance',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
        content: 'Question on the in-person interviews: what exact questions did you ask when people said they wouldn\'t buy it? Did you ask about pricing or usability first?',
        likesCount: 14,
        isLiked: false,
        createdAt: '2026-09-30T08:12:00Z',
      },
    ],
  };

  /**
   * Fetch comments for an experience
   */
  async getComments(experienceId: string): Promise<ApiResponse<Comment[]>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get<ApiResponse<Comment[]>>(`/experiences/${experienceId}/comments`);
    }

    const comments = this.localComments[experienceId] || [];
    return {
      success: true,
      data: comments,
    };
  }

  /**
   * Post a new comment or reply
   */
  async createComment(
    experienceId: string,
    content: string,
    parentId?: string | null
  ): Promise<ApiResponse<Comment>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post<ApiResponse<Comment>>(`/experiences/${experienceId}/comments`, {
        content,
        parentId,
      });
    }

    const newComment: Comment = {
      id: `cmt_${Date.now()}`,
      experienceId,
      author: {
        id: 'usr_me_01',
        name: 'Alex Chen',
        username: 'alexchen_dev',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      content,
      likesCount: 0,
      isLiked: false,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    };

    if (!this.localComments[experienceId]) {
      this.localComments[experienceId] = [];
    }

    if (parentId) {
      const parent = this.localComments[experienceId].find((c) => c.id === parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
      } else {
        this.localComments[experienceId].unshift(newComment);
      }
    } else {
      this.localComments[experienceId].unshift(newComment);
    }

    return {
      success: true,
      data: newComment,
    };
  }

  /**
   * Like a comment
   */
  async toggleCommentLike(commentId: string): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post(`/comments/${commentId}/like`);
    }

    return {
      success: true,
      data: { isLiked: true, likesCount: 1 },
    };
  }

  /**
   * Report inappropriate comment
   */
  async reportComment(commentId: string, reason: string): Promise<ApiResponse<{ reported: boolean }>> {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.post(`/comments/${commentId}/report`, { reason });
    }

    return {
      success: true,
      data: { reported: true },
      message: 'Thank you. Our moderation team has received the report.',
    };
  }
}

export const commentService = new CommentService();
