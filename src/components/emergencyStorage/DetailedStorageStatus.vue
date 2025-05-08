<script setup>
import { computed, ref, onMounted } from 'vue';
import { getPreparednessStatus } from '@/services/storageService';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  householdId: {
    type: [String, Number],
    required: true
  }
});

const { t } = useI18n();

const daysFood = ref(0);
const daysWater = ref(0);

const foodColor = computed(() => {
  if (daysFood.value >= 7) return 'bg-kf-green';
  if (daysFood.value >= 3) return 'bg-kf-orange';
  return 'bg-kf-red';
});

const waterColor = computed(() => {
  if (daysWater.value >= 7) return 'bg-kf-green';
  if (daysWater.value >= 3) return 'bg-kf-orange';
  return 'bg-kf-red';
});

const foodWidth = computed(() => {
  if (daysFood.value >= 7) return '100%';
  if (daysFood.value >= 3) return '66%';
  return '33%';
});

const waterWidth = computed(() => {
  if (daysWater.value >= 7) return '100%';
  if (daysWater.value >= 3) return '66%';
  return '33%';
});

onMounted(async () => {
  try {
    const statuses = await getPreparednessStatus(); // Liste fra backend
    const match = statuses.find(s => String(s.id) === String(props.householdId));
    if (match) {
      daysFood.value = match.status.daysOfFood;
      daysWater.value = match.status.daysOfWater;
    } else {
      console.warn('Fant ingen matching household status');
    }
  } catch (error) {
    console.error("Feil ved henting av status:", error);
    daysFood.value = 0;
    daysWater.value = 0;
  }
});
</script>



<template>
  <div class="bg-kf-white p-4 rounded-xl shadow-md w-full max-w-xl">
    <h2 class="text-xl font-bold text-kf-blue mb-4">{{ t('storage-status.title') }}</h2>

    <!-- Mat -->
    <div class="mb-4">
      <h3 class="text-md font-semibold text-kf-blue mb-2">{{ t('storage-status.food-label') }}</h3>
      <div class="bg-kf-white-contrast-4 rounded-sm h-6 overflow-hidden">
        <div
          class="h-6 rounded-sm transition-all duration-500 ease-in-out"
          :class="foodColor"
          :style="{ width: foodWidth }"
        ></div>
      </div>
      <p class="text-sm text-kf-blue mt-1">{{ t('storage-status.days-food', { days: Math.floor(daysFood) }) }}</p>
    </div>

    <!-- Vann -->
    <div>
      <h3 class="text-md font-semibold text-kf-blue mb-2">{{ t('storage-status.water-label') }}</h3>
      <div class="bg-kf-white-contrast-4 rounded-sm h-6 overflow-hidden">
        <div
          class="h-6 rounded-sm transition-all duration-500 ease-in-out"
          :class="waterColor"
          :style="{ width: waterWidth }"
        ></div>
      </div>
      <p class="text-sm text-kf-blue mt-1">{{ t('storage-status.days-water', { days: Math.floor(daysWater) }) }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>
