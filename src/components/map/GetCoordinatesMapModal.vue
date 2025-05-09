<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import L from 'leaflet';
import {useI18n} from "vue-i18n";
import {createCustomMarkerIcon} from "@/utils/mapUtils.js";
import ConfirmationModal from "@/components/common/ConfirmationModal.vue";

const {t} = useI18n();
const emit = defineEmits(['onClose', 'coordinateSelected']);
const map = ref(null);
const marker = ref(null);
const pin = ref(null);
const showConfirmation = ref(false);
const coordinate = ref([]);

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
    map.value.removeLayer(marker);
    marker.value = null;
  }
  coordinate.value = [];
};

const savePin = () => {
  if (marker.value) {
    const {lat, lng} = marker.value.getLatLng();
    if (pin.value) {
      pin.value.setLatLng([lat, lng]);
    } else {
      pin.value = L.marker([lat, lng], {
        icon: createCustomMarkerIcon('Pin')})
          .addTo(map.value);
    }


    coordinate.value = [lat, lng];
  }

  map.value.removeLayer(marker.value);
  marker.value = null;
}

const removePin = () => {
  if (pin.value) {
    map.value.removeLayer(pin.value);
    pin.value = null;

    coordinate.value = [];
  }
}

const saveCoordinate = () => {
  if (coordinate) {
    emit('coordinateSelected', [coordinate.value[0], coordinate.value[1]]);
    closeModal();
  } else {
    alert(t('map.selectCoordinates'));
  }
};

const closeModal = () => {
  clearMarkers();
  marker.value = null;
  emit('onClose');
};

const initMap = async () => {
  await nextTick();

  const mapContainer = document.getElementById('marker-map');

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
    <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-[110]">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/8 p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">{{t("marker.createMarker")}}</h2>
          <button @click="handleCancel" class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2
                 rounded-full hover:bg-kf-darkgrey">✖</button>
          <ConfirmationModal
              v-if="showConfirmation"
              :message="t('marker.leaveMessage')"
              :confirm-text="t('marker.quit')"
              :cancel-text="t('marker.stay')"
              @confirm="confirmCancel"
              @cancel="cancelConfirmation"
          />

        </div>
        <div>
          <p class="text-sm text-gray-600 mb-2">{{t("marker.getCoordinatesFromMap")}}</p>
        </div>
        <div id="marker-map" class="h-96 w-full"></div>
        <div class="flex justify-between mt-4">
          <button @click="savePin" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            {{t("marker.setPin")}}
          </button>
          <button @click="removePin" class="px-4 py-2 bg-red-500 text-white rounded-lg
           hover:bg-red-600">
            {{t("marker.removePin")}}
          </button>
          <button
              @click="saveCoordinate"
              :disabled="coordinate.length < 1"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
              disabled:bg-gray-300 disabled:cursor-not-allowed">
            {{t("marker.saveCoordinate")}}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>


<style scoped>
</style>