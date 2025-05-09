<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const props = defineProps({
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

const { t } = useI18n();

const isAdmin = computed(() => userStore.isAdmin);

const shouldDisplay = computed(() => {
  if (props.setting.superAdminNeeded && !isAdmin.value) return false;
  if (props.setting.adminNeeded && !isAdmin.value) return false;
  return true;
});
</script>

<template>
  <router-link
      v-if="shouldDisplay"
      :to="setting.route"
      class="flex flex-col justify-center items-center bg-kf-white-contrast-1 shadow-md rounded-lg p-2 h-40">
    <component :is="iconMap[setting.icon]" class="w-12 h-12 text-kf-blue mb-2"/>
    <p class="text-center text-kf-blue font-bold">{{ t(setting.description) }}</p>
  </router-link>
</template>
