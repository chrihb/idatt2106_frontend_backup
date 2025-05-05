import { defineStore } from 'pinia';
import L from 'leaflet';
import { useMapStore } from "@/stores/mapStore.js";
import {createCustomMarkerIcon, createMarkerPopup} from "@/utils/mapUtils.js";

export const useMarkerStore = defineStore('markerStore', {
    state:
        () => ({
            markers: [],
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
        getMarkersByLocation: (state) => (location) => {
            return state.markers.filter(marker => marker.options.location === location);
        }
    },
    actions: {


        // Remove a marker from the map
        removeMarker(id) {
            const mapStore = useMapStore();
            const markerIndex = this.markers.find(m => m.options.id === id);
            if (!markerIndex !== -1) {
                const marker = this.markers[markerIndex];
                // Remove the marker from the layerGroup
                for (const type in mapStore.layerGroup) {
                    if (mapStore.layerGroup[type].hasLayer(marker)) {
                        mapStore.layerGroup[type].removeLayer(marker);
                        break;
                    }
                }
                // Remove the marker from the markers array
                this.markers.splice(markerIndex, 1);
            } else {
                console.error(`Marker with ${id} not found.`);
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: window.localStorage,
            },
        ],
    }
});