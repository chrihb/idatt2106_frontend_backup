import {defineStore} from "pinia";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";


export const emergencyZoneStore = defineStore('emergencyZone', {
    state: () => ({
        emergencyZone: {
            zoneId: null,
            name: '',
            address: '',
            lat: 0,
            lng: 0,
            type: '',
            level: 0,
            description: '',
            coordinates: [],
        }
    }),
    getters: {
        getEmergencyZone: (state) => {
            return state.emergencyZone;
        },
        getEmergencyZoneId: (state) => {
            return state.emergencyZone.zoneId;
        },
    },
    actions: {
        async fetchEmergencyZoneDetailsById(zoneId) {
            this.error = null;
            try {
                const service = emergencyZoneService();
                const emergencyZoneData = await service.getEmergencyZoneDetailsById(zoneId);

                if (emergencyZoneData.success) {
                    this.setRestOfEmergencyZone(emergencyZonedata);
                }

            } catch (error) {
                console.error('Error fetching emergency zone details:', error);
                throw error;
            }
        },

        setBasicEmergencyZone(emergencyZoneData) {
            this.zoneId = emergencyZoneData.zoneId;
            this.lat = emergencyZoneData.lat;
            this.lng = emergencyZoneData.lng;
            this.type = emergencyZoneData.type;
            this.level = emergencyZoneData.level;
            this.coordinates = emergencyZoneData.coordinates;
        },

        setRestOfEmergencyZone(emergencyZoneData) {
            this.name = emergencyZoneData.name;
            this.address = emergencyZoneData.address;
            this.description = emergencyZoneData.description;
        },

        setEmergencyZone(emergencyZoneData) {
            this.zoneId = emergencyZoneData.zoneId;
            this.name = emergencyZoneData.name;
            this.address = emergencyZoneData.address;
            this.lat = emergencyZoneData.lat;
            this.lng = emergencyZoneData.lng;
            this.type = emergencyZoneData.type;
            this.level = emergencyZoneData.level;
            this.description = emergencyZoneData.description;
            this.coordinates = emergencyZoneData.coordinates;

        },

        async saveEmergencyZone() {
            try {
                const service = emergencyZoneService();
                const emergencyZonesStore = useEmergencyZonesStore();

                const emergencyZoneData = {
                    zoneId: this.zoneId || undefined,
                    name: this.name,
                    address: this.address,
                    lat: this.lat,
                    lng: this.lng,
                    type: this.type,
                    level: this.level,
                    description: this.description,
                    coordinates: this.coordinates,
                };
                let result
                if (this.zoneId) {
                    result = await service.updateEmergencyZone(emergencyZoneData);
                    emergencyZonesStore.updateEmergencyZone(result);
                } else {
                    result = await service.createEmergencyZone(emergencyZoneData);
                    this.zoneId = result.zoneId;
                    emergencyZonesStore.addEmergencyZone(result);
                }
                return result;
            } catch (error) {
                console.error('Error saving emergency zone:', error);
                throw error;
            }
        },

        async deleteEmergencyZone() {
            if (!this.zoneId) {
                console.warn('Cannot delete: No item ID provided');
                return;
            }

            this.error = null;
            try {
                const emergencyZonesStore = emergencyZonesStore();
                const service = emergencyZoneService();
                const result = await service.deleteEmergencyZone(this.zoneId);
                emergencyZonesStore().deleteEmergencyZone(this.zoneId);
                this.clearEmergencyZoneState();
                return result;

            } catch (error) {
                console.error('Error deleting emergency zone:', error);
                throw error;
            }
        },

        clearEmergencyZoneState() {
            this.zoneId = null;
            this.name = '';
            this.address = '';
            this.lat = 0;
            this.lng = 0;
            this.type = '';
            this.level = 0;
            this.description = '';
            this.coordinates = [];
        },
    },

})