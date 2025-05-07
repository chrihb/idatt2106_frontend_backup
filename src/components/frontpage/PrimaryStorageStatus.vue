<script setup>
import { onMounted, ref } from 'vue';
import { getPreparednessStatus } from '@/services/storageService';
import StorageStatus from '../emergencyStorage/StorageStatus.vue';

const primaryHousehold = ref(null);

onMounted(async () => {
  try {
    const response = await getPreparednessStatus();
    primaryHousehold.value = response[0]; // Hovedhusholdningen kommer først
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
