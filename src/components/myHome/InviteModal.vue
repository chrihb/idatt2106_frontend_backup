<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  inviteLink: {
    type: String,
    required: true,
  },
  inviteCode: {
    type: String,
    required: true,
  },
});

defineEmits(["close"]);

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
};
</script>

<template>
  <div class="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50">
   <div class="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] relative border border-black">
      <h2 class="text-xl font-bold mb-4">{{ t("household.inviteLink") }}</h2>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">{{ t("household.link") }}</label>
        <div class="flex items-center gap-2">
          <input
              type="text"
              :value="inviteLink"
              readonly
              class="w-full px-3 py-2 border rounded"
          />
          <button
              class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
              @click="copyToClipboard(inviteLink)"
          >
            {{ t("household.copy") }}
          </button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">{{ t("household.householdId") }}</label>
        <div class="flex items-center gap-2">
          <input
              type="text"
              :value="inviteCode"
              readonly
              class="w-full px-3 py-2 border rounded"
          />
          <button
              class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
              @click="copyToClipboard(inviteCode)"
          >
            {{ t("household.copy") }}
          </button>
        </div>
      </div>
      <div class="flex justify-end">
        <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            @click="$emit('close')"
        >
          {{ t("household.close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
