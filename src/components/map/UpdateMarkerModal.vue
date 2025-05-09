<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMarkerStore } from '@/stores/markerStore.js';
import { useMarkersStore } from '@/stores/markersStore.js';
import { useI18n } from 'vue-i18n';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import GetCoordinatesMapModal from "@/components/map/GetCoordinatesMapModal.vue";
import {markerService} from "@/services/markerService.js";
import {getAddress} from "@/utils/addressTranslationUtil.js";

const { t } = useI18n();
const props = defineProps({
  markerId: {
    type: Number,
    default: null,
  },
  display: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'markerSaved']);

const markerData = ref({
  name: '',
  type: '',
  lat: null,
  lng: null,
  description: '',
  address: '',
});

const mrkrService = markerService();
const markerStore = useMarkerStore();
const markersStore = useMarkersStore();
const isUpdate = computed(() => props.markerId !== null);

const formError = ref('');
const showConfirmation = ref(false);
const markerTypes = ref([])

const validateData = (data) => {
  if (!data.name) return { valid: false, error: t('marker.nameRequired') };
  if (!data.type) return { valid: false, error: t('marker.typeRequired') };
  if (!data.lat || data.lat < -90 || data.lat > 90) return { valid: false, error: t('marker.latInvalid') };
  if (!data.lng || data.lng < -180 || data.lng > 180) return { valid: false, error: t('marker.lngInvalid') };
  return { valid: true };
};

const handleSubmit = async () => {
  const address = await getAddress(markerData.value.lat, markerData.value.lng, true);
  if (address) {
    markerData.value.address = address;
  }  else {
    console.error(t('marker.coordinatesNotFound'));
  }

  const result = validateData(markerData.value);
  if (!result.valid) {
    formError.value = result.error;
    return;
  }

  try {
    formError.value = '';
    console.log(markerData.value);
    const response = await markerStore.saveMarker(markerData.value);
    if (response) {
      emit('markerSaved', markerData.value);
      close();
    } else {
      console.error(t('marker.errorSavingMarker'));
    }
  } catch (error) {
    console.error(t('marker.errorSavingMarker'), error);
  }
};

const loadMarkerData = async () => {
  if (isUpdate.value) {
    const marker = markersStore.getMarkerById(props.markerId);
    if (marker) {
      markerData.value = { ...marker };
    } else {
      const fetchedMarker = await markerStore.fetchMarkerDetailsById(props.markerId);
      markerData.value = { ...fetchedMarker };
    }
  }
};

const close = () => {
  resetForm();
  emit('close');
};

const resetForm = () => {
  markerData.value = {
    name: '',
    type: '',
    lat: null,
    lng: null,
    description: '',
  };
  formIncomplete.value = false;
};

const handleCancel = () => {
  showConfirmation.value = true;
};

const confirmCancel = () => {
  showConfirmation.value = false;
  close();
};

const cancelConfirmation = () => {
  showConfirmation.value = false;
};

const isMapModalVisible = ref(false);


const openMapModal = () => {
  isMapModalVisible.value = true;
};

const closeMapModal = () => {
  isMapModalVisible.value = false;
};

const handleCoordinateSelected = (coordinate) => {
  markerData.value.lat = coordinate[0];
  markerData.value.lng = coordinate[1];
  closeMapModal();
};

const fetchMarkerTypes = async () => {
  const types = await mrkrService.getMarkerTypes();
  markerTypes.value = types.map((type) => type.type);
}

onMounted(async () => {
  await loadMarkerData();
  await fetchMarkerTypes();
});
</script>

<template>
  <div v-if="display" class="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-0">
    <div class="bg-white rounded-lg shadow-xl w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-auto p-4 sm:p-6 max-w-3xl">
      <div class="flex justify-between items-center mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800">
          {{ isUpdate ? t('marker.updateMarker') : t('marker.newMarker') }}
        </h1>
        <button class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-gray-100" @click="handleCancel">✖</button>
      </div>

      <div class="space-y-3">
        <div class="mb-3">
          <label for="markerName" class="block text-sm font-medium text-gray-700 mb-1">{{ t('marker.markerName') }}</label>
          <input id="markerName" v-model="markerData.name" type="text" :placeholder="t('marker.markerName')" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
        </div>

        <div class="mb-3">
          <label for="markerType" class="block text-sm font-medium text-gray-700 mb-1">{{ t('marker.markerType') }}</label>
          <select
              id="markerType"
              v-model="markerData.type"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
       focus:ring-blue-500 text-base"
          >
            <option v-for="type in markerTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="markerCoordinates" class="block text-sm font-medium text-gray-700 mb-1">{{ t('marker.markerCoordinates') }}</label>
          <div class="flex gap-2">
            <input v-model.number="markerData.lat" type="number" class="w-1/2 p-3 border rounded-lg" :placeholder="t('marker.latitude')" />
            <input v-model.number="markerData.lng" type="number" class="w-1/2 p-3 border rounded-lg" :placeholder="t('marker.longitude')" />
          </div>
        </div>

        <div>
          <!-- Button to open the map modal -->
          <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              @click="openMapModal"
          >
            Select Marker Coordinates
          </button>

          <!-- Map Modal -->
          <GetCoordinatesMapModal
              :isOpen="isMapModalVisible"
              @onClose="closeMapModal"
              @coordinateSelected="handleCoordinateSelected"
          />
        </div>

        <div class="mb-3">
          <label for="markerDescription" class="block text-sm font-medium text-gray-700 mb-1">{{ t('marker.markerDescription') }}</label>
          <textarea id="markerDescription" v-model="markerData.description" :placeholder="t('marker.markerDescription')" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"></textarea>
        </div>
      </div>

      <div v-if="formError" class="mt-3 mb-1 text-red-600 text-sm text-center">{{ formError }}</div>

      <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
        <button class="order-2 sm:order-1 w-full sm:w-auto px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors duration-200 text-base" @click="handleSubmit">
          {{ isUpdate ? t('marker.updateMarker') : t('marker.newMarker') }}
        </button>
        <button class="order-1 sm:order-2 w-full sm:w-auto px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200 text-base" @click="handleCancel">
          {{ t('marker.close') }}
        </button>

        <ConfirmationModal v-if="showConfirmation" :message="t('marker.leaveMessage')" :confirm-text="t('marker.quit')" :cancel-text="t('marker.stay')" @confirm="confirmCancel" @cancel="cancelConfirmation" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>