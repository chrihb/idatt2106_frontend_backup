<script setup>
import { ref, computed } from "vue";
import { useNewsStore } from "@/stores/newsStore.js";
import { useI18n } from "vue-i18n";
import { getNewsByDistrict, getNews } from "@/services/newsService.js";
import NewsFull from "@/components/news/NewsFull.vue";

const { t } = useI18n();
const newsStore = useNewsStore();
const selectedDistrict = ref(""); // Reactive property for selected district
const districts = ["Oslo", "Møre og Romsdal", "Troms", "Trøndelag", "Nordland", "Sør-Vest", "Finnmark", "Vest", "Øst", "Innlandet", "Sør-Øst", "Agder"]; // Example districts


const onDistrictChange = async () => {
  if (selectedDistrict.value) {
    await getNewsByDistrict(selectedDistrict.value);
  } else {
    await getNews();
  }
};

// Filtered news based on selected district
const filteredNews = computed(() => newsStore.articles);
</script>

<template>
  <div class="py-2 px-2">
    <div class="bg-kf-white flex flex-col gap-2 items-center shadow-lg rounded-2xl py-2 px-2">
      <h1 class="text-2xl text-kf-blue">{{ t("news.title") }}</h1>

      <!-- Dropdown Menu -->
      <div class="w-full flex justify-start mb-4">
        <label for="district-select" class="mr-2">{{ t("news.selectDistrict") }}</label>
        <select
            id="district-select"
            v-model="selectedDistrict"
            @change="onDistrictChange"
            class="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="">{{ t("news.allDistricts") }}</option>
          <option v-for="district in districts" :key="district" :value="district">
            {{ district }}
          </option>
        </select>
      </div>

      <!-- No News Found Message -->
      <div v-if="newsStore.noNewsFound" class="text-center text-red-500">
        {{ t("news.noNewsFound") }}
      </div>

      <!-- News List -->
      <div class="flex flex-col gap-1 w-full">
        <div
            v-for="(publishing, index) in filteredNews"
            :key="index"
            class=""
        >
          <NewsFull
              :date="publishing.date"
              :time="publishing.time"
              :title="publishing.title"
              :content="publishing.content"
              :location="publishing.location"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>
