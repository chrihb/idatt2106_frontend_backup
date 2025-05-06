<script setup>
import {onMounted, nextTick} from 'vue';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/mapStore.js';
import {mockMarkersData} from "@/services/markerService.js";
import {usePositionTrackingStore} from "@/stores/positionTrackingStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {debounce} from 'lodash';
import {useMarkerStore} from "@/stores/markerStore.js";
import {centerMapOnEmergencyZone, createCustomMarkerIcon, createMarkerPopup} from "@/utils/markerUtils.js";
import {addEmergencyZoneToMap} from "@/utils/markerUtils.js";
import L from 'leaflet';

onMounted(async () => {

  try {
    const mapStore = useMapStore();
    const emergencyZonesStore = useEmergencyZonesStore();
    const positionTrackingStore = usePositionTrackingStore();
    const markerStore = useMarkerStore();

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

const markerStore = useMarkerStore();

//TODO: Remove testing function to center the map on a specific marker
const centerMapOnMarker1 = async () => {
  const marker = markerStore.getMarkerById(1);
  if (marker) {
    markerStore.centerMapOnMarker(1);
  } else {
    console.error('Marker with ID 1 not found');
  }
};

//TODO: Remove testing function to center the map on a specific emergency zone
const centerMapOnZone11 = async () => {
  const emergencyZonesStore = useEmergencyZonesStore();
  const zone = emergencyZonesStore.getEmergencyZoneById(11);
  if (zone) {
    centerMapOnEmergencyZone(11);
  } else {
    console.error('Zone with ID 11 not found');
  }
}

</script>

<template>
  <div id="map" class="relative min-h-140 h-full w-full z-0 rounded-2xl"></div>
  <!-- TODO: Remove testing buttons -->
  <div>
    <button @click="centerMapOnMarker1" class="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
      TEST Vis nermeste hjertestarter
    </button>
    <button @click="centerMapOnZone11" class="absolute top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded">
      TEST Vis næremeste krise
    </button>
  </div>
</template>

<style scoped>
</style>