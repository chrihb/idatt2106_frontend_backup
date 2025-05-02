<script setup>
import {onMounted} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import {mockMarkersData} from "@/services/markerService.js";
import {usePositionTrackingStore} from "@/stores/positionTrackingStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {debounce} from 'lodash';
import {useMarkerStore} from "@/stores/markerStore.js";
import {createCustomMarkerIcon, createMarkerPopup} from "@/utils/markerUtils.js";
import {addEmergencyZoneToMap} from "@/utils/markerUtils.js";
import L from 'leaflet';

onMounted(async () => {

  try {
    const mapStore = useMapStore();
    const emergencyZonesStore = useEmergencyZonesStore();
    const positionTrackingStore = usePositionTrackingStore();
    const markerStore = useMarkerStore();

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
    const markers = markerStore.getMarkers; // Assuming a getter exists for markers

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
        mapStore.addMapItemId(marker.id);
        const markerIcon = createCustomMarkerIcon(marker.type);
        L.marker([marker.lat, marker.lng], { icon: markerIcon })
            .addTo(mapStore.map)
            .bindPopup(createMarkerPopup(marker.type, marker.location, marker.address, marker.description));
      }
    }

    // Start position tracking
    console.log("Starting tracking...");
    positionTrackingStore.startTracking();
    console.log("Tracking started");

    // Add event listener for map movement
    mapStore.map.on('moveend', debounce( async () => {
      const bounds = mapStore.map.getBounds();
      const ids = mapStore.getMapItemIds();

      try {
        //TODO: Add request to fetch markers from the backend

        const result = await mockMarkersData();
        await emergencyZonesStore.fetchEmergencyZonesArea(bounds, ids)

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