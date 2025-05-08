import {emergencyItemService} from '@/services/emergencyItemService.js';
import {defineStore} from "pinia";

export const useUnitsStore = defineStore("units", {
  state: () => ({
    units: [],
  }),

  getters: {
    getUnitById: (state) => (unitId) => {
      return state.units.find(unit => unit.id === unitId);
    },

    getUnitName: (state) => (unitId, locale = 'en') => {
      const unit = state.units.find(unit => unit.id == Number(unitId));

      if (!unit) {
        return 'Unknown Unit';
      }
      return locale === 'nb-NO' ? unit.norwegianName : unit.englishName;
    },
  },

  actions: {
    async fetchUnits() {
      this.error = null;

      try {
        const service = emergencyItemService();
        this.units = await service.getEmergencyItemUnits();
      } catch (error) {
        console.error('Error fetching emergency item units');
      }
    }
  }
});