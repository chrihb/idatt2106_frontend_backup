import { defineStore } from 'pinia';
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {addEmergencyZoneToMap} from "@/utils/mapUtils.js";

export const useEmergencyZonesStore = defineStore('emergencyZonesStore', {
    state:
        () => ({
            emergencyZones: [],
            error: null,
        }),
    actions: {
        async fetchAllEmergencyZones() {
            this.error = null;

            try {
                const service = emergencyZoneService();
                const emergencyZonesData = await service.getAllEmergencyZones();

                if (emergencyZonesData.success) {
                    this.clearEmergencyZones();
                    for (const zone of emergencyZonesData.zones) {
                        addEmergencyZoneToMap(zone);
                        this.addEmergencyZone(zone);
                    }
                }

            } catch (error) {
                console.error('Error fetching all emergency zones:', error);
                throw error;
            }
        },

        async fetchEmergencyZonesArea(mapBounds, zoneIds) {
            this.error = null;

            try {
                const service = emergencyZoneService();
                // TODO: This is a placeholder for the actual service call
                const result = await service.getEmergencyZonesMock(mapBounds, zoneIds);
                for (const zone of result.zones) {
                    addEmergencyZoneToMap(zone);
                    this.addEmergencyZone(zone);
                }

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
            } else {
                console.error('Emergency zone already exists in the store');
            }
        },

        updateEmergencyZone(emergencyZone) {
            const index = this.emergencyZones.findIndex(zone => zone.zoneId === emergencyZone.zoneId);
            if (index !== -1) {
                this.emergencyZones[index] = emergencyZone;
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