<script setup>
import { ref } from "vue";

const news = ref([
  {
    title: "Breaking News: Major Event Happens",
    content: "Details about the major event that just happened.",
    date: "2023-10-01",
    time: "10:00",
    severity: "high",
  },
  {
    title: "Local News: Community Event Announced",
    content: "Information about an upcoming community event.",
    date: "2023-10-02",
    time: "12:00",
    severity: "high",
  },
  {
    title: "Community Event Announced",
    content: "Details about a community event that is happening soon.",
    date: "2023-10-03",
    time: "15.26",
    severity: "medium",
  }
]);
</script>

<template>
  <div id="news-page" class="flex flex-col p-4">
    <div id="title" class="flex flex-row">
      <h1 class="text-2xl font-bold mb-4 text-kf-blue">News</h1>
    </div>
    <div id="news-container" class="flex flex-col justify-center gap-1">
      <div v-for="(publishing, index) in news" :key="index" class="bg-kf-white-contrast-1 shadow-md rounded-lg p-2 mb-4
              grid grid-cols-5 grid-rows-2">
        <h2 class="text-xl font-bold text-kf-blue col-start-1 col-span-4 row-start-1">{{ publishing.title }}</h2>
        <p class="text-gray-700 col-start-1 col-span-4 row-start-2">{{ publishing.content }}</p>
        <p class="text-sm col-start-5 row-start-2">Date: {{ publishing.date }} | Time: {{ publishing.time }}</p>
      </div>
    </div>
  </div>
</template>
