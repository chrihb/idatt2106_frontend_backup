<script setup>
import { computed } from "vue";
import ToggleBarItem from "@/components/map/ToggleBarItem.vue";
import { useMapStore } from "@/stores/mapStore.js";

const mapStore = useMapStore();
const layerTypes = computed(() =>
    Object.keys(mapStore.layerGroup).filter(type => type !== 'PersonligPlassering'));
</script>

<template>
  <div class="absolute top-0 right-0 z-10 p-4 bg-white rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-2">Toggle Layers</h3>
    <ul class="space-y-2">
      <li v-for="layerType in layerTypes" :key="layerType">
        <ToggleBarItem :layerType="layerType" />
      </li>
    </ul>

  </div>
</template>

<style scoped>

</style>