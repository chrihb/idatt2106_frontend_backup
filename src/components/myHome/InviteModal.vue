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
   <div class="bg-white p-6 rounded-lg shadow-lg w-md relative border border-kf-blue">
      <h2 class="text-2xl text-kf-blue font-bold mb-4">{{ t("household.inviteLink") }}</h2>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">{{ t("household.link") }}</label>
        <div class="flex items-center gap-2">
          <input
              type="text"
              :value="inviteLink"
              readonly
              class="w-full p-2 border border-kf-blue rounded"
          />
          <button
              class="bg-kf-grey text-gray-700 px-2 h-10 cursor-pointer rounded border border-kf-grey active:border-kf-blue hover:bg-kf-white-contrast-8"
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
              class="w-full p-2 border border-kf-blue rounded"
          />
          <button
              class="bg-kf-grey text-gray-700 px-2 h-10 cursor-pointer rounded border border-kf-grey active:border-kf-blue hover:bg-kf-white-contrast-8"
              @click="copyToClipboard(inviteCode)"
          >
            {{ t("household.copy") }}
          </button>
        </div>
      </div>
      <div class="flex justify-end">
        <button
            class="bg-kf-red text-kf-white px-4 py-2 rounded cursor-pointer hover:bg-kf-white-contrast-8"
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
