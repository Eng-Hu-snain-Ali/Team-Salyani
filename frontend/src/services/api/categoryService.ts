import { apiClient } from './apiClient';
import { CATEGORIES } from '../../constants';

class CategoryService {
  async getCategories() {
    if (apiClient.isRemoteConfigured()) {
      return apiClient.get('/categories');
    }
    return {
      success: true,
      data: CATEGORIES,
    };
  }
}

export const categoryService = new CategoryService();
