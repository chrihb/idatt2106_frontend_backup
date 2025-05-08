<script setup>
import {onMounted, ref} from 'vue';
import { useEmergencyZonesStore } from '@/stores/emergencyZonesStore.js';
import UpdateEmergencyZoneModal from '@/components/map/UpdateEmergencyZoneModal.vue';
import Map from '@/components/map/Map.vue';
import {useI18n} from "vue-i18n";
import {useEmergencyZoneStore} from "@/stores/emergencyZoneStore.js";
import ConfirmationModal from "@/components/common/ConfirmationModal.vue";

const showDeleteConfirmation = ref(false);
const zoneToDelete = ref(null);
const { t } = useI18n();
const emergencyZonesStore = useEmergencyZonesStore();
const emergencyZoneStore = useEmergencyZoneStore();
const emergencyZones = ref([]);
const isZoneEditorVisible = ref(false);
const selectedZoneId = ref(null);

const fetchZones = async () => {
  try {
    await emergencyZonesStore.fetchAllEmergencyZones(false);
    emergencyZones.value = emergencyZonesStore.getEmergencyZones()
  } catch (error) {
    console.error('Error fetching emergency zones:', error);
  }
};

const openZoneEditor = async (zoneId) => {
  try {
    if (zoneId) {
      const zone = emergencyZonesStore.getEmergencyZoneById(zoneId);
      if (zone) {
        emergencyZoneStore.setEmergencyZone(zone);
      } else {
        await emergencyZoneStore.fetchEmergencyZoneDetailsById(zoneId);
      }
    } else {
      emergencyZoneStore.clearEmergencyZoneState();
    }
    selectedZoneId.value = zoneId;
    isZoneEditorVisible.value = true;
  } catch (error) {
    console.error('Error loading zone details:', error);
  }
};

const closeZoneEditor = () => {
  isZoneEditorVisible.value = false;
  selectedZoneId.value = null;
};

const handleZoneSaved = async () => {
  console.log('Zone saved successfully!');
  await fetchZones();
  closeZoneEditor();
};

const removeZone = async (zoneId) => {
  try {
    console.log("ZoneID: ", zoneId);
    const zone = emergencyZonesStore.getEmergencyZoneById(zoneId);
    emergencyZoneStore.setEmergencyZone(zone);
    await emergencyZoneStore.deleteEmergencyZone(zoneId);
    await fetchZones();
    console.log(`Zone with ID ${zoneId} removed successfully.`);
  } catch (error) {
    console.error('Error removing zone:', error);
  }
};

const confirmDeleteZone = (zoneId) => {
  zoneToDelete.value = zoneId;
  showDeleteConfirmation.value = true;
};

const handleDeleteConfirmed = async () => {
  if (zoneToDelete.value) {
    await removeZone(zoneToDelete.value);
    zoneToDelete.value = null;
  }
  showDeleteConfirmation.value = false;
};

const handleDeleteCancelled = () => {
  showDeleteConfirmation.value = false;
  zoneToDelete.value = null;
};

onMounted(() => {
  try {
    fetchZones();
  } catch (error) {
    console.error('Error fetching zones:', error);
  }
});
</script>

<template>
  <div class="pt-2 pb-2 flex h-full w-full">
    <!-- Map Component on left -->
    <div class="w-5/8 h-full pr-4">
      <Map />
    </div>
    <!-- Emergency Zones List on right -->
    <div class="w-3/8 h-full p-4 overflow-y-auto">
      <h1 class="text-xl font-bold mb-4">{{t("zone.emergencyZones")}}</h1>
      <div >
        <button
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
            @click="openZoneEditor(null)"
        >
          {{t('zone.createNewZone')}}
        </button>
      </div>
      <ul class="space-y-3">
        <li v-for="zone in emergencyZones" :key="zone.zoneId" class="p-4 border rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold">{{ zone.name }}</h2>
              <p class="text-sm text-gray-600">{{ zone.type }} - Level {{ zone.level }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  @click="openZoneEditor(zone.zoneId)"
              >
                {{t('zone.edit')}}
              </button>
              <button
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  @click="confirmDeleteZone(zone.zoneId)"
              >
                {{t('zone.delete')}}
              </button>
            </div>
          </div>
        </li>
      </ul>

      <UpdateEmergencyZoneModal
          :zoneId="selectedZoneId"
          :display="isZoneEditorVisible"
          @close="closeZoneEditor"
          @zoneSaved="handleZoneSaved"

      />

      <ConfirmationModal
          v-if="showDeleteConfirmation"
          :message="t('zone.deleteMessage')"
          :confirm-text="t('zone.delete')"
          :cancel-text="t('zone.cancel')"
          @confirm="handleDeleteConfirmed"
          @cancel="handleDeleteCancelled"
      />
    </div>
  </div>
</template>

<style scoped>

</style>