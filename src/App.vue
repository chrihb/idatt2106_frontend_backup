<script setup>
import { RouterView } from 'vue-router'
import { nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from "@/stores/userStore.js";
import { getNews } from "@/services/newsService.js";
import { startLocationTracking, stopLocationTracking } from '@/services/locationService.js'
import { initAccountMarkers, removeAccountMarkers } from "@/utils/mapUtils.js";

const userStore = useUserStore()
const { locale } = useI18n()

// Set HTML lang attribute based on locale
watch(locale, (newLang) => {
  document.documentElement.lang = newLang.split('-')[0]
}, { immediate: true })

// On app mount, validate auth and load markers if logged in
onMounted(async () => {
  await getNews()
  const success = await userStore.isAuthenticated()
  await nextTick()

  if (success) {
    await userStore.fetchHouseholds()
    await initAccountMarkers()
    startLocationTracking()
  }
})

// Watch authentication state to manage tracking and markers
watch(
    () => userStore.authenticated,
    async (isAuthed) => {
      if (isAuthed) {
        await userStore.fetchHouseholds()
        await initAccountMarkers()
        startLocationTracking()
      } else {
        await removeAccountMarkers()
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
