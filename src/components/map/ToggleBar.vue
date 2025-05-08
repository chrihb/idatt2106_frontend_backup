<script setup>
import { computed } from "vue";
import ToggleBarItem from "@/components/map/ToggleBarItem.vue";
import { useMapStore } from "@/stores/mapStore.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const mapStore = useMapStore();
const layerTypes = computed(() =>
    Object.keys(mapStore.layerGroup).filter(type => type !== 'PersonligPlassering'));
</script>

<template>
  <div class="p-4 bg-kf-white rounded-2xl border border-kf-white-contrast-5 shadow-md max-w-50 w-full overflow-y-auto">
    <h3 class="text-lg text-kf-blue font-bold mb-4">{{ t('map.filter') }}</h3>
    <ul class="space-y-2">
      <li v-for="layerType in layerTypes" :key="layerType">
        <ToggleBarItem :layerType="layerType" />
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>