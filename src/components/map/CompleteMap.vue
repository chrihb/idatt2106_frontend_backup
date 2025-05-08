<script setup>

import Map from "@/components/map/Map.vue";
import ToggleBar from "@/components/map/ToggleBar.vue";
</script>

<template>
  <div id="map-container" class="flex gap-2">
    <ToggleBar />
    <div class="flex-grow relative h-full w-full rounded-2xl">
      <Map />
    </div>
  </div>
</template>

<style scoped>

</style>