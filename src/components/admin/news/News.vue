<script setup>
import NewsSummary from "@/components/news/NewsSummary.vue";
import { useNewsStore } from "@/stores/newsStore.js";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const { t } = useI18n();
const newsStore = useNewsStore();

</script>

<template>
  <div v-for="(publishing, index) in newsStore.articles" :key="index">
    <div class="bg-white shadow-lg rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <p class="text-sm text-gray-500 font-mono">#{{ publishing.caseId }}</p>
            <h1 class="text-lg font-semibold text-gray-800 truncate">{{ publishing.title }}</h1>
            <p class="text-sm text-gray-600">{{ publishing.date }}</p>
        </div>
        <div class="flex gap-2">
            <router-link
                :to="`/admin-settings/updateNews/${publishing.caseId}`"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
                {{ t('admin-settings.news.update') }}
            </router-link>
            <router-link
                :to="`/admin-settings/deleteNews/${publishing.caseId}`"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
            >
                {{ t('admin-settings.news.delete') }}
            </router-link>
        </div>
    </div>

  </div>
</template>