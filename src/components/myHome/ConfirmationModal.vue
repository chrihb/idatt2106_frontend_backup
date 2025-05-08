<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  member: {
    type: Object,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["close", "confirm"]);
</script>

<template>
  <div class="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50">
    <div class="flex flex-col justify-between bg-kf-white p-6 rounded-lg shadow-lg max-w-lg w-md min-h-65 relative border border-kf-blue">
      <h2 class="text-2xl text-kf-blue font-bold mb-4">{{ t("household.confirmDelete") }}</h2>
      <p class="mb-4 text-kf-blue text-md">{{ t("household.deleteMember", { name: member.name }) }}</p>
      <div class="flex justify-end gap-4">
        <button
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-kf-white-contrast-8"
            @click="$emit('close')"
        >
          {{ t("household.cancel") }}
        </button>
        <button
            v-if="isAdmin"
            class="bg-kf-red cursor-pointer text-white px-4 py-2 rounded hover:bg-kf-white-contrast-8"
            @click="$emit('confirm')"
        >
          {{ t("household.delete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
