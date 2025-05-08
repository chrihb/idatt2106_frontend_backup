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
        async fetchAllMarkers(addToMap = true) {
            this.error = null;

            try {
                const service = markerService();
                //const markersData = await service.getAllMarkers();
                const markersData = await service.getAllMarkersMock();

                if (markersData.success) {
                    this.clearMarkers();
                    for (const marker of markersData.markers) {
                        if (addToMap) {
                            addMarkerToMap(marker);
                        }
                        this.addMarker(marker);
                    }
                }

            } catch (error) {
                console.error('Error fetching all emergency zones:', error);
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
                console.error('Error fetching markers');
                throw error;
            }
        },

        addMarker(marker) {
            if (!marker || !marker.markerId) {
                console.error('Invalid marker data');
                return;
            }
            if (!this.getMarkerById(marker.markerId)) {
                this.markers.push(marker);
            } else {
                console.error('Marker already exists in the store');
            }
        },

        updateMarker(marker) {
            const index = this.markers.findIndex(marker => marker.markerId === marker.markerId);
            if (index !== -1) {
                this.markers[index] = marker;
            } else {
                console.error('Marker not found in the store');
            }
        },

        deleteMarker(markerId) {
            const index = this.markers.findIndex(marker => marker.markerId === markerId);
            if (index !== -1) {
                this.markers.splice(index, 1);
            } else {
                console.error('Marker not found in the store');
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