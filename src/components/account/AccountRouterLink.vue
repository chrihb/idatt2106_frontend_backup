<script setup>
import {useI18n} from "vue-i18n";

defineProps({
  setting: {
    id: Number,
    description: String,
    icon: String,
    route: String,
    adminNeeded: Boolean,
    superAdminNeeded: Boolean,
  },
  iconMap: {
    type: [Object]
  },
});

const {t} = useI18n();
</script>

<template>
  <router-link
      :to="setting.route"
      class="flex flex-col justify-center items-center bg-kf-white-contrast-1 shadow-md rounded-lg p-2 h-40">
    <component :is="iconMap[setting.icon]" class="w-12 h-12 text-kf-blue mb-2"/>
    <p class="text-center text-kf-blue font-bold">{{ t(setting.description) }}</p>
  </router-link>
</template>

<style scoped>
</style>
