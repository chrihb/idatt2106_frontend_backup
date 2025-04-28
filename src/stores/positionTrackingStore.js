import L from "leaflet";
import { defineStore } from "pinia";
import { useMapStore } from "@/stores/mapStore.js";
import {watchUserPosition} from "@/services/geoLocationService.js";

export const usePositionTrackingStore = defineStore("positionTrackingStore", {
    state: () => ({
        map: null,
        latitude: null,
        longitude: null,
        watchId: null,
    }),
    getters : {
        getLatitude: (state) => state.latitude,
        getLongitude: (state) => state.longitude,
        getCanTrack: (state) => state.canTrack,
    },
    actions: {
        // Start tracking the user's location
        startTracking() {
            const mapStore = useMapStore();
            let marker = null;
            this.watchId = watchUserPosition(
                (position) => {
                    this.setCoordinates(position.coords.latitude, position.coords.longitude)
                    if (marker === null) {

                        // Create a new layer group for the user's location
                        if (!mapStore.layerGroup["UserLocation"]) {
                            mapStore.layerGroup["UserLocation"] = L.layerGroup().addTo(mapStore.map);
                        }
                        // Create a new marker at the user's location
                        marker = L.marker([this.latitude, this.longitude]);
                        // Add the marker to the layer group
                        mapStore.layerGroup["UserLocation"].addLayer(marker);
                        // Center the map on the user's location
                        this.centerMapOnUser()
                    } else {
                        // Update the marker's position
                        marker.setLatLng([this.latitude, this.longitude]);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        },

        // Stop tracking the user's location
        stopTracking() {
            const mapStore = useMapStore();

            // Reset the user's location
            this.setCoordinates(null, null);
            if (mapStore.layerGroup["UserLocation"]) {
                mapStore.layerGroup["UserLocation"].clearLayers();
                mapStore.map.removeLayer(mapStore.layerGroup["UserLocation"]);
                delete mapStore.layerGroup["UserLocation"];
            }

            // Clear the geolocation watch if it exists
            if (this.watchId) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
        },

        // Toggle tracking the user's location
        toggleTracking() {
            if (this.canTrack) {
                this.stopTracking();
            } else {
                this.startTracking();
            }
        },

        // Set the coordinates of the user's location
        setCoordinates(latitude, longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        },

        // Center the map on the user's location
        centerMapOnUser() {
            const mapStore = useMapStore();
            if (this.latitude !== null && this.longitude !== null) {
                mapStore.map.setView([this.latitude, this.longitude], 15);
            } else {
                console.error("User location is not available.");
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
            },
        ],
    }
});