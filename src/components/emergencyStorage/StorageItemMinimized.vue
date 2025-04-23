<script setup>
import { defineProps } from 'vue';

defineProps(["name", "amount", "unit", "expirationDate", "id"]);
</script>

<template>
  <div class="flex flex-row items-center justify-between bg-white rounded-lg border-1 border-gray-800 shadow-md p-4 mb-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
    <div class="font-bold text-lg text-gray-700">{{amount}} {{unit}}</div>
    <div class="text-lg text-gray-800">{{name}}</div>
    <div class="text-sm text-gray-500">Utløpsdato: {{expirationDate}}</div>
  </div>
</template>