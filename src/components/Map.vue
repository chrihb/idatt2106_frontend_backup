<template>
  <div id="map" ></div>
  <div class ="controls">
    <button @click="mapStore.centerMapOnUser()">Center on My Location</button>
    <button @click="mapStore.toggleTracking">{{ mapStore.canTrack ? 'Stop Tracking' : 'Start Tracking' }}</button>
  </div>
</template>

<script setup>
import { onMounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';

const mapStore = useMapStore();

onMounted(async () => {
  // Initialize the map and store it in mapStore
  mapStore.initMap();
});
</script>

<style scoped>
#map {
  height: 50vh;
  width: 80vh;
}
</style>