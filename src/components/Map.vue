<template>
  <div id="map" ></div>
</template>

<script setup>
import { onMounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';

const mapStore = useMapStore();

onMounted(async () => {
  // Initialize the map and store it in mapStore
  mapStore.initMap();
  //Start tracking the user's position
  mapStore.startTracking();
});
</script>

<style scoped>
#map {
  height: 50vh;
  width: 80vh;
}
</style>