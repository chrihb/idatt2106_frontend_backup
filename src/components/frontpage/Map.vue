<template>
  <div id="map" ></div>
</template>

<script setup>
import {onMounted, onUnmounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import { usePositionTrackingStore } from '@/stores/positionTrackingStore.js';

const mapStore = useMapStore();
const positionTrackingStore = usePositionTrackingStore();

onMounted(async () => {
  // Initialize the map
  try {
    mapStore.initMap();
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

<style scoped>
#map {
  min-height: 30vh;
  min-width: 30vh;
  height: 100%;
  width: 100%;
}
</style>