<script setup>
import { onMounted, ref } from 'vue';
import { useMarkersStore } from '@/stores/markersStore.js';
import { useMarkerStore } from '@/stores/markerStore.js';
import UpdateMarkerModal from '@/components/map/UpdateMarkerModal.vue';
import Map from '@/components/map/Map.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const markersStore = useMarkersStore();
const markerStore = useMarkerStore();

const markers = ref([]);
const isMarkerEditorVisible = ref(false);
const selectedMarkerId = ref(null);
const showDeleteConfirmation = ref(false);
const markerToDelete = ref(null);

const fetchMarkers = async () => {
  try {
    await markersStore.fetchAllMarkers(false);
    markers.value = markersStore.getMarkers();
  } catch (error) {
    console.error('Error fetching markers:', error);
  }
};

const openMarkerEditor = async (markerId) => {
  try {
    if (markerId) {
      const marker = markersStore.getMarkerById(markerId);
      if (marker) {
        markerStore.setMarker(marker);
      } else {
        await markerStore.fetchMarkerDetailsById(markerId);
      }
    } else {
      markerStore.clearMarker();
    }
    selectedMarkerId.value = markerId;
    isMarkerEditorVisible.value = true;
  } catch (error) {
    console.error('Error loading marker details:', error);
  }
};

const closeMarkerEditor = () => {
  isMarkerEditorVisible.value = false;
  selectedMarkerId.value = null;
};

const handleMarkerSaved = async () => {
  console.log('Marker saved successfully!');
  await fetchMarkers();
  closeMarkerEditor();
};

const confirmDeleteMarker = (markerId) => {
  markerToDelete.value = markerId;
  showDeleteConfirmation.value = true;
};

const handleDeleteConfirmed = async () => {
  if (markerToDelete.value) {
    try {
      await markerStore.deleteMarker(markerToDelete.value);
      await fetchMarkers();
      console.log(`Marker with ID ${markerToDelete.value} removed successfully.`);
    } catch (error) {
      console.error('Error removing marker:', error);
    }
  }
  showDeleteConfirmation.value = false;
  markerToDelete.value = null;
};

const handleDeleteCancelled = () => {
  showDeleteConfirmation.value = false;
  markerToDelete.value = null;
};

onMounted(() => {
  fetchMarkers();
});
</script>

<template>
  <div class="pt-2 pb-2 flex h-full w-full">
    <!-- Map Component on left -->
    <div class="w-5/8 h-full pr-4">
      <Map />
    </div>
    <!-- Markers List on right -->
    <div class="w-3/8 h-full p-4 overflow-y-auto">
      <h1 class="text-xl font-bold mb-4">{{ t('marker.markers') }}</h1>
      <div>
        <button
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
            @click="openMarkerEditor(null)"
        >
          {{ t('marker.createNewMarker') }}
        </button>
      </div>
      <ul class="space-y-3">
        <li v-for="marker in markers" :key="marker.markerId" class="p-4 border rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold">{{ marker.name }}</h2>
              <p class="text-sm text-gray-600">{{ marker.type }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  @click="openMarkerEditor(marker.markerId)"
              >
                {{ t('marker.edit') }}
              </button>
              <button
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  @click="confirmDeleteMarker(marker.markerId)"
              >
                {{ t('marker.delete') }}
              </button>
            </div>
          </div>
        </li>
      </ul>

      <UpdateMarkerModal
          :markerId="selectedMarkerId"
          :display="isMarkerEditorVisible"
          @close="closeMarkerEditor"
          @markerSaved="handleMarkerSaved"
      />

      <ConfirmationModal
          v-if="showDeleteConfirmation"
          :message="t('marker.deleteMessage')"
          :confirm-text="t('marker.delete')"
          :cancel-text="t('marker.cancel')"
          @confirm="handleDeleteConfirmed"
          @cancel="handleDeleteCancelled"
      />
    </div>
  </div>
</template>

<style scoped>
</style>