import {emergencyItemService} from '@/services/emergencyItemService.js';
import {defineStore} from "pinia";

// Define the store for a single emergency item (active/current item)
export const useEmergencyItemStore = defineStore("emergencyItem", {
  state: () => ({
    itemId: 0,
    name: "",
    amount: 0,
    categoryId: 0,
    unitId: 0,
    expirationDate: null,
  }),

  actions: {
    async fetchItemById(id) {
      this.error = null;

      try {
        const service = emergencyItemService();
        const item = await service.getEmergencyItemById(id);
        this.setItemData(item);
        return item;
      } catch (error) {
        console.error('Error fetching item by ID');
        throw error;
      }
    },

    setItemData(item) {
      this.itemId = item.id || 0;
      this.name = item.name;
      this.amount = item.amount;
      this.categoryId = item.categoryId;
      this.unitId = item.unitId;
      this.expirationDate = item.expirationDate ? new Date(item.expirationDate)
          : null;
    },

    resetState() {
      this.itemId = 0;
      this.name = "";
      this.amount = 0;
      this.categoryId = 0;
      this.unitId = 0;
      this.expirationDate = null;
      this.error = null;
    },

    async saveItem() {
      this.error = null;

      try {
        const service = emergencyItemService();

        let expirationDateStr = null;
        if (this.expirationDate) {
          expirationDateStr = this.expirationDate instanceof Date
              ? this.expirationDate.toISOString().split('T')[0]
              : this.expirationDate;
        }

        const itemData = {
          id: this.itemId || undefined,
          name: this.name,
          amount: this.amount,
          categoryId: this.categoryId,
          unitId: this.unitId,
          expirationDate: expirationDateStr
        };

        let result;
        if (!this.itemId) {
          result = await service.createEmergencyItem(itemData);
          this.itemId = result.id;
        } else {
          result = await service.updateEmergencyItem(itemData);
        }

        return result;
      } catch (error) {
        console.error('Error saving item');
        throw error;
      }
    },

    async deleteItem() {
      if (!this.itemId) {
        console.warn('Cannot delete: No item ID provided');
        return;
      }

      this.error = null;

      try {
        const service = emergencyItemService();
        const result = await service.deleteEmergencyItem(this.itemId);
        this.resetState();
        return result;
      } catch (error) {
        console.error('Error deleting item');
        throw error;
      }
    }
  }
});