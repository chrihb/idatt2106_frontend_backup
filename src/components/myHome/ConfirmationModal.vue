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
  <div class="fixed inset-0 flex justify-center items-center z-50  bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ t("household.confirmDelete") }}</h2>
      <p class="mb-4">{{ t("household.deleteMember", { name: member.name }) }}</p>
      <div class="flex justify-end gap-4">
        <button
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            @click="$emit('close')"
        >
          {{ t("household.cancel") }}
        </button>
        <button
            v-if="isAdmin"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
