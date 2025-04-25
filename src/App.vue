<script setup>
import { RouterView } from 'vue-router'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
watch(locale, (newLang) => {
  document.documentElement.lang = newLang.split('-')[0]
}, { immediate: true })
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>