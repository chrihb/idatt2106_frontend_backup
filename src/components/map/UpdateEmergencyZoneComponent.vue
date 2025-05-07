<script setup>
import { computed, ref} from 'vue';
import { useEmergencyZoneStore } from '@/stores/emergencyZoneStore.js';
import { useEmergencyZonesStore } from '@/stores/emergencyZonesStore.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps(['zoneId', 'display']);
const emit = defineEmits(['close', 'zoneSaved']);

const emergencyZoneStore = useEmergencyZoneStore();
const emergencyZonesStore = useEmergencyZonesStore();

const isUpdate = computed(() => props.zoneId !== null);

const zoneData = ref({
  name: '',
  type: '',
  level: 1,
  coordinates: [],
  address: '',
  description: '',
});

const formIncomplete = ref(false);
const showConfirmation = ref(false);

// Load zone data if updating
if (isUpdate.value) {
  const zone = emergencyZonesStore.getEmergencyZoneById(props.zoneId);
  if (zone) {
    zoneData.value = { ...zone };
  }
}

// Save or update zone
const saveZone = async () => {
  if (!zoneData.value.name || !zoneData.value.coordinates.length) {
    formIncomplete.value = true;
    return;
  }

  try {
    await emergencyZoneStore.saveEmergencyZone(zoneData.value);

    emit('zoneSaved');
    emit('close');
  } catch (error) {
    console.error('Error saving zone:', error);
  }
};

const close = () => {
  emit('close');
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
            <button
                class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2
                 rounded-full hover:bg-gray-100"
                @click="handleCancel"
            >
              ✖
            </button>
          </div>

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

            <div class="mb-3">
              <label for="zoneType" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.zoneType') }}
              </label>
              <input
                  id="zoneType"
                  v-model="zoneData.type"
                  type="text"
                  :placeholder="t('zone.zoneType')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-500 text-base"
              />
            </div>

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

            <div class="mb-3">
              <label for="zoneCoordinates" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.zoneCoordinates') }}
              </label>
              <textarea
                  id="zoneCoordinates"
                  v-model="zoneData.coordinates"
                  :placeholder="t('zone.zoneCoordinatesDescription')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-500 text-base"
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="zoneAddress" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('zone.zoneAddress') }}
              </label>
              <input
                  id="zoneAddress"
                  v-model="zoneData.address"
                  type="text"
                  :placeholder="t('zone.zoneAddress')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                   focus:ring-blue-500 text-base"
              />
            </div>

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

          <div v-if="formIncomplete" class="mt-3 mb-1 text-red-600 text-sm text-center">
            {{ t('zone.fillAllFields') }}
          </div>

          <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
            <button
                class="order-2 sm:order-1 w-full sm:w-auto px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg
                 text-white font-medium transition-colors duration-200 text-base"
                @click="saveZone"
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
          </div>

          <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 shadow-xl max-w-md w-full">
              <p class="mb-4 sm:mb-6 text-base sm:text-lg">{{ t('zone.leaveMessage') }}</p>
              <div class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3">
                <button
                    class="w-full sm:w-auto order-2 sm:order-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg
                     text-gray-800 font-medium transition-colors duration-200 text-base"
                    @click="cancelConfirmation"
                >
                  {{ t('zone.stay') }}
                </button>
                <button
                    class="w-full sm:w-auto order-1 sm:order-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg
                     text-white font-medium transition-colors duration-200 text-base"
                    @click="confirmCancel"
                >
                  {{ t('zone.quit') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>

</style>