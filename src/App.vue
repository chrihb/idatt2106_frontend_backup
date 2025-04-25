<script setup>
import { RouterView } from 'vue-router'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { mockNewsData } from "@/services/newsService.js";

const { locale } = useI18n()
watch(locale, (newLang) => {
  document.documentElement.lang = newLang.split('-')[0]
}, { immediate: true })

mockNewsData()
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>