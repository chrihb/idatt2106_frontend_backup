<script setup lang="js">
import { defineProps, defineEmits } from 'vue';

const props = defineProps(["name", "amount", "unit", "expirationDate", "id", "possibleUpdate"]);
const emit = defineEmits(['update', 'click']);

const handleClick = () => {
  emit('click');
};

const handleUpdate = (event) => {
  event.stopPropagation();
  emit('update', props.id);
};
</script>

<template>
  <div @click="handleClick" class="flex flex-row items-center justify-between bg-white rounded-lg border-1 border-gray-800 shadow-md p-4 mb-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
    <div class="font-bold text-lg text-gray-700">{{amount}} {{unit}}</div>
    <div class="text-lg text-gray-800">{{name}}</div>
    <div class="flex items-center gap-1">
      <div class="text-sm text-gray-500 mr-3">Utløpsdato: {{expirationDate}}</div>
      <button
          v-if="possibleUpdate"
          @click="handleUpdate"
          class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white text-sm font-medium transition-colors duration-200">
        Oppdater
      </button>
      <button
        v-if="possibleUpdate"
        @click="handleDelete"
        class="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm font-medium transition-colors duration-200">
        Slett
      </button>
    </div>
  </div>
</template>