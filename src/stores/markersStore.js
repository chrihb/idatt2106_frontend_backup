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