<script setup>

import Map from "@/components/map/Map.vue";
import CenterMapOnUserButton from "@/components/map/CenterMapOnUserButton.vue";
</script>

<template>
  <div id="map-container" class="flex-grow relative min-h-140 h-full w-full z-0 rounded-2xl">
    <Map />
    <CenterMapOnUserButton />
  </div>
</template>

<style scoped>

</style>