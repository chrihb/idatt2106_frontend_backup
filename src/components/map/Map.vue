<script setup>
import {onMounted, onUnmounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import {mockMarkersData} from "@/services/markerService.js";
import { useMarkerStore} from "@/stores/markerStore.js";
import {usePositionTrackingStore} from "@/stores/positionTrackingStore.js";
import {addEmergencyZoneToMap} from "@/utils/markerUtils.js";

const mapStore = useMapStore();
const markerStore = useMarkerStore();
const positionTrackingStore = usePositionTrackingStore();

onMounted(async () => {

  try {
    // Initialize the map
    mapStore.initMap();

    // Re-add existing markers from the store
    if (markerStore.markers) {
      markerStore.markers.forEach(marker => {
        const type = marker.options.type;
        if (!mapStore.layerGroup[type] || !(mapStore.layerGroup[type] instanceof L.LayerGroup)) {
          mapStore.layerGroup[type] = L.layerGroup().addTo(mapStore.map);
        }
        mapStore.layerGroup[type].addLayer(marker);
      });
    }

    // Start position tracking
    positionTrackingStore.startTracking();

    // Add event listenr for map movement
    mapStore.map.on('moveend', async () => {
      const bounds = mapStore.map.getBounds();
      const markersData = {
        northEast: bounds.getNorthEast(),
        southWest: bounds.getSouthWest(),
      };


      try {
        //TODO: Add request to fetch markers from the backend
        const result = await mockMarkersData()

        const emergencyZone = {
          type: 'Strømbrudd',
          coordinates: [
            [63.424494, 10.439154],
            [63.424694, 10.448154],
            [63.404494, 10.449154],
            [63.394494, 10.439154],
            [63.414494, 10.440154],
            [63.413494, 10.442154]
          ],
          level: 3,
          zoneId: 1,
        };


        addEmergencyZoneToMap(emergencyZone);

        //const result = await requestMarkers(markersData);
        if (result.success) {
        } else {
          console.error('Error loading markers:', result.error);
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    });

  } catch (error) {
    console.error('Error initializing map:', error);
  }
});

onUnmounted(() => {
  // Remove event listener for map movement
  if (mapStore.map) {
    mapStore.map.off('moveend');
  }

  // Stop position tracking
  positionTrackingStore.stopTracking();

  // Remove all markers from the map
  if (mapStore.layerGroup) {
    Object.keys(mapStore.layerGroup).forEach(type => {
      if (mapStore.layerGroup[type] instanceof L.LayerGroup) {
        mapStore.layerGroup[type].clearLayers();
        mapStore.map.removeLayer(mapStore.layerGroup[type]);
        delete mapStore.layerGroup[type];
      }
    });
  }


  //
})
</script>

<template>
  <div id="map" class="relative min-h-140 h-full w-full z-0 rounded-2xl"></div>
</template>

<style scoped>
</style>