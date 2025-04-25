import {emergencyItemService} from '@/services/emergencyItemService';
import {defineStore} from "pinia";

// Store for managing the collection of emergency items
export const useEmergencyItemsStore = defineStore("items", {
  state: () => ({
    items: [],
  }),

  getters: {
    getItemsByCategory: (state) => (categoryId) => {
      return state.items.filter(item => item.categoryId === categoryId);
    },

    getItemById: (state) => (itemId) => {
      return state.items.find(item => item.id === itemId);
    },

    itemsCount: (state) => state.items.length,
  },

  actions: {
    async fetchAllItems() {
      try {
        const service = emergencyItemService();
        this.items = await service.getEmergencyItems();
        return this.items;
      } catch (error) {
        console.error('Error fetching all emergency items:');
      }
    },

    async fetchItemsByCategory(categoryId) {
      try {
        const service = emergencyItemService();
        const categoryItems = await service.getEmergencyItemByCategoryId(categoryId);

        this.items = this.items.filter(item => item.categoryId !== categoryId);
        this.items = [...this.items, ...categoryItems];

        return categoryItems;
      } catch (error) {
        console.error('Error fetching items for category');
      }
    },

    async addItem(itemData) {
      try {
        const service = emergencyItemService();
        const newItem = await service.createEmergencyItem(itemData);
        this.items.push(newItem);
        return newItem;
      } catch (error) {
        console.error('Error creating emergency item');
        throw error;
      }
    },

    async updateItem(itemData) {
      try {
        const service = emergencyItemService();
        const updatedItem = await service.updateEmergencyItem(itemData);

        const index = this.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          this.items[index] = updatedItem;
        }

        return updatedItem;
      } catch (error) {
        console.error('Error updating item');
        throw error;
      }
    },

    async deleteItem(itemId) {
      try {
        const service = emergencyItemService();
        await service.deleteEmergencyItem(itemId);

        this.items = this.items.filter(item => item.id !== itemId);
        return true;
      } catch (error) {
        console.error('Error deleting item');
        throw error;
      }
    },

    async initializeStore() {
      await this.fetchAllItems();
    }
  }
});