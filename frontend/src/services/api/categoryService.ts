import { CATEGORIES } from '../../constants';

class CategoryService {
  async getCategories() {
    return {
      success: true,
      data: CATEGORIES,
    };
  }
}

export const categoryService = new CategoryService();
