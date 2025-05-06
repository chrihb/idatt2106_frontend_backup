<script setup>
import { computed } from 'vue';
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/24/solid";
import { useI18n } from "vue-i18n";

const props = defineProps({
  title: String,
  daysOfFood: Number,
  daysOfWater: Number
});

const { t } = useI18n();

const effectiveDays = computed(() => Math.floor(Math.min(props.daysOfFood, props.daysOfWater)));

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

const statusIcon = computed(() => {
  if (effectiveDays.value >= 7) return { icon: CheckCircleIcon, color: 'text-kf-green' };
  if (effectiveDays.value >= 3) return { icon: ExclamationTriangleIcon, color: 'text-kf-orange' };
  return { icon: ExclamationCircleIcon, color: 'text-kf-red' };
});

const statusMessage = computed(() => {
  return t(`storage-status.level.status`, {
    effectiveDays: effectiveDays.value,
  });
});
</script>

<template>
  <div class="bg-kf-white w-full flex flex-col gap-4 items-center shadow-lg rounded-2xl py-6 px-6">


    <h1 class="text-xl font-semibold text-kf-blue text-center leading-snug">
        {{ title || t('storage-status.title') }}</h1>


    <div class="w-full max-w-xs mb-2">
      <div class="bg-kf-white-contrast-4 rounded-sm h-10 overflow-hidden">
        <div class="h-10 rounded-sm transition-all duration-500 ease-in-out"
          :class="progressColor"
          :style="{ width: progressStepWidth }"
        ></div>
      </div>
    </div>

    <div class="flex items-center gap-2 px-2 mt-2">
      <component :is="statusIcon.icon" class="size-6" :class="statusIcon.color" />
      <p class="text-sm text-center text-kf-blue leading-relaxed">
        {{ statusMessage }}
      </p>
    </div>

  </div>
</template>
