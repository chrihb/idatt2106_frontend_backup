<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPreparednessStatus } from '@/services/storageService';
import StorageStatus from '@/components/emergencyStorage/StorageStatus.vue';

const router = useRouter();
const households = ref([]);

onMounted(async () => {
  try {
    households.value = await getPreparednessStatus(); // [{ id, householdName, status }]
  } catch (e) {
  }
});

function goToStorage(id) {
  router.push(`/storage/${id}`);
}
</script>

<template>
  <div class="container p-2">

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="household in households"
          :key="household"
          @click="goToStorage(household.id)"
          class="cursor-pointer"
      >
        <StorageStatus
            :title="household.name"
            :daysOfFood="household.status.daysOfFood"
            :daysOfWater="household.status.daysOfWater"
        />
      </div>
    </div>

    <div v-if="households.length === 0" class="text-gray-500 text-center mt-8">
      Ingen husholdninger funnet.
    </div>
  </div>
</template>
