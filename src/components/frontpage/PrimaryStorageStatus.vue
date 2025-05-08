<script setup>
import { onMounted, ref } from 'vue';
import { getPreparednessStatus } from '@/services/storageService';
import { getPrimaryHousehold } from '@/services/householdService.js';
import StorageStatus from '../emergencyStorage/StorageStatus.vue';

const primaryHousehold = ref(null);

onMounted(async () => {
  try {
    const statusList = await getPreparednessStatus();
    const primary = await getPrimaryHousehold();

    if (primary?.id && Array.isArray(statusList)) {
      const match = statusList.find(h => h.id === primary.id);
      if (match) {
        primaryHousehold.value = match;
      } else {
        console.warn("Primary household not found in preparedness status list.");
      }
    }
  } catch (error) {
    console.error("Feil ved henting av beredskapsstatus:", error);
  }
});
</script>


<template>
  <div v-if="primaryHousehold" class="cursor-pointer" @click="$router.push(`/storage/${primaryHousehold.id}`)">
    <StorageStatus
      :title="primaryHousehold.name"
      :daysOfFood="primaryHousehold.status.daysOfFood"
      :daysOfWater="primaryHousehold.status.daysOfWater"
    />
  </div>
</template>
