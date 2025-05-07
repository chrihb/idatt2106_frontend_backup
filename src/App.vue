<script setup>
import { RouterView } from 'vue-router'
import {nextTick, onBeforeUnmount, onMounted, watch} from 'vue'
import { useI18n } from 'vue-i18n'
import { mockHomeData } from "@/services/homeService.js";
import { useUserStore } from "@/stores/userStore.js";
import {getNews} from "@/services/newsService.js";
import { startLocationTracking, stopLocationTracking } from '@/services/locationService.js'

const userStore = useUserStore()
const { locale } = useI18n()
watch(locale, (newLang) => {
  document.documentElement.lang = newLang.split('-')[0]
}, { immediate: true })

onMounted (async () => {
  await getNews()
  // Mocking data
  mockHomeData()
  const success = await userStore.isAuthenticated();
  await nextTick();

  if (success) {
    console.log('User is authenticated, starting tracking');
    startLocationTracking();
  }
})

// Se om bruker er autentisert, hvis ja start sporing
watch(
  () => userStore.authenticated,
  (isAuthed, wasAuthed) => {
    if (isAuthed) {
      startLocationTracking()
    } else {
      stopLocationTracking()
    }
  },
  { immediate: true }
)
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
