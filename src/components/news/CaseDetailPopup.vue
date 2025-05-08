<script setup>
import {onMounted, ref} from "vue";
import {getCaseDetails} from "@/services/newsService.js";
import {useI18n} from "vue-i18n";
import {XMarkIcon} from "@heroicons/vue/24/solid";
import {timeSinceEvent} from "@/utils/timeFormat.js";

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});

const caseDetails = ref([]);
const isLoading = ref(true);
const error = ref(null);
const t = useI18n().t;

onMounted(async () => {
  try {
    caseDetails.value = await getCaseDetails(props.caseId);
  } catch (err) {
    error.value = "Failed to fetch case details.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 ">
    <div
        class="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto relative border border-black">

      <XMarkIcon class="absolute top-4 right-4 w-8 h-8 cursor-pointer text-red-500"
                 @click="onClose"/>

      <div v-if="isLoading" class="text-center">Loading...</div>
      <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
      <div v-else-if="caseDetails.length === 0" class="text-center"> {{ t("news.noDetails") }}No details available.
      </div>
      <div v-else>
        <h2 class="text-xl font-bold mb-4">{{ caseDetails[0]?.title || 'Case Details' }}</h2>
        <div v-for="(detail) in caseDetails" :key="detail.id" class="mb-4 border-b border-gray-200 pb-2">
          <p class="font-semibold"> {{ detail.content }}</p>
          <p class="text-gray-600">{{ t("news.date") }}: {{ timeSinceEvent(detail.date) }}</p>
          <p class="text-gray-600"> {{ t("news.district") }}: {{ detail.district }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
