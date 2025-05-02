<script setup>
import {onMounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import {mockMarkersData} from "@/services/markerService.js";
import {usePositionTrackingStore} from "@/stores/positionTrackingStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {debounce} from 'lodash';

onMounted(async () => {

  try {
    const mapStore = useMapStore();
    const emergencyZonesStore = useEmergencyZonesStore();
    const positionTrackingStore = usePositionTrackingStore();

    // Initialize the map
    if (!mapStore.map) {
      mapStore.initMap();
    } else {
      // Reattach the map to the container
      const container = mapStore.map.getContainer();
      if (!document.getElementById('map').contains(container)) {
        document.getElementById('map').appendChild(container);
      }
      mapStore.map.invalidateSize();
    }

    // Start position tracking
    positionTrackingStore.startTracking();

    // Add event listener for map movement
    mapStore.map.on('moveend', debounce( async () => {
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
    }, 300));

  } catch (error) {
    console.error('Error initializing map:', error);
  }
});

</script>

<template>
  <div id="map" class="relative min-h-140 h-full w-full z-0 rounded-2xl"></div>
</template>

<style scoped>
</style>