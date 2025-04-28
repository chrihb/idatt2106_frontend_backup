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
  <div class="flex flex-row items-center">
    <label class="text-left text-kf-blue font-semibold col-span-2">{{ t(setting.description) }}</label>
    <span
        @click="emits('toggle', setting.id)"
        class="cursor-pointer w-16 h-8 mt-2 rounded-full flex items-center col-span-1"
        :class="setting.toggleState ? 'bg-green-500' : 'bg-kf-blue'">
      <span
          class="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"
          :class="setting.toggleState ? 'translate-x-9' : 'translate-x-1'"/>
    </span>
  </div>

</template>

<style scoped>

</style>