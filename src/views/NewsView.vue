<script setup>
import { useNewsStore } from "@/stores/newsStore.js";
import { useI18n } from "vue-i18n";
import NewsFull from "@/components/news/NewsFull.vue";

const { t } = useI18n();
const newsStore = useNewsStore();
</script>

<template>
  <div class="py-2 px-2">
    <div class=" bg-kf-white flex flex-col gap-2 items-center shadow-lg rounded-2xl py-2 px-2">
      <h1 class="text-2xl text-kf-blue">{{ t("news.title") }}</h1>
      <div class="flex flex-col gap-1 w-full">
        <div v-for="(publishing, index) in newsStore.articles.slice(0, 6)" :key="index" class="">
          <NewsFull :date="publishing.date" :time="publishing.time" :title="publishing.title" :content="publishing.content" :location="publishing.location"/>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
