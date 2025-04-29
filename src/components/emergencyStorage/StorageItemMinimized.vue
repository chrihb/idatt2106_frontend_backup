<script setup lang="js">
import {defineProps, defineEmits} from 'vue';
import {useI18n} from "vue-i18n";

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
       class="flex flex-col bg-white rounded-lg border-1 border-gray-800 shadow-md p-4 mb-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold text-lg text-gray-700">{{ amount }} {{ unit }}</div>
      <div class="text-lg text-gray-800 max-w-80 text-wrap break-words">{{ name }}</div>
      <div class="flex items-center gap-1">
        <div class="text-sm text-gray-500 mr-3">{{ t("storage.expiration-date") }}:
          {{ expirationDate }}
        </div>
        <button
            v-if="possibleUpdate"
            @click="handleUpdate"
            class="px-3 py-1 bg-kf-orange rounded text-white text-sm font-medium transition-colors duration-200">
          {{ t("storage.update-item") }}
        </button>
        <button
            v-if="possibleUpdate"
            @click="handleDelete"
            class="px-3 py-1 bg-kf-red rounded text-white text-sm font-medium transition-colors duration-200">
          {{ t("storage.delete-item") }}
        </button>
      </div>
    </div>
    <p
        v-if="!possibleUpdate"
        class="flex justify-center items-center text-gray-500">
      {{ t("storage.more-info") }}
    </p>
  </div>
</template>