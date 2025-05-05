import { defineStore } from 'pinia';
import L from 'leaflet';
import { useMapStore } from "@/stores/mapStore.js";
import {addEmergencyZoneToMap, addMarkerToMap, createCustomMarkerIcon, createMarkerPopup} from "@/utils/mapUtils.js";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {markerService} from "@/services/markerService.js";

export const useMarkerStore = defineStore('markerStore', {
    state:
        () => ({
            markers: [],
            error: null,
        }),
    getters: {
        getMarkers: (state) => state.markers,
        getMarkerById: (state) => (id) => {
            return state.markers.find(marker => marker.options.id === id);
        },
        getMarkerByCoordinates: (state) => (latitude, longitude) => {
            return state.markers.find(marker => marker.getLatLng().lat === latitude && marker.getLatLng().lng === longitude);
        },
        getMarkersByType: (state) => (type) => {
            return state.markers.filter(marker => marker.options.type === type);
        },
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