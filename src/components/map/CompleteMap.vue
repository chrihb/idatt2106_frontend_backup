<script setup>

import Map from "@/components/map/Map.vue";
import CenterMapOnUserButton from "@/components/map/CenterMapOnUserButton.vue";
import ToggleBar from "@/components/map/ToggleBar.vue";
</script>

<template>
  <div id="map-container" class="flex h-full w-full">
    <div class="flex-grow relative min-h-140 h-full w-full z-0 rounded-2xl">
      <Map />
      <CenterMapOnUserButton />
    </div>
    <div class="relative inline-flex h-full w-60 flex-col gap-2 z-10">
      <ToggleBar />
    </div>
  </div>
</template>

<style scoped>

</style>