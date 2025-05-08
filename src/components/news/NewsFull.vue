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
  <div class="bg-kf-white w-full gap-6 grid grid-cols-[1fr_auto] grid-rows-[auto_1fr_auto] py-2 px-2 drop-shadow-md rounded-md">
    <h1 class="text-2xl font-bold">{{ props.title }}</h1>

    <!-- Location + Time -->
    <div class="text-right">
      <p class="text-1xl">{{ props.location }}</p>
      <p class="text-1xl">{{ timeSinceEvent(props.date) }}</p>
    </div>

    <!-- Content spans full width -->
    <p class="text-1xl col-span-2 overflow-hidden text-ellipsis line-clamp-9">{{ props.content }}</p>
  </div>
</template>


<style scoped>

</style>
