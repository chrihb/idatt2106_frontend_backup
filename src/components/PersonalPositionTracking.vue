<template>
  <div></div>
</template>

<script setup>
import {onMounted} from "vue";
import {startTracking} from "@/utils/mapUtils.js";

const mapStore = useMapStore();

onMounted(() => {
  startTracking(mapStore.map, mapStore)
})
</script>

<style scoped>

</style>