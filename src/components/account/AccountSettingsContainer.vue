<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  setting: {
    type: Object,
    required: true,
  },
  iconMap: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const emits = defineEmits(["toggleSetting"]);
</script>

<template>
  <router-link v-if="!setting.toggleButton" :to="setting.route"
               class="flex flex-col items-center bg-kf-white-contrast-1 shadow-md rounded-lg p-2">
    <component :is="iconMap[setting.icon]" class="w-12 h-12 text-kf-blue mb-2" />
    <p class="text-center text-kf-blue font-bold">{{ t(setting.name) }}</p>
  </router-link>
  <button v-if="setting.toggleButton" @click="emits('toggleSetting',setting.id)"
          class="cursor-pointer flex flex-col items-center bg-kf-white-contrast-1 shadow-md rounded-lg p-2">
    <component :is="iconMap[setting.icon]" class="w-12 h-12 text-kf-blue mb-2" />
    <span class="text-center text-kf-blue font-bold">{{ t(setting.name) }}</span>
    <span
        class="w-12 h-6 mt-2 rounded-full flex items-center"
        :class="setting.toggleState ? 'bg-green-500' : 'bg-gray-300'"
    >
      <span
          class="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform"
          :class="setting.toggleState ? 'translate-x-6' : 'translate-x-0'"
      ></span>
    </span>
  </button>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>