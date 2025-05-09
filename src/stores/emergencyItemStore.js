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
    householdIds: [],
  }),

  actions: {
    async fetchItemById(id) {
      try {
        const service = emergencyItemService();
        const item = await service.getEmergencyItemById(id);
        this.setItemData(item);
        return item;
      } catch (error) {
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
      this.householdIds = [item.householdIds];
    },

    resetState() {
      this.itemId = 0;
      this.name = "";
      this.amount = 0;
      this.categoryId = 0;
      this.unitId = 0;
      this.expirationDate = null;
      this.householdIds = [];
    },

    async saveItem() {
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
          expirationDate: expirationDateStr,
          householdIds: [this.householdIds]
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
        throw error;
      }
    },

    async deleteItem() {
      if (!this.itemId) {
        return;
      }

      try {
        const service = emergencyItemService();
        const result = await service.deleteEmergencyItem(this.itemId);
        this.resetState();
        return result;
      } catch (error) {
        throw error;
      }
    }
  }
});