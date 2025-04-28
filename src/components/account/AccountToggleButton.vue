<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  setting: {
    id: Number,
    description: String,
    toggleState: Boolean,
    adminNeeded: Boolean,
    superAdminNeeded: Boolean,
  },
  iconMap: {
    type: [Object]
  },
});

const { t } = useI18n();
const emits = defineEmits(["toggle"]);
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <label class="text-kf-blue font-semibold text-sm">
      {{ t(setting.description) }}
    </label>

    <label class="relative inline-flex items-center cursor-pointer">
      <input
          type="checkbox"
          class="sr-only peer"
          :checked="setting.toggleState"
          @change="emits('toggle', setting.id)"
      />
      <span
          class="w-14 h-8 bg-kf-blue rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"
      ></span>
      <span
          class="absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"
      ></span>
    </label>
  </div>
</template>

<style scoped>

</style>