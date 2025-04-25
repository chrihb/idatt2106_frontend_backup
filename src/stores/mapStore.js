import {defineStore} from 'pinia';
import L from 'leaflet';
import {useMarkerStore} from "@/stores/markerStore.js";

export const useMapStore = defineStore('mapStore', {
    state: () => ({
        map: null,
        latitude: null,
        longitude: null,
        canTrack: false,
        layerGroup: {},
    }),
    getters: {
        getLatitude: (state) => state.latitude,
        getLongitude: (state) => state.longitude,
        getCanTrack: (state) => state.canTrack,
        getLayerGroup: (state) => state.layerGroup,
        getMap: (state) => state.map,
    },
    actions: {
        // Initialize the map
        initMap() {
            const markerStore = useMarkerStore();
            // set its view to a specific location
            this.map = L.map('map').setView([63.422464, 10.410394], 15);

            // Add a tile layer to the map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);


            //TODO: Fetch markers from the server
            ///Example markers
            markerStore.addMarker(1, 63.423494,  10.424354, "Hjertestarter", "Location 1", "Address 1", "Description 1");
            markerStore.addMarker(2, 63.421424, 10.400834, "Bunker", "Location 2", "Address 2", "Description 2");
            markerStore.addMarker(3, 63.421434, 10.440124, "Hjertestarter", "Location 3", "Address 3", "Description 3");
        },
        // Start tracking the user's location
        startTracking() {
            this.canTrack = true;
            let marker = null;

            if ("geolocation" in navigator) {
                this.watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        this.setCoordinates(position.coords.latitude, position.coords.longitude)
                        if (marker === null) {

                            // Create a new layer group for the user's location
                            if (!this.layerGroup["UserLocation"]) {
                                this.layerGroup["UserLocation"] = L.layerGroup().addTo(this.map);
                            }
                            // Create a new marker at the user's location
                            marker = L.marker([this.latitude, this.longitude]);
                            // Add the marker to the layer group
                            this.layerGroup["UserLocation"].addLayer(marker);
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
            } else {
                console.error("Geolocation is not supported by your browser.");
            }
        },

        // Stop tracking the user's location
        stopTracking() {
            if (this.canTrack) {
                // Reset the user's location
                this.canTrack = false;
                this.setCoordinates(null, null);
                if (this.layerGroup["UserLocation"]) {
                    this.layerGroup["UserLocation"].clearLayers();
                }
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
            if (this.canTrack) {
                if (this.latitude !== null && this.longitude !== null) {
                    this.map.setView([this.latitude, this.longitude], 15);
                } else {
                    console.error("User location is not available.");
                }
            } else {
                alert("Tracking is diabled. Please enable tracking to center the map on your location.");
            }

        }
    }
});