import { defineStore } from 'pinia';
import {markerService} from "@/services/markerService.js";
import {useMarkersStore} from "@/stores/markersStore.js";
import {useMapStore} from "@/stores/mapStore.js";
import {addMarkerToMap, removeMarkerFromMap, updateEmergencyZoneOnMap, updateMarkerOnMap} from "@/utils/mapUtils.js";

export const useMarkerStore = defineStore('markerStore', {

    state: () => ({
        marker: {
            markerId: null,
            name: '',
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
    },

    actions: {
        async fetchMarkerDetailsById(markerId) {
            this.error = null;
            try {
                const markersStore = useMarkersStore();
                const marker = markersStore.getMarkerById(markerId);
                if (marker.description &&
                    marker.name &&
                    marker.address) {
                    return marker
                } else {
                    const service = markerService();
                    const markerData = await service.getMarkerDetailsById(markerId);
                    if (markerData) {
                        this.setRestOfMarker(markerData);
                    }
                    return marker;
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
            this.name = markerData.name;
            this.address = markerData.address;
            this.description = markerData.description;
        },

        setMarker(markerData) {
            this.name = markerData.name;
            this.markerId = markerData.markerId;
            this.address = markerData.address;
            this.lat = markerData.lat;
            this.lng = markerData.lng;
            this.type = markerData.type;
            this.description = markerData.description;
        },

        setMarkerFromBackend(markerData) {
            const marker = {
                markerId: markerData.id,
                name: markerData.name,
                address: markerData.address,
                type: markerData.type,
                lat: markerData.coordinates.latitude,
                lng: markerData.coordinates.longitude,
                description: markerData.description,
            }
            return marker;
        },

        async saveMarker(marker) {
            try {
                const service = markerService();
                const markersStore = useMarkersStore();
                console.log(marker);
                const markerId = marker.markerId || null;
                const markerData = {
                    name: marker.name,
                    description: marker.description,
                    address: marker.address,
                    type: marker.type,
                    coordinates: {
                        latitude: marker.lat,
                        longitude: marker.lng,
                    },
                };
                let result
                if (markerId) {
                    result = await service.updateMarker(markerData, markerId);
                    markersStore.updateMarker(markerData.value);
                    updateMarkerOnMap(markerData.value)
                } else {
                    result = await service.createMarker(markerData);
                    if (result.success) {
                        markerData.markerId = result.markerId;
                        markersStore.addMarker(markerData.value);
                        addMarkerToMap(markerData.value)
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
                removeMarkerFromMap(markerId)
                markersStore.deleteMarker(markerId);
                return result;

            } catch (error) {
                console.error('Error deleting marker', error);
                throw error;
            }
        },

        clearMarker() {
            this.markerId = null;
            this.name = '';
            this.address = '';
            this.lat = null;
            this.lng = null;
            this.type = '';
            this.description = '';
        },
    },
})