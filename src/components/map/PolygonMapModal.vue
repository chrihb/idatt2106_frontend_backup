<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import L from 'leaflet';
import {useMapStore} from "@/stores/mapStore.js";
import MinimalMap from "@/components/map/MinimalMap.vue";

const {t} = useI18n();
const emit = defineEmits(['close', 'coordinatesSelected']);
const map = ref(null);
const markers = ref([]);
const polygonCoordinates = ref([]);

const mapStore = useMapStore();

const placeMarker = () => {
  mapStore.map.value.on('click', (e) => {
    const { lat, lng } = e.latlng;
    const marker = L.marker([lat, lng]).addTo(map.value);
    markers.value.push(marker);
    polygonCoordinates.value.push([lat, lng]);
  });
}

const clearMarkers = () => {
  markers.value.forEach((marker) => map.value.removeLayer(marker));
  markers.value = [];
  polygonCoordinates.value = [];
};

const saveCoordinates = () => {
  emit('coordinatesSelected', polygonCoordinates.value);
};

const closeModal = () => {
  clearMarkers();
  emit('close');
};

onUnmounted(() => {
  clearMarkers();
});

</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">{{t("zone.createPolygon")}}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800">✖</button>
      </div>
      <div>
        <MinimalMap />
      </div>
      <div class="flex justify-between mt-4">
        <button @click="clearMarkers" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          {{t("zone.Clear")}}
        </button>
        <button @click="saveCoordinates" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          {{t("zone.Save")}}
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
#polygon-map {
  height: 200px;
  width: 100%;
}
</style>