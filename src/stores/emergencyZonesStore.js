import { defineStore } from 'pinia';
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {addEmergencyZoneToMap, updateEmergencyZoneOnMap} from "@/utils/mapUtils.js";
import {useMapStore} from "@/stores/mapStore.js";
import {useEmergencyZoneStore} from "@/stores/emergencyZoneStore.js";

export const useEmergencyZonesStore = defineStore('emergencyZonesStore', {
    state:
        () => ({
            emergencyZones: [],
            error: null,
        }),
    actions: {
        async fetchAllEmergencyZones(addToMap = true) {
            this.error = null;

            try {
                const service = emergencyZoneService();
                const emergencyZoneStore = useEmergencyZoneStore();

                const emergencyZonesData = await service.getAllEmergencyZones();

                 if (emergencyZonesData) {
                    this.clearEmergencyZones();
                    for (const zoneData of emergencyZonesData) {
                        const zone = emergencyZoneStore.setEmergencyZoneFromBackend(zoneData);
                        if (addToMap) {
                            addEmergencyZoneToMap(zone);
                        }
                        this.addEmergencyZone(zone);
                    }
                    emergencyZoneStore.clearEmergencyZoneState();
                 }

            } catch (error) {
                console.error('Error fetching all emergency zones:', error);
                throw error;
            }
        },

        async fetchEmergencyZonesArea(mapBounds, addToMap = true) {
            this.error = null;

            try {
                const service = emergencyZoneService();
                const mapStore = useMapStore();
                const emergencyZoneStore = useEmergencyZoneStore();
                const result = await service.getEmergencyZonesByArea(mapBounds, mapStore.getMapItemIds());
                for (const zone of result) {
                    const emergencyZone = emergencyZoneStore.setEmergencyZoneFromBackend(zone);
                    if (addToMap) {
                        addEmergencyZoneToMap(emergencyZone);
                    }
                    this.addEmergencyZone(emergencyZone);
                }
                emergencyZoneStore.clearEmergencyZoneState();
            } catch (error) {
                console.error('Error fetching emergency zones');
                throw error;
            }
        },

        addEmergencyZone(emergencyZone) {
            if (!emergencyZone || !emergencyZone.zoneId || !emergencyZone.coordinates || emergencyZone.coordinates.length < 3) {
                console.error('Invalid emergency zone data');
                return;
            }
            if (!this.getEmergencyZoneById(emergencyZone.zoneId)) {
                this.emergencyZones.push(emergencyZone);
            }
        },

        updateEmergencyZone(emergencyZone) {
            const index = this.emergencyZones.findIndex(zone => zone.zoneId === emergencyZone.zoneId);
            if (index !== -1) {
                this.emergencyZones[index] = emergencyZone;
                updateEmergencyZoneOnMap(emergencyZone);
            } else {
                console.error('Emergency zone not found in the store');
            }
        },

        deleteEmergencyZone(zoneId) {
            const index = this.emergencyZones.findIndex(zone => zone.zoneId === zoneId);
            if (index !== -1) {
                this.emergencyZones.splice(index, 1);
            } else {
                console.error('Emergency zone not found in the store');
            }
        },

        clearEmergencyZones() {
            this.emergencyZones = [];
        },

        getEmergencyZoneById(zoneId) {
            return this.emergencyZones.find(zone => zone.zoneId === zoneId);
        },

        getEmergencyZones() {
            return this.emergencyZones;
        },
    },
});