<script setup>
import {computed, onMounted, ref} from 'vue';
import { useEmergencyZoneStore } from '@/stores/emergencyZoneStore.js';
import { useEmergencyZonesStore } from '@/stores/emergencyZonesStore.js';
import { useI18n } from 'vue-i18n';
import CreatePolygonMapModal from '@/components/map/CreatePolygonMapModal.vue';
import ConfirmationModal from "@/components/common/ConfirmationModal.vue";
import { getAddressSuggestions, getAddress} from "@/utils/addressTranslationUtil.js";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";

const { t } = useI18n();
const props = defineProps({
  zoneId: {
    type: Number,
    default: null,
  },
  display: {
    type: Boolean,
    default: false,
  },
});

const zoneData = ref({
  name: '',
  type: '',
  level: null,
  address: '',
  lat: null,
  lng: null,
  coordinates: [],
  description: '',
});

const emit = defineEmits(['close', 'zoneSaved']);

const emergencyZoneStore = useEmergencyZoneStore();
const emergencyZonesStore = useEmergencyZonesStore();
const zoneService = emergencyZoneService();
const isUpdate = computed(() => props.zoneId !== null);

const addressSuggestions = ref([]);
const isAddressMode = ref(true);
const formIncomplete = ref(false);
const showConfirmation = ref(false);
const isMapModalVisible = ref(false);
const formError = ref('');
const zoneTypes = ref([]);

const openMapModal = () => {
  isMapModalVisible.value = true;
};

const closeMapModal = () => {
  isMapModalVisible.value = false;
};

const handleCoordinatesSelected = (coordinates) => {
  zoneData.value.coordinates = coordinates;
  closeMapModal();
};

const setInputMode = () => {
  isAddressMode.value = !isAddressMode.value;
};

const validateData = (data) => {
  let error = '';
  if (!data.name) {
    error = t('zone.nameRequired');
    return { valid: false, error: error};
  }
  if (!data.level) {
    error = t('zone.levelRequired');
    return { valid: false, error: error};
  }
  if (data.level < 1 || data.level > 3) {
    error = t('zone.levelIncorrectValue');
    return { valid: false, error: error };
  }
  if (!data.type) {
    error = t('zone.typeRequired');
    return { valid: false, error: error};
  }
  if (isAddressMode.value && !data.address) {
    error = t('zone.addressRequired');
    return { valid: false, error: error};
  }
  if (!isAddressMode.value && !data.lat) {
    error = t('zone.latRequired');
    return { valid: false, error: error};
  }
  if (data.lat < -90 || data.lat > 90) {
    error = t('zone.latOutOfRange');
  }
  if (!isAddressMode.value && !data.lng) {
    error = t('zone.lngRequired');
    return { valid: false, error: error };
  }
  if (data.lng < -180 || data.lng > 180) {
    error = t('zone.lngOutOfRange');
  }
  if (!data.coordinates) {
    error = t('zone.coordinatesRequired');
    return { valid: false, error: error};
  }
  if (data.coordinates.length < 3)  {
    error = t('zone.coordinatesAmountRequired');
    return { valid: false, error: error };
  }
  if (!data.coordinates.length % 2 !== 0) {
    error = t('zone.coordinatesPairRequired');
    return { valid: false, error: error };
  }
  if (!data.description) {
    error = t('zone.nameRequired');
    return { valid: false, error: error};
  }
  return { valid: true };
};

const handleSubmit = async () => {
  try {
    if (isAddressMode.value) {
      const result = await getAddressSuggestions(zoneData.value.address);
      if (result.length > 0) {
        zoneData.value.lat = result[0].lat;
        zoneData.value.lng = result[0].lon;
      } else {
        console.error(t('zone.addressNotFound'));
      }
    } else if (!isAddressMode.value) {
      const address = await getAddress(zoneData.value.lat, zoneData.value.lng);
      if (address) {
        zoneData.value.address = address;
      } else {
        console.error(t('zone.coordinatesNotFound'));
      }
    }

    const result = validateData(zoneData.value);

    if (!result.valid) {
      formError.value = result.error;
      console.log("Validation failed:", result.error); // Debug validation errors
      return;
    }
    formError.value = ''
    const response = await emergencyZoneStore.saveEmergencyZone(zoneData);

    if (response.success) {
      formIncomplete.value = false;
      resetForm();
      emit('zoneSaved', zoneData.value);
      close();
    } else {
      console.error(t('zone.errorSavingZone'));
    }
  } catch (error) {
    console.error(t("Error during submission:", error));
  }
}

