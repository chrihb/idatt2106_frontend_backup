import {defineStore} from "pinia";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {removeEmergencyZoneFromMap} from "@/utils/mapUtils.js";
import {integer} from "@vee-validate/rules";


export const useEmergencyZoneStore = defineStore('emergencyZone', {
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
        },
        error: null,
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

        async saveEmergencyZone(zoneData) {
            try {
                const service = emergencyZoneService();
                const emergencyZonesStore = useEmergencyZonesStore();
                console.log(zoneData.value);
                const emergencyZoneData = {
                    name: zoneData.value.name,
                    description: zoneData.value.description,
                    address: zoneData.value.address,
                    severityLevel: parseInt(zoneData.value.level, 10),
                    type: zoneData.value.type,
                    coordinates: {
                        latitude: zoneData.value.lat,
                        longitude: zoneData.value.lng,
                    },
                    polygonCoordinateList: JSON.stringify(zoneData.value.coordinates)
                };
                const zoneId = zoneData.value.zoneId || null;
                console.log(emergencyZoneData);
                let result
                if (zoneId) {
                    result = await service.updateEmergencyZone(emergencyZoneData, emergencyZoneData.zoneId);
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
                const emergencyZonesStore = useEmergencyZonesStore();
                const service = emergencyZoneService();
                const result = await service.deleteEmergencyZone(this.zoneId);

                removeEmergencyZoneFromMap(this.zoneId);
                emergencyZonesStore.deleteEmergencyZone(this.zoneId);
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