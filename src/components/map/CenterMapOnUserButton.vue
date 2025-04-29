<script setup>
import { usePositionTrackingStore} from "@/stores/positionTrackingStore.js";

const positionTrackingStore = usePositionTrackingStore();

const centerMapOnUser = () => {
  positionTrackingStore.centerMapOnUser();
};

</script>

<template>
  <button class="absolute bottom-8 right-4 w-8 h-8 bg-white rounded-full shadow-md border border-black flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="centerMapOnUser" >
      <img src="/icons/map/PersonligPlassering.png" alt="Center Map" class="w-5 h-5"/>
    </button>
</template>

<style scoped>

</style>