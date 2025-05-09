import { defineStore } from 'pinia';
import {markerService} from "@/services/markerService.js";
import {useMarkersStore} from "@/stores/markersStore.js";

export const useMarkerStore = defineStore('markerStore', {

    state: () => ({
        marker: {
            markerId: null,
            address: '',
            lat: null,
            lng: null,
            type: '',
            description: '',
        },
        error: null,
    }),
    getters: {
        getMarker: (state) => {
            return state.marker;
        },
        getMarkerId: (state) => {
            return state.marker.markerId;
        },
    },

    actions: {
        async fetchMarkerDetailsById(markerId) {
            this.error = null;
            try {
                const service = markerService();
                const markerData = await service.getMarkerDetailsById(markerId);

                if (markerData.success) {
                    this.setRestOfMarker(markerData);
                }

            } catch (error) {
                console.error('Error fetching marker details:', error);
                throw error;
            }
        },

        setBasicMarker(markerData) {
            this.markerId = markerData.markerId;
            this.lat = markerData.lat;
            this.lng = markerData.lng;
            this.type = markerData.type;
        },

        setRestOfMarker(markerData) {
            this.address = markerData.address;
            this.description = markerData.description;
        },

        setMarker(markerData) {
            this.markerId = markerData.markerId;
            this.address = markerData.address;
            this.lat = markerData.lat;
            this.lng = markerData.lng;
            this.type = markerData.type;
            this.description = markerData.description;
        },

        async saveMarker(marker) {
            try {
                const service = markerService();
                const markersStore = useMarkersStore();

                const markerId = marker.markerId || null;
                const markerData = {
                    address: marker.address,
                    coordinates: {
                        latitude: marker.lat,
                        longitude: marker.lng,
                    },
                    type: marker.type,
                    description: marker.description,
                };
                let result
                if (markerId) {
                    result = await service.updateMarker(markerData, markerId);
                    if (result.success) {
                        markersStore.updateMarker(markerData);
                    }
                } else {
                    result = await service.createMarker(markerData);
                    if (result.success) {
                        markerData.markerId = result.markerId;
                        markersStore.addMarker(markerData);
                    }
                }
                return result;
            } catch (error) {
                console.error('Error saving marker', error);
                throw error;
            }
        },

        async deleteMarker(markerId) {
            if (markerId) {
                console.warn('Cannot delete: No item ID provided');
                return;
            }

            this.error = null;
            try {
                const markersStore = useMarkersStore();
                const service = markerService();
                const result = await service.deleteMarker(markerId);
                if (result.success) {
                    markersStore.deleteMarker(markerId);
                    this.clearMarker();
                }
                return result;

            } catch (error) {
                console.error('Error deleting marker', error);
                throw error;
            }
        },

        clearMarker() {
            this.markerId = null;
            this.address = '';
            this.lat = null;
            this.lng = null;
            this.type = '';
            this.description = '';
        },
    },
})