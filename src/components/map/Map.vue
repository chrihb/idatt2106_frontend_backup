<script setup>
import {onMounted, nextTick} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import {usePositionTrackingStore} from "@/stores/positionTrackingStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {debounce} from 'lodash';
import {useMarkersStore} from "@/stores/markersStore.js";
import {addMarkerToMap, centerMapOnMarker} from "@/utils/mapUtils.js";
import {centerMapOnEmergencyZone} from "@/utils/mapUtils.js";
import {addEmergencyZoneToMap} from "@/utils/mapUtils.js";

onMounted(async () => {

  try {
    const mapStore = useMapStore();
    const emergencyZonesStore = useEmergencyZonesStore();
    const positionTrackingStore = usePositionTrackingStore();
    const markersStore = useMarkersStore();

    await nextTick();

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


    const emergencyZones = emergencyZonesStore.getEmergencyZones;
    const markers = markersStore.getMarkers;

    // Add emergency zones to the map
    if (emergencyZones && emergencyZones.length > 0) {
      for (const zone of emergencyZones) {
        mapStore.addMapItemId(zone.zoneId);
        addEmergencyZoneToMap(zone);
      }
    }


    // Add markers to the map
    if (markers && markers.length > 0) {
      for (const marker of markers) {
        addMarkerToMap(marker);
        mapStore.addMapItemId(marker.markerId);
      }
    }

    // Start position tracking
    positionTrackingStore.startTracking();

    // Add event listener for map movement
    mapStore.map.on('moveend', debounce(async () => {
      const bounds = mapStore.map.getBounds();
      const ids = mapStore.getMapItemIds();

      try {
        await markersStore.fetchMarkersArea(bounds, ids);
        await emergencyZonesStore.fetchEmergencyZonesArea(bounds, ids);

      } catch (error) {
      }
    }, 300));

  } catch (error) {
  }
});

const positionTrackingStore = usePositionTrackingStore();

const centerMapOnUser = () => {
  positionTrackingStore.centerMapOnUser();
};

</script>

<template>
  <!-- Map container -->
  <div id="map" class="relative min-h-160 h-full w-full z-0 rounded-2xl"></div>

  <!-- Map Controls -->
  <div>
    <!-- New "center on user" button -->
    <button
        class="absolute bottom-8 right-4 w-8 h-8 bg-white rounded-full shadow-md border border-black flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="centerMapOnUser"
    >
      <img src="/icons/map/PersonligPlassering.png" alt="Center Map" class="w-5 h-5" />
    </button>
  </div>

</template>

<style scoped>
</style>