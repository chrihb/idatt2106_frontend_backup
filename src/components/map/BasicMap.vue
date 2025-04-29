<script setup>

import Map from "@/components/map/Map.vue";
import CenterMapOnUser from "@/components/map/CenterMapOnUser.vue";
</script>

<template>
  <div id="map-container" class="flex-grow relative min-h-140 h-full w-full z-0 rounded-2xl">
    <Map />
    <CenterMapOnUser />
  </div>
</template>

<style scoped>

</style>