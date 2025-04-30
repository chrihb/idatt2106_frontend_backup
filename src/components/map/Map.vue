<script setup>
import {onMounted, onUnmounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import {mockMarkersData} from "@/services/markerService.js";
import { useMarkerStore} from "@/stores/markerStore.js";
import {usePositionTrackingStore} from "@/stores/positionTrackingStore.js";
import {addEmergencyZoneToMap} from "@/utils/markerUtils.js";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import L from 'leaflet';

onMounted(async () => {

  try {
    const mapStore = useMapStore();
    const markerStore = useMarkerStore();
    const emergencyZonesStore = useEmergencyZonesStore();
    const zoneService = emergencyZoneService();
    const positionTrackingStore = usePositionTrackingStore();

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

    // Add event listener for map movement
    mapStore.map.on('moveend', async () => {
      const bounds = mapStore.map.getBounds();

      try {
        //TODO: Add request to fetch markers from the backend
        const result = await mockMarkersData();


        // Get emergency zones based on the current map bounds

        // Get the zones in the cache

        // Get the zones from the service
        await emergencyZonesStore.fetchEmergencyZonesArea(bounds, 1)

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