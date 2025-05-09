import { defineStore } from 'pinia';
import {addMarkerToMap, updateMarkerOnMap} from "@/utils/mapUtils.js";
import {markerService} from "@/services/markerService.js";
import {useMapStore} from "@/stores/mapStore.js";
import {useMarkerStore} from "@/stores/markerStore.js";

export const useMarkersStore = defineStore('markersStore', {
    state:
        () => ({
            markers: [],
            error: null,
        }),
    getters: {
    },
    actions: {
        async fetchAllMarkers(addToMap = true) {
            this.error = null;

            try {
                const service = markerService();
                const markerStore = useMarkerStore();

                const markersData = await service.getAllMarkers();


                if (markersData) {
                    this.clearMarkers();
                    for (const mrkrData of markersData) {
                        const marker = markerStore.setMarkerFromBackend(mrkrData);
                        if (addToMap) {
                            addMarkerToMap(marker);
                        }
                        this.addMarker(marker);
                    }
                    markerStore.clearMarker()
                }

            } catch (error) {
                throw error;
            }
        },

        async fetchMarkersArea(mapBounds, addToMap = true) {
            this.error = null;

            try {
                const service = markerService();
                const mapStore = useMapStore();
                const markerStore = useMarkerStore();
                const result = await service.getMarkersByArea(mapBounds, mapStore.getMapItemIds());
                for (const marker of result) {
                    const mrkr = markerStore.setMarkerFromBackend(marker);
                    if (addToMap) {
                        addMarkerToMap(mrkr);
                    }
                    this.addMarker(mrkr);
                }
                markerStore.clearMarker()
            } catch (error) {
                throw error;
            }
        },

        addMarker(marker) {
            if (!marker || !marker.markerId) {
                return;
            }
            if (!this.getMarkerById(marker.markerId)) {
                this.markers.push(marker);
            }
        },

        updateMarker(marker) {
            const index = this.markers.findIndex(marker => marker.markerId === marker.markerId);
            if (index !== -1) {
                this.markers[index] = marker;
                updateMarkerOnMap(marker)
            }
        },

        deleteMarker(markerId) {
            const index = this.markers.findIndex(marker => marker.markerId === markerId);
            if (index !== -1) {
                this.markers.splice(index, 1);
            }
        },

        clearMarkers() {
            this.markers = [];
        },

        getMarkerById(markerId) {
            return this.markers.find(marker => marker.markerId === markerId);
        },

        getMarkers() {
            return this.markers;
        },
    },
});