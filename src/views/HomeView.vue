<script setup>
import HouseStatus from "@/components/frontpage/HouseStatus.vue";
import Map from "@/components/frontpage/Map.vue";
import News from "@/components/frontpage/News.vue";
import StorageStatus from "@/components/frontpage/StorageStatus.vue";
import { ref } from "vue";

const isAuthenticated = ref(true) // Replace with actual authentication logic


</script>

<template>
  <!-- Container -->
  <div class="grid grid-cols-1 md:grid-cols-[auto_auto] md:grid-rows-[1fr_auto_auto] gap-2 py-2 px-2">

    <StorageStatus v-if="isAuthenticated"/>
    <HouseStatus v-if="isAuthenticated"/>
    <News class="md:col-span-2 w-full"/>
    <Map class="md:col-span-2 w-full"/>
  </div>
</template>



<style scoped>

</style>