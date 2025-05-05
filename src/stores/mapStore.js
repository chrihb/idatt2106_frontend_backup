import {defineStore} from 'pinia';
import L from 'leaflet';

export const useMapStore = defineStore('mapStore', {
    state: () => ({
        map: null,
        layerGroup: {},
        mapItemIds: [],
    }),
    getters: {
        getLayerGroup: (state) => state.layerGroup,
        getMap: (state) => state.map,
    },
    actions: {
        // Initialize the map
        initMap() {
            // Check if the map is already initialized
            if (this.map) {
                console.error("Map is already initialized");
                return
            }
            // set its view to a specific location
            this.map = L.map('map').setView([63.422464, 10.410394], 15);

            // Add a tile layer to the map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' +
                    ' ' +
                    '&copy; <a href="https://www.flaticon.com/" title="Icons">Icons created by Freepik - Flaticon</a>'
            }).addTo(this.map);
        },

        toggleLayerGroup(type) {
            if (this.layerGroup[type] && this.layerGroup[type] instanceof L.LayerGroup) {
                if (this.map.hasLayer(this.layerGroup[type])) {
                    this.map.removeLayer(this.layerGroup[type]);
                } else {
                    this.map.addLayer(this.layerGroup[type]);
                }
            }
        },

        getMapItemIds() {
            return this.mapItemIds;
        },

        setMapItemIds(mapItemIds) {
            this.mapItemIds = mapItemIds;
        },

        addMapItemId(mapItemId) {
            if (!this.mapItemIds.includes(mapItemId)) {
                this.mapItemIds.push(mapItemId);
            } else {
                console.error(`Map item ID ${mapItemId} already exists in the mapItemIds array.`);
            }
        },

        removeMapItemId(mapItemId) {
            const index = this.mapItemIds.indexOf(mapItemId);
            if (index > -1) {
                this.mapItemIds.splice(index, 1);
            } else {
                console.error(`Map item ID ${mapItemId} not found in the mapItemIds array.`);
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: window.sessionStorage,
            },
        ],
    }
});