import {defineStore} from 'pinia';
import {ref} from 'vue';
import L from 'leaflet';

export const useMapStore = defineStore('mapStore', {
    state: () => ({
        map: ref(null),
        latitude: 0,
        longitude: 0,
        canTrack: false,
    }),
    getters: {
        getLatitude: (state) => state.latitude,
        getLongitude: (state) => state.longitude,
    },
    actions: {

        // Initialize the map
        initMap() {
            // set its view to a specific location
            this.map = L.map('map').setView([63.446827, 10.421906], 15);

            // Add a tile layer to the map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        },
        // Start tracking the user's location
        startTracking() {
            let marker = null;

            if ("geolocation" in navigator) {
                navigator.geolocation.watchPosition(
                    (position) => {
                        this.setCoordinates(position.coords.latitude, position.coords.longitude)
                        if (marker === null) {
                            // Create a new marker at the user's location
                            marker = L.marker([this.latitude, this.longitude]).addTo(this.map);
                            // Center the map on the user's location
                            this.map.setView([this.latitude, this.longitude], 15);
                        } else {
                            // Update the marker's position
                            marker.setLatLng([this.latitude, this.longitude]);
                        }
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by your browser.");
            }
        },
        // Set the coordinates of the user's location
        setCoordinates(latitude, longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        },
        // Toggle the tracking state
        toggleTracking() {
            this.canTrack = !this.canTrack;
        }
    },
});