<script setup>
import { useNewsStore } from "@/stores/newsStore.js";

const newsStore = useNewsStore();

</script>

<template>
  <div id="news-page" class="flex flex-col p-4">
    <div id="title" class="flex flex-row">
      <h1 class="text-2xl font-bold mb-4 text-kf-blue">News</h1>
    </div>
    <div id="news-container" class="flex flex-col justify-center gap-1">
      <div v-for="(publishing, index) in newsStore.articles" :key="index" class="bg-kf-white-contrast-1 shadow-md rounded-lg p-2 mb-4
              grid grid-cols-5 grid-rows-2">
        <h2 class="text-xl font-bold text-kf-blue col-start-1 col-span-4 row-start-1">{{ publishing.title }}</h2>
        <p class="text-gray-700 col-start-1 col-span-4 row-start-2">{{ publishing.content }}</p>
        <p class="text-sm col-start-5 row-start-2">Date: {{ publishing.date }} | Time: {{ publishing.time }}</p>
      </div>
    </div>
  </div>
</template>
