<script setup>

import {timeSinceEvent} from "@/utils/timeFormat.js";

const props = defineProps({
  date: {
    date: Date,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  content: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
})

</script>

<template>
  <div class="bg-kf-white w-full gap-6 grid grid-cols-[auto_1fr_auto] py-1 px-1 drop-shadow-md rounded-md items-center">
    <p class="text-1xl">{{ timeSinceEvent(props.date) }}</p>
    <div class="text-1xl truncate">
      <span class="text-1xl font-bold">{{ props.title }}</span>
      <span> - {{ props.content }}</span>
    </div>
    <p class="text-1xl">{{ props.location }}</p>
  </div>
</template>

<style scoped>

</style>
