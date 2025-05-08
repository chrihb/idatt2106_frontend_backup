<script setup>
import { onMounted, onUnmounted, ref } from "vue";
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

// Use ref for household to make it reactive
const household = ref(null);

const markerId = ref('');

function centerOnAddress() {
  if (household.value?.latitude && household.value?.longitude) {
    mapStore.centerMapOnSpecificLocation(household.value.latitude, household.value.longitude);
  } else {
    console.error("Household coordinates missing");
  }
}

const refreshHouseholdData = async () => {
  await userStore.fetchHouseholds();
  household.value = userStore.householdId.find(
      h => h.id === parseInt(route.params.id)
  );

  // Update marker if needed
  if (household.value?.latitude && household.value?.longitude) {
    removeMarkerFromMap(markerId.value);
    markerId.value = `household-${household.value.id}`;
    addMarkerToMap({
      markerId: markerId.value,
      lat: household.value.latitude,
      lng: household.value.longitude,
      type: "home",
    });
  }
};

onMounted(async () => {
  await refreshHouseholdData();
});

onUnmounted(() => {
  removeMarkerFromMap(markerId.value);
});
</script>

<template>
  <div class="py-2 px-2" v-if="household">
    <div class="grid grid-cols-[auto_1fr] gap-2">
      <div class="flex flex-col gap-2 min-w-70 w-full">
        <HouseholdPanel @click="centerOnAddress" :name="household.name" :address="household.address" class="cursor-pointer" />
        <LocationStatus :members="household.members"/>
        <Nearest :latitude="household.latitude" :longitude="household.longitude"/>
        <ManageHousehold :household="household" @member-removed="refreshHouseholdData"/>
      </div>
      <div class="relative h-full w-full rounded-2xl shadow-lg overflow-hidden">
        <Map class="h-full w-full" />
      </div>
    </div>
  </div>
</template>
