<script setup>
import {onMounted, ref} from 'vue';
import { useEmergencyZonesStore } from '@/stores/emergencyZonesStore.js';
import UpdateEmergencyZoneComponent from '@/components/map/UpdateEmergencyZoneComponent.vue';
import MinimalMap from "@/components/map/MinimalMap.vue";

const emergencyZonesStore = useEmergencyZonesStore();
const emergencyZones = ref([]);
const isZoneEditorVisible = ref(false);
const selectedZoneId = ref(null);

const fetchZones = async () => {
  try {
    await emergencyZonesStore.fetchAllEmergencyZones();
    emergencyZones.value = emergencyZonesStore.getEmergencyZones()
  } catch (error) {
    console.error('Error fetching emergency zones:', error);
  }
};

const openZoneEditor = (zoneId) => {
  selectedZoneId.value = zoneId;
  isZoneEditorVisible.value = true;
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

onMounted(() => {
  try {
    fetchZones();
  } catch (error) {
    console.error('Error deleting zone:', error);
  }
});
</script>

<template>
  <div >
    <div>
      <MinimalMap />
    </div>

    <div>
      <h1 class="text-xl font-bold mb-4">Emergency Zones</h1>
      <ul class="space-y-3">
        <li v-for="zone in emergencyZones" :key="zone.zoneId" class="p-4 border rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold">{{ zone.name }}</h2>
              <p class="text-sm text-gray-600">{{ zone.type }} - Level {{ zone.level }}</p>
            </div>
            <button
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                @click="openZoneEditor(zone.zoneId)"
            >
              Edit
            </button>
          </div>
        </li>
      </ul>

      <UpdateEmergencyZoneComponent
          :zoneId="selectedZoneId"
          :display="isZoneEditorVisible"
          @close="closeZoneEditor"
          @zoneSaved="handleZoneSaved"
      />
    </div>
  </div>
</template>

<style scoped>

</style>