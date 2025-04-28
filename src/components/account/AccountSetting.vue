<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  setting: {
    id: Number,
    description: String,
    icon: String,
    route: String,
    toggleButton: Boolean,
    toggleState: Boolean,
    admin: Boolean,
  },
  iconMap: {
    type: [Object]
  },
});

const { t } = useI18n();
const emits = defineEmits(["toggle"]);
</script>

<template>
  <router-link
      v-if="setting.type === 'routerLink'"
      :to="setting.route"
      class="flex flex-col justify-center items-center bg-kf-white-contrast-1 shadow-md rounded-lg p-2 h-40">
    <component :is="iconMap[setting.icon]" class="w-12 h-12 text-kf-blue mb-2" />
    <p class="text-center text-kf-blue font-bold">{{ t(setting.description) }}</p>
  </router-link>

  <button
      v-if="setting.type === 'toggleButton'"
      class="flex flex-col gap-4 justify-center items-center bg-kf-white-contrast-1 shadow-md rounded-lg p-2 h-40">
    <span
        @click="emits('toggle', setting.id)"
        class="cursor-pointer w-16 h-8 mt-2 rounded-full flex items-center"
        :class="setting.toggleState ? 'bg-green-500' : 'bg-kf-blue'">
      <span
          class="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"
          :class="setting.toggleState ? 'translate-x-9' : 'translate-x-1'"/>
    </span>
    <span class="text-center text-kf-blue font-bold">{{ t(setting.description) }}</span>
  </button>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>