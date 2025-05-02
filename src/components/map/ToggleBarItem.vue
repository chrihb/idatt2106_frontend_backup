<script setup>
import { useMapStore} from "@/stores/mapStore.js";

const props = defineProps({
  layerType: {
    type: String,
    required: true
  }
});

const mapStore = useMapStore();

const toggleLayer = (event) => {
  mapStore.toggleLayerGroup(props.layerType);
};
</script>

<template>
  <label class="flex items-center space-x-2 cursor-pointer">
    <input
        class="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        type="checkbox"
        @change="toggleLayer" />
    {{ layerType }}
  </label>
</template>

<style scoped>

</style>