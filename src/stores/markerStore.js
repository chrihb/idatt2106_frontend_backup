import { defineStore } from 'pinia';
import L from 'leaflet';
import { useMapStore } from "@/stores/mapStore.js";
import {createCustomMarkerIcon, createMarkerPopup} from "@/utils/markerUtils.js";

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
        // Add a marker to the map
        addMarker(markerData) {
            const mapStore = useMapStore();
            if (this.getMarkerById(markerData.id)) {
                return;
            }
            const mapIcon = createCustomMarkerIcon(markerData.type)

            // Create a marker with the given data
            const marker = L.marker(
                [markerData.lat, markerData.lng],
                {icon: mapIcon})
                .bindPopup(createMarkerPopup(
                    markerData.type,
                    markerData.location,
                    markerData.address,
                    markerData.description
                ));

            // Check if the layerGroup for the type exists, if not create it
            if (!mapStore.layerGroup[markerData.type]) {
                mapStore.layerGroup[markerData.type] = L.layerGroup().addTo(mapStore.map);
            }
            // Add the marker to the appropriate layerGroup
            mapStore.layerGroup[markerData.type].addLayer(marker);
            //Add the marker to markers array
            this.markers.push(marker);
        },

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
    }
});