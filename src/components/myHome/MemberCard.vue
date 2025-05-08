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
  <div class="px-4 py-2 w-full border min-w-50 border-kf-blue rounded shadow flex justify-between items-center">
    <h2 class="text-lg text-kf-blue overflow-hidden whitespace-nowrap text-ellipsis cursor-default">
      {{ member.name }}
    </h2>    <TrashIcon
        v-if="isAdmin"
        class="size-6 text-kf-red cursor-pointer hover:text-kf-white-contrast-8"
        @click="$emit('delete', member)"
    />
  </div>
</template>

<style scoped>
</style>
