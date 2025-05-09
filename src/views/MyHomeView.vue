<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import LocationStatus from "@/components/myHome/LocationStatus.vue";
import OtherMembers from "@/components/myHome/OtherMembers.vue";
import ManageHousehold from "@/components/myHome/ManageHousehold.vue";
import HouseholdPanel from "@/components/myHome/HouseholdPanel.vue";
import Map from "@/components/map/Map.vue";

import { useUserStore } from "@/stores/userStore.js";
import { useMapStore } from "@/stores/mapStore.js";

const mapStore = useMapStore();
const userStore = useUserStore();
const route = useRoute();

const loading = ref(true);
const household = ref(null);

function centerOnAddress() {
  if (household.value?.latitude && household.value?.longitude) {
    mapStore.centerMapOnSpecificLocation(household.value.latitude, household.value.longitude);
  }
}

onMounted(async () => {
  await userStore.fetchHouseholds();
  household.value = userStore.householdId.find(
      (h) => h.id === parseInt(route.params.id)
  );
  centerOnAddress();
  loading.value = false;
});
</script>

<template>
  <div v-if="!loading && household">
    <div class="py-2 px-2">
      <div class="grid grid-cols-[auto_1fr] gap-2">
        <div class="flex flex-col gap-2 min-w-70 w-full">
          <HouseholdPanel @click="centerOnAddress" :name="household.name" :address="household.address" class="cursor-pointer" />
          <LocationStatus :members="household.members" />
          <OtherMembers
              :id="household.id"
              :adults="household.unregisteredAdults"
              :children="household.unregisteredChildren"
              :pets="household.unregisteredPets"
          />
          <ManageHousehold :household="household" />
        </div>
        <div class="relative h-full w-full rounded-2xl shadow-lg overflow-hidden">
          <Map />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading household data...</p>
  </div>
</template>
