<script setup>
import { RouterView } from 'vue-router'
import {onMounted, watch} from 'vue'
import { useI18n } from 'vue-i18n'
import { mockNewsData } from "@/services/newsService.js";
import { mockHomeData } from "@/services/homeService.js";

const { locale } = useI18n()
watch(locale, (newLang) => {
  document.documentElement.lang = newLang.split('-')[0]
}, { immediate: true })

onMounted (() => {
  // Mocking data
  mockNewsData()
  mockHomeData()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>