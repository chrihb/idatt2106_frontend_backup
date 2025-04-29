<script setup>
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/24/solid/index.js";
import { useI18n } from "vue-i18n";
import {computed, ref, onMounted, inject} from "vue";
import { useRouter } from "vue-router";
import { getPreparednessStatus } from '@/services/storageService';

const router = useRouter()
const { t } = useI18n();

const isWarning = ref(false); // Replace with actual logic to determine if there is a warning

const progress = ref(0)

const statusMessage = ref('');
const householdId = 1; // Sett dette dynamisk senere, hent fra userStore


const progressStepWidth = computed(() => {
  if (progress.value >= 67) return '100%';
  if (progress.value >= 34) return '66%';
  return '33%';
})
const progressColor = computed(() => {
  if (progress.value >= 67) return 'bg-kf-green';
  if (progress.value >= 34) return 'bg-kf-orange';
  return 'bg-kf-red';
});

const statusKey = computed(() => {
  switch (statusMessage.value) {
    case "Lageret dekker ikke 3 dager med mat og vann":
      return 'storage-status.level.low';
    case "Lageret dekker 3 dager, men ikke 7":
      return 'storage-status.level.medium';
    case "Lageret dekker minst 7 dager":
      return 'storage-status.level.high';
    default:
      return 'storage-status.level.unknown';
  }
});

const statusIcon = computed(() => {
  switch (statusKey.value) {
    case 'storage-status.level.low':
      return { icon: ExclamationCircleIcon, color: 'text-kf-red' };
    case 'storage-status.level.medium':
      return { icon: ExclamationTriangleIcon, color: 'text-kf-orange' };
    case 'storage-status.level.high':
      return { icon: CheckCircleIcon, color: 'text-kf-green' };
    default:
      return { icon: ExclamationTriangleIcon, color: 'text-kf-blue' };
  }
});

onMounted(async () => {
  try {
    const status = await getPreparednessStatus(householdId);
    progress.value = status.preparednessPercent;
    isWarning.value = status.isWarning;
    statusMessage.value = status.message;
  } catch (error) {
    isWarning.value = true;
    statusMessage.value = "Kunne ikke hente beredskapsstatus";
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

      <!-- <p class="text-xs text-center text-gray-500">{{ statusMessage }}</p> -->
      <!-- <p class="text-sm text-center text-kf-blue">{{ t(statusKey) }}</p> -->

      <!-- <button v-if="isWarning" @click="console.log('clicked')" class="flex items-center gap-1 cursor-pointer rounded-lg px-1">
        <ExclamationTriangleIcon class="size-8 text-kf-red"></ExclamationTriangleIcon>
        <label class="text-1xl cursor-pointer text-kf-red">{{ t('storage-status.desc') }}</label>
      </button>
      <div v-else class="flex items-center gap-1 px-1">
        <CheckCircleIcon class="size-8 text-kf-green"/>
        <p class="text-1xl text-kf-green">{{ t("storage-status.ok") }}</p>
      </div> -->
      <div class="flex items-center gap-2 px-1">
        <component :is="statusIcon.icon" class="size-6" :class="statusIcon.color" />
        <p class="text-sm text-center text-kf-blue">{{ t(statusKey) }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>