<script setup>

import CenterMapOnUser from "@/components/map/CenterMapOnUser.vue";
import Map from "@/components/map/Map.vue";
</script>

<template>
  <div id="map-container" class="relative min-h-140 h-full w-full z-0 rounded-2xl">
    <Map />
    <CenterMapOnUser />
  </div>
</template>

<style scoped>

</style>