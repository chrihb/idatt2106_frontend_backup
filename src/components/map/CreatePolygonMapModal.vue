<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import L from 'leaflet';
import {useI18n} from "vue-i18n";
import {createCustomMarkerIcon} from "@/utils/mapUtils.js";
import ConfirmationModal from "@/components/common/ConfirmationModal.vue";

const {t} = useI18n();
const emit = defineEmits(['onClose', 'coordinatesSelected']);
const map = ref(null);
const marker = ref(null);
const markers = ref([]);
const lines = ref([]);
const showConfirmation = ref(false);
const polygonCoordinates = ref([]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const handleCancel = () => {
  showConfirmation.value = true;
};

const confirmCancel = () => {
  showConfirmation.value = false;
  closeModal();
};

const cancelConfirmation = () => {
  showConfirmation.value = false;
};

const clearMarkers = () => {
  if (map.value) {
    markers.value.forEach((marker) => map.value.removeLayer(marker));
    lines.value.forEach((line) => map.value.removeLayer(line));
    map.value.removeLayer(marker);
    marker.value = null;
  }
  markers.value = [];
  lines.value = [];
  polygonCoordinates.value = [];
};

const saveMarker = () => {
  if (marker.value) {
    const {lat, lng} = marker.value.getLatLng();
    markers.value.push(
        L.marker([lat, lng],
            {
              icon: createCustomMarkerIcon('Pin')})
        .addTo(map.value));
    polygonCoordinates.value.push([lat, lng]);

    if (markers.value.length > 1) {
      const lastTwoCoords = [
        polygonCoordinates.value[polygonCoordinates.value.length - 2],
        [lat, lng],
      ];
      const line = L.polyline(lastTwoCoords, { color: 'blue' }).addTo(map.value);
      lines.value.push(line);
    }

    map.value.removeLayer(marker.value);
    marker.value = null;
  }
};

const removeLastMarker = () => {
  if (markers.value.length > 0) {
    const lastMarker = markers.value.pop();
    map.value.removeLayer(lastMarker);
    polygonCoordinates.value.pop();

    if (lines.value.length > 0) {
      const lastLine = lines.value.pop();
      map.value.removeLayer(lastLine);
    }
  }
};

const saveCoordinates = () => {
  if (polygonCoordinates.value.length < 3) {
    alert(t("zone.notEnoughPoints"));
    return;
  }
  emit('coordinatesSelected', polygonCoordinates.value);
};

const closeModal = () => {
  clearMarkers();
  marker.value = null;
  emit('onClose');
};

const initMap = async () => {
  await nextTick();

  const mapContainer = document.getElementById('polygon-map');

  if (!map.value && mapContainer) {
    map.value = L.map(mapContainer, {
      center: [63.42, 10.4],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.value);


    map.value.on('click', (e) => {
      const {lat, lng} = e.latlng;
      if (!marker.value) {
        marker.value = L.marker([lat, lng], {draggable: true}).addTo(map.value);
      } else {
        marker.value.setLatLng([lat, lng]);

      }
    });

  } else {
    map.value.invalidateSize();
  }
};

const destroyMap = () => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
};

onMounted(async () => {
  if (props.isOpen) {
    await initMap();
  }
})

onUnmounted(() => {
  clearMarkers();
  marker.value = null;
  destroyMap();
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    initMap();
  } else {
    clearMarkers();
    marker.value = null;
    destroyMap();

  }
});

</script>

<template>
  <Teleport to="body" v-if="isOpen">
    <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-[100]">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/8 p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">{{t("zone.createZone")}}</h2>
          <button @click="handleCancel" class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2
                 rounded-full hover:bg-gray-100">✖</button>
          <ConfirmationModal
              v-if="showConfirmation"
              :message="t('zone.leaveMessage')"
              :confirm-text="t('zone.quit')"
              :cancel-text="t('zone.stay')"
              @confirm="confirmCancel"
              @cancel="cancelConfirmation"
          />

        </div>
        <div>
          <p class="text-sm text-gray-600 mb-2">{{t("zone.createZoneDescription")}}</p>
        </div>
        <div id="polygon-map" class="h-96 w-full"></div>
        <div class="flex justify-between mt-4">
          <button @click="clearMarkers" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            {{t("zone.clearPoints")}}
          </button>
          <button @click="saveMarker" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            {{t("zone.addPoint")}}
          </button>
          <button @click="removeLastMarker" class="px-4 py-2 bg-green-500 text-white rounded-lg
           hover:bg-green-600">
            {{t("zone.removeLastPoint")}}
          </button>
          <button
              @click="saveCoordinates"
              :disabled="polygonCoordinates.length < 3"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
              disabled:bg-gray-300 disabled:cursor-not-allowed">
            {{t("zone.saveCoordinates")}}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>


<style scoped>
</style>