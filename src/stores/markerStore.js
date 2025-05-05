import { defineStore } from 'pinia';
import {markerService} from "@/services/markerService.js";
import {useMarkerStore} from "@/stores/markersStore.js";

export const useMarkersStore = defineStore('markersStore', {

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

        async saveMarker(markerData) {
            try {
                const service = markerService();
                const markersStore = useMarkerStore();

                const markerData = {
                    markerId: this.markerId || undefined,
                    address: this.address,
                    lat: this.lat,
                    lng: this.lng,
                    type: this.type,
                    description: this.description,
                };
                let result
                if (this.markerId) {
                    result = await service.updateMarker(markerData);
                    markersStore.updateMarker(result);
                } else {
                    result = await service.createMarker(markerData);
                    this.markerId = result.markerId;
                    markersStore.addMarker(result);
                }
                return result;
            } catch (error) {
                console.error('Error saving marker', error);
                throw error;
            }
        },

        async deleteMarker() {
            if (!this.markerId) {
                console.warn('Cannot delete: No item ID provided');
                return;
            }

            this.error = null;
            try {
                const markersStore = useMarkersStore();
                const service = markerService();
                const result = await service.deleteMarker(this.markerId);
                markersStore().deleteMarker(this.markerId);
                this.clearMarker();
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

        centerMapOnMarker(id) {
            const mapStore = useMapStore();
            const marker = this.getMarkerById(id);
            if (marker) {
                mapStore.centerMapOnSpecificLocation(marker.getLatLng().lat, marker.getLatLng().lng);
            } else {
                console.error(`Marker with ${id} not found.`);
            }
        }
    },
})