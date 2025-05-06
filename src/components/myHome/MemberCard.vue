<script setup>
import { TrashIcon } from "@heroicons/vue/24/solid/index.js";

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

defineEmits(["delete"]);
</script>

<template>
  <div class="p-4 border rounded shadow flex justify-between items-center">
    <h2 class="text-lg font-semibold">{{ member.name }}</h2>
    <TrashIcon
        v-if="isAdmin"
        class="w-6 h-6 text-red-500 cursor-pointer hover:text-red-700"
        @click="$emit('delete', member)"
    />
  </div>
</template>

<style scoped>
</style>
