<script setup>
import { computed } from "vue";
import ToggleBarItem from "@/components/map/ToggleBarItem.vue";
import { useMapStore } from "@/stores/mapStore.js";
import {useI18n} from "vue-i18n";

const mapStore = useMapStore();
const {t} = useI18n();

const layerTypes = computed(() =>
    Object.keys(mapStore.layerGroup).filter(type => type !== 'PersonligPlassering'));
</script>

<template>
  <div class="relative z-10 p-4 bg-white rounded-lg shadow-md h-full w-full overflow-y-auto">
    <h3 class="text-lg font-semibold mb-2">{{t("map.toggleBar.filterView")}}</h3>
    <ul class="space-y-3">
      <li v-for="layerType in layerTypes" :key="layerType" class="flex items-center gap-2">
        <ToggleBarItem :layerType="layerType" />
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>