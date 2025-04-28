<script setup>
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/vue/24/solid/index.js";
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

const baseUrl = inject("backendURL");


const progressColor = computed(() => {
  if (progress.value > 75) return 'bg-kf-green'
  if (progress.value > 25) return 'bg-kf-orange'
  return 'bg-kf-red'
})

onMounted(async () => {
  try {
    const status = await getPreparednessStatus(householdId, baseUrl);
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
      <div class="w-sm">
        <div class="bg-kf-white-contrast-4 rounded-sm h-10 overflow-hidden">
          <div
              class="h-10 rounded-sm transition-all duration-500 ease-in-out"
              :class="progressColor"
              :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <p class="text-xs text-center text-gray-500">{{ statusMessage }}</p>

      <button v-if="isWarning" @click="console.log('clicked')" class="flex items-center gap-1 cursor-pointer rounded-lg px-1">
        <ExclamationTriangleIcon class="size-8 text-kf-red"></ExclamationTriangleIcon>
        <label class="text-1xl cursor-pointer text-kf-red">{{ t('storage-status.desc') }}</label>
      </button>
      <div v-else class="flex items-center gap-1 px-1">
        <CheckCircleIcon class="size-8 text-kf-green"/>
        <p class="text-1xl text-kf-green">{{ t("storage-status.ok") }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>