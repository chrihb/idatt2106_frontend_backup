<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import LocationStatus from "@/components/myHome/LocationStatus.vue";
import Nearest from "@/components/myHome/Nearest.vue";
import ManageHousehold from "@/components/myHome/ManageHousehold.vue";
import HouseholdPanel from "@/components/myHome/HouseholdPanel.vue";
import Map from "@/components/map/Map.vue";

import { useUserStore } from "@/stores/userStore.js";
import { useMapStore } from "@/stores/mapStore.js";
import { useMarkersStore } from "@/stores/markersStore.js";
import { addMarkerToMap, removeMarkerFromMap } from "@/utils/mapUtils.js";

const mapStore = useMapStore();
const markersStore = useMarkersStore();
const userStore = useUserStore();
const route = useRoute();

const household = userStore.householdId.find(
    (household) => household.id === parseInt(route.params.id)
);

const markerId = `household-${household?.id}`;

function centerOnAddress() {
  if (household.latitude && household.longitude) {
    if (!markersStore.getMarkerById(markerId)) {
      addMarkerToMap({
        markerId,
        lat: household.latitude,
        lng: household.longitude,
        type: "home",
      });
    }
    mapStore.centerMapOnSpecificLocation(household.latitude, household.longitude);
  } else {
    console.error("Household coordinates missing");
  }
}

onMounted(async () => {
  await userStore.fetchHouseholds();

  if (household?.latitude && household?.longitude) {
    addMarkerToMap({
      markerId,
      lat: household.latitude,
      lng: household.longitude,
      type: "Hjertestarter",
    });
  }
});

onUnmounted(() => {
  removeMarkerFromMap(markerId);
});
</script>


<template>
  <div class="py-2 px-2">
    <div class="grid grid-cols-[auto_1fr] gap-2">
      <div class="flex flex-col gap-2 min-w-70 w-full">
        <HouseholdPanel @click="centerOnAddress" :name="household.name" :address="household.address" class="cursor-pointer" />
        <LocationStatus :members="household.members"/>
        <Nearest :latitude="household.latitude" :longitude="household.longitude"/>
        <ManageHousehold :household="household"/>
      </div>
      <div class="relative h-full w-full rounded-2xl shadow-lg overflow-hidden">
        <Map class="h-full w-full" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
