<script setup>
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/24/solid";
import { useI18n } from "vue-i18n";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getPreparednessStatus } from '@/services/storageService';

const router = useRouter();
const { t } = useI18n();

const daysFood = ref(0);
const daysWater = ref(0);

const effectiveDays = computed(() => Math.floor(Math.min(daysFood.value, daysWater.value)));

const progressStepWidth = computed(() => {
  if (effectiveDays.value >= 7) return '100%';
  if (effectiveDays.value >= 3) return '66%';
  return '33%';
});

const progressColor = computed(() => {
  if (effectiveDays.value >= 7) return 'bg-kf-green';
  if (effectiveDays.value >= 3) return 'bg-kf-orange';
  return 'bg-kf-red';
});

const statusLevel = computed(() => {
  if (effectiveDays.value >= 7) return 'high';
  if (effectiveDays.value >= 3) return 'medium';
  return 'low';
});

const statusIcon = computed(() => {
  if (statusLevel.value === 'low') return { icon: ExclamationCircleIcon, color: 'text-kf-red' };
  if (statusLevel.value === 'medium') return { icon: ExclamationTriangleIcon, color: 'text-kf-orange' };
  if (statusLevel.value === 'high') return { icon: CheckCircleIcon, color: 'text-kf-green' };
  return { icon: ExclamationTriangleIcon, color: 'text-kf-blue' };
});

const statusMessage = computed(() => {
  return t(`storage-status.level.status`, {
    effectiveDays: effectiveDays.value,
  });
});

onMounted(async () => {
  try {
    const statusList = await getPreparednessStatus();

    if (statusList.length > 0) {
      const status = statusList[0]; // Hent første husstand foreløpig
      daysFood.value = status.daysOfFood;
      daysWater.value = status.daysOfWater;
    }
  } catch (error) {
    console.error('Feil ved henting av beredskapsstatus:', error);
    daysFood.value = 0;
    daysWater.value = 0;
  }
});
</script>


<template>
  <div @click="router.push('/storage')" class="cursor-pointer bg-kf-white flex flex-col gap-2 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("storage-status.title") }}</h1>
    <div class="flex-grow justify-center items-center flex flex-col gap-2">
      <div class="w-full max-w-xs">
        <div class="bg-kf-white-contrast-4 rounded-sm h-10 overflow-hidden">
          <div
            class="h-10 rounded-sm transition-all duration-500 ease-in-out"
            :class="progressColor"
            :style="{ width: progressStepWidth }"
          ></div>
        </div>
      </div>

      <div class="flex items-center gap-2 px-1">
        <component :is="statusIcon.icon" class="size-6" :class="statusIcon.color" />
        <p class="text-sm text-center text-kf-blue">
          {{ statusMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>