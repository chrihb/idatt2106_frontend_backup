<script setup>
import { useMapStore } from "@/stores/mapStore.js";

const props = defineProps({
  layerType: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});

const mapStore = useMapStore();

const toggleLayer = () => {
  mapStore.toggleLayerGroup(props.layerType);
};

const layerIcon = () => {
  if (props.layerType === 'Fare nivå 1') return "circle-yellow";
  if (props.layerType === 'Fare nivå 2') return "circle-orange";
  if (props.layerType === 'Fare nivå 3') return "circle-red";
  return `/icons/map/${props.layerType}.png`;
};
</script>


<template>
  <label class="flex items-center gap-3 cursor-pointer">
    <input
        class="form-checkbox size-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        type="checkbox"
        checked
        @change="toggleLayer"
    />
    <template v-if="layerIcon() === 'circle-yellow'">
      <span class="size-6 rounded-full bg-yellow-200 border"></span>
    </template>
    <template v-else-if="layerIcon() === 'circle-orange'">
      <span class="size-6 rounded-full bg-orange-500 border"></span>
    </template>
    <template v-else-if="layerIcon() === 'circle-red'">
      <span class="size-6 rounded-full bg-red-900 border"></span>
    </template>
    <template v-else>
      <img :src="layerIcon()" alt="icon" class="size-6" />
    </template>
    <span class="text-md font-medium text-kf-blue truncate block max-w-25">{{ label }}</span>

  </label>
</template>

<style scoped>

</style>