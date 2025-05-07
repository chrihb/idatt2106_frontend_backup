<script setup>
import News from "@/components/frontpage/News.vue";
import { useUserStore } from "@/stores/userStore.js";
import CompleteMap from "@/components/map/CompleteMap.vue";
import PrimaryStorageStatus from "@/components/frontpage/PrimaryStorageStatus.vue";
import LocationStatusFront from "@/components/frontpage/LocationStatusFront.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const userStore = useUserStore();
const router = useRouter();
const household = ref([]);

onMounted(() => {
  if (userStore.isAuthenticated && userStore.householdId.length > 0) {
    household.value = userStore.householdId[0]
  }
});

</script>

<template>
  <!-- Container -->
  <div class="grid grid-cols-1 md:grid-cols-[auto_auto] md:grid-rows-[1fr_auto_auto] gap-2 py-2 px-2">
    <PrimaryStorageStatus v-if="userStore.authenticated && userStore.userSettings.showStorageStatusOnFrontpage"/>
    <LocationStatusFront v-if="userStore.authenticated && userStore.userSettings.showHouseholdStatusOnFrontpage && household?.members" @click="router.push(`/household/${household.id}`)" :members="household.members"
    />
    <News class="md:col-span-2 w-full"/>
    <CompleteMap class="md:col-span-2 w-full h-full"/>
  </div>
</template>



<style scoped>

</style>
