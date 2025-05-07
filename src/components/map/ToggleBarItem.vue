<script setup>
import { useMapStore} from "@/stores/mapStore.js";

const props = defineProps({
  layerType: {
    type: String,
    required: true
  }
});

const mapStore = useMapStore();

const toggleLayer = () => {
  mapStore.toggleLayerGroup(props.layerType);
};

const layerIcon = () => {
  if (props.layerType === 'Fare nivå 1') {
    return "circle-green";
  }
  if (props.layerType === 'Fare nivå 2') {
    return "circle-yellow";
  }
  if (props.layerType === 'Fare nivå 3') {
    return "circle-red";
  }
  return `/icons/map/${props.layerType}.png`;
}


</script>

<template>
  <label class="flex items-center gap-3 cursor-pointer">
    <input
        class="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        type="checkbox"
        checked
        @change="toggleLayer"
    />
    <template v-if="layerIcon() === 'circle-green'">
      <span class="h-5 w-5 rounded-full bg-green-500"></span>
    </template>
    <template v-else-if="layerIcon() === 'circle-yellow'">
      <span class="h-5 w-5 rounded-full bg-yellow-500"></span>
    </template>
    <template v-else-if="layerIcon() === 'circle-red'">
      <span class="h-5 w-5 rounded-full bg-red-500"></span>
    </template>
    <template v-else>
      <img :src="layerIcon()" alt="icon" class="h-5 w-5 rounded-full" />
    </template>
    <span class="text-sm font-medium text-gray-700">{{ layerType }}</span>
  </label>
</template>

<style scoped>

</style>