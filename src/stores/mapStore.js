import {defineStore} from 'pinia';
import L from 'leaflet';
import {usePositionTrackingStore} from "@/stores/positionTrackingStore.js";

export const useMapStore = defineStore('mapStore', {
    state: () => ({
        map: null,
        layerGroup: {},
    }),
    getters: {
        getLayerGroup: (state) => state.layerGroup,
        getMap: (state) => state.map,
    },
    actions: {
        // Initialize the map
        initMap() {
            const positionTrackingStore = usePositionTrackingStore()
            // set its view to a specific location
            this.map = L.map('map').setView([63.422464, 10.410394], 15);

            // Add a tile layer to the map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            //Mock tracking
            positionTrackingStore.startTracking();
        }
    }
});