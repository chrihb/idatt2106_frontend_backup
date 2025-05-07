<script setup>
import HouseStatus from "@/components/frontpage/HouseStatus.vue";
import News from "@/components/frontpage/News.vue";
import { useUserStore} from "@/stores/userStore.js";
import CompleteMap from "@/components/map/CompleteMap.vue";
import PrimaryStorageStatus from "@/components/frontpage/PrimaryStorageStatus.vue";

const userStore = useUserStore();


</script>

<template>
  <!-- Container -->
  <div class="grid grid-cols-1 md:grid-cols-[auto_auto] md:grid-rows-[1fr_auto_auto] gap-2 py-2 px-2">
    <PrimaryStorageStatus v-if="userStore.authenticated && userStore.userSettings.showStorageStatusOnFrontpage"/>
    <HouseStatus v-if="userStore.authenticated && userStore.userSettings.showHouseholdStatusOnFrontpage"/>
    <News class="md:col-span-2 w-full"/>
    <CompleteMap class="md:col-span-2 w-full h-full"/>
  </div>
</template>



<style scoped>

</style>
