<script setup>
import {onMounted, onUnmounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import {mockMarkersData} from "@/services/markerService.js";

const mapStore = useMapStore();

onMounted(async () => {
  // Initialize the map
  try {
    mapStore.initMap();

    mapStore.map.on('moveend', async () => {
      const bounds = mapStore.map.getBounds();
      const markersData = {
        northEast: bounds.getNorthEast(),
        southWest: bounds.getSouthWest(),
      };

      try {
        const result = await mockMarkersData()
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
  // Stop watch position when component is unmounted
  if (navigator.geolocation && mapStore.watchId) {
    navigator.geolocation.clearWatch(mapStore.watchId);
  }
})
</script>

<template>
  <div id="map" class="min-h-140 h-full w-full z-0 rounded-2xl"></div>
</template>

<style scoped>
</style>