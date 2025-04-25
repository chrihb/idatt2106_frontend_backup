<template>
  <div id="map" ></div>
  <div class ="controls">
    <button @click="centerMapOnUser()">Center on My Location</button>
    <button @click="toggleTracking">{{ mapStore.canTrack ? 'Stop Tracking' : 'Start Tracking' }}</button>
  </div>
</template>

<script setup>
import {onMounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';

const mapStore = useMapStore();

const centerMapOnUser = () => {
  mapStore.centerMapOnUser();
};

const toggleTracking = () => {
  mapStore.toggleTracking();
};

onMounted(async () => {
  // Initialize the map
  try {
    mapStore.initMap();
  } catch (error) {
    console.error('Error initializing map:', error);
  }
});
</script>

<style scoped>
#map {
  height: 70vh;
  width: 90vh;
}
</style>