<script setup>
import { RouterView } from 'vue-router'
import {onMounted, watch} from 'vue'
import { useI18n } from 'vue-i18n'
import { mockHomeData } from "@/services/homeService.js";
import { useUserStore } from "@/stores/userStore.js";
import {getNews} from "@/services/newsService.js";

const userStore = useUserStore()
const { locale } = useI18n()
watch(locale, (newLang) => {
  document.documentElement.lang = newLang.split('-')[0]
}, { immediate: true })

onMounted (async () => {
  await getNews()
  // Mocking data
  mockHomeData()
  await userStore.isAuthenticated();
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
