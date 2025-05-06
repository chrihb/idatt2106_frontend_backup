<script setup lang="js">
import {useI18n} from "vue-i18n";
import {ExclamationTriangleIcon, XCircleIcon} from "@heroicons/vue/24/solid/index.js";

const {t} = useI18n()
const props = defineProps(["name", "amount", "unit", "expirationDate", "id", "possibleUpdate"]);
const emit = defineEmits(['update', 'click']);

const handleClick = () => {
  emit('click');
};

const handleUpdate = (event) => {
  event.stopPropagation();
  emit('update', props.id);
};

const handleDelete = (event) => {
  event.stopPropagation();
  emit('delete', props.id);
};
</script>

<template>
  <div @click="handleClick"
       class="flex flex-col bg-white rounded-lg border border-gray-200 shadow-md p-3 sm:p-4 mb-2 sm:mb-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
      <div class="font-bold text-base sm:text-lg text-gray-700">
        {{ amount }} {{ unit }}
      </div>

      <div
          class="text-base sm:text-lg text-gray-800 break-words line-clamp-2 sm:max-w-xs md:max-w-sm">
        {{ name }}
      </div>

      <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-1 mt-2 sm:mt-0">
        <div class="text-xs sm:text-sm text-gray-500 sm:mr-3 flex flex-row">
          <XCircleIcon class="text-kf-red w-7 h-7" v-if="new Date(props.expirationDate).getTime() < Date.now()"/>
          <ExclamationTriangleIcon class="text-kf-red w-7 h-7" v-if="new Date(props.expirationDate).getTime() < (Date.now() + 31 * 24 * 60 * 60 * 1000) && new Date(props.expirationDate).getTime() >= Date.now()"/>
          {{ t("storage.expiration-date") }}: {{ expirationDate }}
        </div>

        <div class="flex gap-2 w-full sm:w-auto">
          <button
              v-if="possibleUpdate"
              @click="handleUpdate"
              class="px-3 py-1 bg-kf-orange rounded text-white text-xs sm:text-sm font-medium transition-colors duration-200 flex-1 sm:flex-none">
            {{ t("storage.update-item") }}
          </button>
          <button
              v-if="possibleUpdate"
              @click="handleDelete"
              class="px-3 py-1 bg-kf-red rounded text-white text-xs sm:text-sm font-medium transition-colors duration-200 flex-1 sm:flex-none">
            {{ t("storage.delete-item") }}
          </button>
        </div>
      </div>
    </div>

    <p
        v-if="!possibleUpdate"
        class="flex justify-center items-center text-gray-500 text-xs sm:text-sm mt-2">
      {{ t("storage.more-info") }}
    </p>
  </div>
</template>