import { defineStore } from 'pinia';
import {addMarkerToMap} from "@/utils/mapUtils.js";
import {markerService} from "@/services/markerService.js";

export const useMarkersStore = defineStore('markersStore', {
    state:
        () => ({
            markers: [],
            error: null,
        }),
    getters: {
    },
    actions: {
        async fetchAllMarkers() {
            this.error = null;

            try {
                const service = markerService();
                const markersData = await service.getAllMarkers();

                if (markersData.success) {
                    this.clearMarkers();
                    for (const marker of markersData.markers) {
                        addMarkerToMap(marker);
                        this.addMarker(marker);
                    }
                }

            } catch (error) {
                throw error;
            }
        },

        async fetchMarkersArea(mapBounds, mapItemIds) {
            this.error = null;

            try {
                const service = markerService();
                // TODO: This is a placeholder for the actual service call
                const result = await service.getMarkersMock(mapBounds, mapItemIds);
                // const result = await service.getMarkersByArea(mapBounds, mapItemIds);
                for (const marker of result.markers) {
                    addMarkerToMap(marker);
                    this.addMarker(marker);
                }
            } catch (error) {
                throw error;
            }
        },

        addMarker(marker) {
            if (!marker || !marker.markerId) {
                return;
            }
            if (!this.getMarkerById(marker.markerId)) {
                this.markers.push(marker);
            } else {
            }
        },

        updateMarker(marker) {
            const index = this.markers.findIndex(marker => marker.markerId === marker.markerId);
            if (index !== -1) {
                this.markers[index] = marker;
            } else {
            }
        },

        deleteMarker(markerId) {
            const index = this.markers.findIndex(marker => marker.markerId === markerId);
            if (index !== -1) {
                this.markers.splice(index, 1);
            } else {
            }
        },

        clearMarkers() {
            this.markers = [];
        },

        getMarkerById(markerId) {
            return this.markers.find(marker => marker.markerId === markerId);
        },

        getMarkers() {
            return this.markers;
        },
    },
});