import { defineStore } from "pinia";
import { emergencyItemService } from '@/services/emergencyItemService.js';

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
  }),

  getters: {
    getCategoryById: (state) => (categoryId) => {
      return state.categories.find(category => category.id === categoryId);
    },

    getCategoryName: (state) => (categoryId, locale = 'en') => {
      const category = state.categories.find(cat => cat.id === categoryId);
      if (!category) {
        return 'Unknown Category';
      }
      console.log(locale)
      return locale === 'nb-NO' ? category.norwegianName : category.englishName;
    },
  },

  actions: {
    async fetchCategories() {
      try {
        const service = emergencyItemService();
        this.categories = await service.getEmergencyItemCategories();
      } catch (error) {
        console.error('Error fetching emergency item categories:', error);
      }
    }
  }
});