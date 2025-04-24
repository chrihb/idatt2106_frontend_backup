<template>
  <div id="map" ></div>
</template>

<script setup>
import { onMounted, ref} from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '@/stores/mapStore.js';
import {initMap, startTracking} from "@/utils/mapUtils.js";

const map = ref(null);
const mapStore = useMapStore();



onMounted(async () => {
  // Initialize the map
  initMap(map, () => startTracking(map, mapStore));
});
</script>

<style scoped>
#map {
  height: 50vh;
  width: 80vh;
}
</style>