import {defineStore} from "pinia";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {addEmergencyZoneToMap, removeEmergencyZoneFromMap, updateEmergencyZoneOnMap} from "@/utils/mapUtils.js";


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
    },
    actions: {
        async fetchEmergencyZoneDetailsById(zoneId) {
            this.error = null;
            try {
                const emergencyZonesStore = useEmergencyZonesStore();
                const zone = emergencyZonesStore.getEmergencyZoneById(zoneId);
                if (zone.description &&
                    zone.name &&
                    zone.address) {
                    return zone;
                } else {
                    const service = emergencyZoneService();
                    const emergencyZoneData = await service.getEmergencyZoneDetailsById(zoneId);
                    if (emergencyZoneData) {
                        this.setRestOfEmergencyZone(emergencyZonedata);
                    }
                    return emergencyZoneData;
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

        setEmergencyZoneFromBackend(emergencyZoneData) {
            const emergencyZone = {
                zoneId: emergencyZoneData.id,
                name: emergencyZoneData.name,
                address: emergencyZoneData.address,
                lat: emergencyZoneData.coordinates.latitude,
                lng: emergencyZoneData.coordinates.longitude,
                type: emergencyZoneData.type,
                level: emergencyZoneData.severityLevel,
                description: emergencyZoneData.description,
                coordinates: JSON.parse(emergencyZoneData.polygonCoordinateList),
            }
            return emergencyZone;
        },

        async saveEmergencyZone(zoneData) {
            try {
                const service = emergencyZoneService();
                const emergencyZonesStore = useEmergencyZonesStore();

                const zoneId = zoneData.value.zoneId || null;
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

                let result
                if (zoneId) {
                    result = await service.updateEmergencyZone(emergencyZoneData, zoneId);
                    emergencyZonesStore.updateEmergencyZone(zoneData.value);
                    updateEmergencyZoneOnMap(zoneData.value)
                } else {
                    result = await service.createEmergencyZone(emergencyZoneData);
                    if (result.success) {
                        zoneData.zoneId = result.zoneId;
                        emergencyZonesStore.addEmergencyZone(zoneData.value);
                        addEmergencyZoneToMap(zoneData.value)
                    }
                }
                return result;
            } catch (error) {
                console.error('Error saving emergency zone:', error);
                throw error;
            }
        },

        async deleteEmergencyZone(zoneId) {
            if (!zoneId) {
                console.warn('Cannot delete: No item ID provided');
                return;
            }

            this.error = null;
            try {
                const emergencyZonesStore = useEmergencyZonesStore();
                const service = emergencyZoneService();
                const result = await service.deleteEmergencyZone(zoneId);
                removeEmergencyZoneFromMap(zoneId);
                emergencyZonesStore.deleteEmergencyZone(zoneId);
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