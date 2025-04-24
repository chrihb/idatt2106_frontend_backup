<script setup>

import {ref} from "vue";

const isAuthenticated = ref(true) // Replace with actual authentication logic


</script>

<template>
  <!-- Container -->
  <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] md:grid-rows-[1fr_auto] gap-2 py-4">
    <!-- Storage takes both rows -->
    <div v-if="isAuthenticated" class="flex flex-col bg-blue-200 md:row-span-2 items-center">
      <h1>Storage</h1>
      <div class="flex flex-col text-left w-full px-4">
        <h2>Item 1</h2>
        <h2>Item 2</h2>
        <h2>Item 3</h2>
      </div>
    </div>

    <!-- News takes first row (1/3) -->
    <div class="flex flex-col bg-blue-200 items-center">
      <h1>News</h1>
      <div class="flex flex-col text-left w-full px-4">
        <h2>News 1</h2>
        <h2>News 2</h2>
        <h2>News 3</h2>
      </div>
    </div>

    <!-- Map takes second row (2/3) -->
    <div class="flex flex-col bg-blue-200 items-center">
      <h1>Map</h1>
      <div class="flex flex-col w-full items-center px-4">
        <div class="h-100 w-100 border-black border-2"></div>
      </div>
    </div>
  </div>
</template>



<style scoped>

</style>