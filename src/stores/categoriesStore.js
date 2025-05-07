import {emergencyItemService} from '@/services/emergencyItemService.js';
import {defineStore} from "pinia";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
  }),

  getters: {
    getCategoryById: (state) => (categoryId) => {
      return state.categories.find(category => category.id === categoryId);
    },

    getCategoryName: (state) => (categoryId) => {
      const category = state.categories.find(cat => cat.id === categoryId);
      if (!category) {
        return 'Unknown Category';
      }
      return category.name;
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