const loadZoneData = async () => {
  if (isUpdate.value) {
    try {
      const zone = emergencyZonesStore.getEmergencyZoneById(props.zoneId);
      if (zone) {
        zoneData.value = { ...zone };
      } else {
        const fetchedZone = await emergencyZoneStore.fetchEmergencyZoneDetailsById(props.zoneId);
        zoneData.value = { ...fetchedZone };
      }
    } catch (error) {
      console.error('Error loading zone data:', error);
    }
  }
};

const close = () => {
  resetForm();
  emit('close');
};

const resetForm = () => {
  zoneData.value = {
    name: '',
    type: '',
    level: null,
    address: '',
    lat: null,
    lng: null,
    coordinates: [],
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

const fetchAddressSuggestions = async (query) => {
  if (!query || query.length < 5) {
    addressSuggestions.value = [];
    return;
  }

  const suggestions = await getAddressSuggestions(query);

  addressSuggestions.value = suggestions
      .map((suggestion) => {
        const { road = '', house_number = '', postcode = '', city = '', town = '', village = '' } =
        suggestion.address || {};
        suggestion.displayName = `${road} ${house_number}, ${postcode} ${city || town || village}`.trim();
        return suggestion;
      })
      .filter((suggestion) => suggestion.displayName && suggestion.displayName !== ',' && suggestion.displayName.length > 1);
};

const selectSuggestion = (suggestion) => {
  zoneData.value.address = suggestion.displayName;
  addressSuggestions.value = [];
};

const fetchZoneTypes = async () => {
  const types = await zoneService.getZoneTypes();
  zoneTypes.value = types.map((type) => type.type);
}

onMounted(async () => {
  try {
    await loadZoneData();
    await fetchZoneTypes();
  } catch (error) {
    console.error("Error in onMounted", error);
  }
});
</script>

<template>
  <div class="w-full max-w-7xl mx-auto">
    <Teleport to="body">
      <div v-if="display" class="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-0">
        <div class="bg-white rounded-lg shadow-xl w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-auto p-4
         sm:p-6 max-w-3xl">
          <div class="flex flex-row justify-between items-center mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-800">
              {{ isUpdate ? t('zone.updateZone') : t('zone.newZone') }}
            </h1>

            <!-- Close Button -->
            <button
                class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2
                 rounded-full hover:bg-gray-100"
                @click="handleCancel"
            >
              ✖
            </button>
          </div>

          <!-- Form Fields -->
          <!-- Zone Name -->
          <div class="space-y-3">
            <div class="mb-3">
              <label for="zoneName" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.zoneName') }}
              </label>
              <input
                  id="zoneName"
                  v-model="zoneData.name"
                  type="text"
                  :placeholder="t('zone.zoneName')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-500 text-base"
              />
            </div>

            <!-- Zone Type -->
            <div class="mb-3">
              <label for="zoneType" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.zoneType') }}
              </label>
              <select
                  id="zoneType"
                  v-model="zoneData.type"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
       focus:ring-blue-500 text-base"
              >
                <option v-for="type in zoneTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>

            </div>

            <!-- Emergency Level -->
            <div class="mb-3">
              <label for="zoneLevel" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.emergencyLevel') }}
              </label>
              <select
                  id="zoneLevel"
                  v-model="zoneData.level"
                  class="border border-gray-300 w-full rounded-lg p-3 text-base text-black focus:ring-2
                   focus:ring-blue-500 bg-white"
              >
                <option value="1">{{ t('zone.emergencyLevel1') }}</option>
                <option value="2">{{ t('zone.emergencyLevel2') }}</option>
                <option value="3">{{ t('zone.emergencyLevel3') }}</option>
              </select>
            </div>

            <!-- Polygon Coordinates-->
            <div class="mb-3">
              <label for="zonePolygonCoordinates" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.zonePolygonCoordinates') }}
              </label>
              <textarea
                  id="zonePolygonCoordinates"
                  v-model="zoneData.coordinates"
                  :placeholder="t('zone.zoneCoordinatesDescription')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-500 text-base"
              ></textarea>

              <CreatePolygonMapModal
                  :isOpen="isMapModalVisible"
                  @onClose="closeMapModal"
                  @coordinatesSelected="handleCoordinatesSelected"
              />
              <button
                  class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  @click="openMapModal"
              >
                {{ t('zone.createPolygonOnMap') }}
              </button>
            </div>

            <!-- Conditionally Rendered Fields -->

            <!-- Toggle Button -->
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">{{ t('zone.inputMode') }}</label>
              <div class="flex gap-2">
                <!-- Address Mode Button -->
                <button
                    :class="isAddressMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
                    class="px-4 py-2 rounded-lg"
                    @click="setInputMode(true)"
                >
                  {{ t('zone.useAddress') }}
                </button>
                <!-- Lat/Lng Mode Button -->
                <button
                    :class="!isAddressMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
                    class="px-4 py-2 rounded-lg"
                    @click="setInputMode(false)"
                >
                  {{ t('zone.useLatLng') }}
                </button>
              </div>
            </div>

            <!-- Address or Coordinates -->
            <div v-if="isAddressMode" class="mb-4">
              <label class="block text-sm font-medium mb-1">{{ t('zone.zoneAddress') }}</label>
              <input
                  v-model="zoneData.address"
                  type="text"
                  class="w-full p-3 border rounded-lg"
                  :placeholder="t('zone.zoneAddress')"
                  @input="fetchAddressSuggestions($event.target.value)"
              />
              <ul v-if="addressSuggestions.length" class="bg-white border rounded mt-2 shadow">
                <li
                    v-for="(suggestion, index) in addressSuggestions"
                    :key="index"
                    class="p-2 hover:bg-kf-white-contrast-3 rounded cursor-pointer"
                    @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion.displayName }}
                </li>
              </ul>
            </div>

            <div v-else class="mb-4">
              <label class="block text-sm font-medium mb-1">{{ t('zone.zoneCoordinates') }}</label>
              <div class="flex gap-2">
                <input
                    v-model.number="zoneData.lat"
                    type="number"
                    class="w-1/2 p-3 border rounded-lg"
                    :placeholder="t('zone.latitude')"
                />
                <input
                    v-model.number="zoneData.lng"
                    type="number"
                    class="w-1/2 p-3 border rounded-lg"
                    :placeholder="t('zone.longitude')"
                />
              </div>
            </div>

            <!-- Description Field -->
            <div class="mb-3">
              <label for="zoneDescription" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.zoneDescription') }}
              </label>
              <textarea
                  id="zoneDescription"
                  v-model="zoneData.description"
                  :placeholder="t('zone.zoneDescription')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-500 text-base"
              ></textarea>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="formError" class="mt-3 mb-1 text-red-600 text-sm text-center">
            {{ formError }}
          </div>

          <!-- Save and Cancel Buttons -->
          <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
            <button
                class="order-2 sm:order-1 w-full sm:w-auto px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg
                 text-white font-medium transition-colors duration-200 text-base"
                @click="handleSubmit"
            >
              {{ isUpdate ? t('zone.updateZone') : t('zone.newZone') }}
            </button>
            <button
                class="order-1 sm:order-2 w-full sm:w-auto px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg
                 text-gray-800 font-medium transition-colors duration-200 text-base"
                @click="handleCancel"
            >
              {{ t('zone.close') }}
            </button>

            <ConfirmationModal
                v-if="showConfirmation"
                :message="t('zone.leaveMessage')"
                :confirm-text="t('zone.quit')"
                :cancel-text="t('zone.stay')"
                @confirm="confirmCancel"
                @cancel="cancelConfirmation"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>

</style>