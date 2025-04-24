<template>
  <div></div>
</template>

<script setup>
import {onMounted} from "vue";
import {useMapStore} from "@/stores/mapStore.js";

const mapStore = useMapStore();

onMounted(() => {
  //mapStore.startTracking();
})
</script>

<style scoped>

</style>