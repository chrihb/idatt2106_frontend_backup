<script setup>
import Map from '@/components/frontpage/Map.vue'
import HouseStatus from "@/components/frontpage/HouseStatus.vue";
</script>

<template>
  <div class="grid md:grid-cols-2 md:grid-rows-5 gap-2">
    <p class="md:col-start-1">Address</p>
    <p class="md:col-start-1">Nearest Shelter</p>
    <p class="md:col-start-1">Nearest Defibrillator</p>
    <p class="md:col-start-1">Nearest Hospital</p>
    <p class="md:col-start-1">Manage Storage</p>
    <HouseStatus class="md:col-start-2 md:row-start-1" />
    <Map class="md:col-start-2 md:row-start-2 md:row-span-4" />
  </div>
</template>

<style scoped>
</style>
