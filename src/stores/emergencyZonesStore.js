import { defineStore } from 'pinia';

export const useEmergencyZonesStore = defineStore('emergencyZonesStore', {
    state:
        () => ({
            emergencyZones: [],
        }),
    getters: {
        getEmergencyZones: (state) => state.emergencyZones,
        getEmergencyZoneById: (state) => (id) => {
            return state.emergencyZones.find(zone => zone.zoneId === id);
        }
    },
    actions: {
        async fetchAllEmergencyZones() {
          // Fetch all emergency zones from the service
        },

        async fetchEmergencyZonesArea(mapAreaData, zoneIds) {
            this.error = null;

            try {
                const service = emergencyZoneService();
                // TODO: This is a placeholder for the actual service call
                const zones = await service.getEmergencyZonesMock(mapAreaData, zoneIds);

                if (zones && Array.isArray(zones)) {
                    for (const zone of zones) {

                    }
                    return {success: true};
                }

            } catch (error) {
                console.error('Error fetching emergency zones');
                throw error;
            }
        },

        async addEmergencyZone(emergencyZone) {
            if (!emergencyZone || !emergencyZone.zoneId || !emergencyZone.coordinates || emergencyZone.coordinates.length < 3) {
                console.error('Invalid emergency zone data');
                return;
            }
            this.emergencyZones.push(emergencyZone);
        },

        clearEmergencyZones() {
            this.emergencyZones = [];
        },
    },

});