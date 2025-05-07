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

// Delete zone
const deleteZone = async () => {
  if (!isUpdate.value) return;

  try {
    await emergencyZoneStore.deleteEmergencyZone();
    emit('zoneSaved');
    emit('close');
  } catch (error) {
    console.error('Error deleting zone:', error);
  }
};
</script>

<template>

</template>

<style scoped>

</style>