<script setup>
import NewsSummary from "@/components/news/NewsSummary.vue";
import { useNewsStore } from "@/stores/newsStore.js";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();
const newsStore = useNewsStore();
</script>

<template>
  <div @click="router.push('/news')" class="cursor-pointer bg-kf-white flex flex-col gap-2 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("news.title") }}</h1>
    <div class="flex flex-col gap-1 w-full">
      <div v-for="(publishing, index) in newsStore.articles.slice(0, 6)" :key="index">
        <NewsSummary :date="publishing.date" :title="publishing.title" :content="publishing.content" :location="publishing.location"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
