<script setup>
import {onMounted, onUnmounted, ref, watchEffect} from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from "vue-i18n"
import { UserCircleIcon } from "@heroicons/vue/24/outline/index.js";
import { Bars3Icon } from "@heroicons/vue/24/solid/index.js";

const { locale, t } = useI18n()

const localeOptions = [
  { code: 'en-US', nameKey: "navbar.language.en" },
  { code: 'nb-NO', nameKey: "navbar.language.nb" }
]

const isAuthenticated = ref(true) // Replace with actual authentication logic

const showAccountDropdown = ref(false)
const showMenuDropdown = ref(false)

const toggleAccountDropdown = () => {
  showMenuDropdown.value = false
  showAccountDropdown.value = !showAccountDropdown.value
}

const toggleMenuDropdown = () => {
  showAccountDropdown.value = false
  showMenuDropdown.value = !showMenuDropdown.value
}

const isMobile = ref(window.innerWidth < 768)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// keep it updated
onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

// when screen becomes larger than mobile, close dropdowns
watchEffect(() => {
  if (!isMobile.value) {
    showMenuDropdown.value = false
    showAccountDropdown.value = false
  }
})
</script>

<template>
  <nav class="bg-white shadow-md w-full flex items-center justify-between px-4 h-20 rounded-b-lg relative">
    <!-- Logo -->
    <RouterLink to="/">
      <div class="flex gap-2 items-center">
        <img class="h-18" src="../assets/logo.png" alt="Logo" />
        <h1 class="text-2xl hidden md:block">Krisefikser</h1>
      </div>
    </RouterLink>

    <!-- Right-side -->
    <div class="flex items-center gap-4 relative">

      <div class="hidden md:flex gap-4 text-lg">
        <RouterLink to="/storage" class="text-black hover:bg-gray-200 rounded cursor-pointer transition-colors duration-150 px-0.5" >{{ t("navbar.storage") }}</RouterLink>
        <RouterLink to="/news" class="text-black hover:bg-gray-200 rounded cursor-pointer transition-colors duration-150 px-0.5" >{{ t("navbar.news") }}</RouterLink>
      </div>

      <Bars3Icon @click="toggleMenuDropdown" class="block md:hidden size-10 text-black hover:bg-gray-200 rounded cursor-pointer transition-colors duration-150" />

      <div v-if="showMenuDropdown" class="absolute top-12 right-28 bg-white shadow-lg rounded-lg z-10">
        <RouterLink to="/storage" class="block px-4 py-2 hover:bg-gray-100">{{ t("navbar.storage") }}</RouterLink>
        <RouterLink to="/news" class="block px-4 py-2 hover:bg-gray-100">{{ t("navbar.news") }}</RouterLink>
      </div>

      <UserCircleIcon @click="toggleAccountDropdown" class="size-10 text-black hover:bg-gray-200 rounded cursor-pointer transition-colors duration-150"/>

      <!-- Dropdown -->
      <div v-if="showAccountDropdown" class="absolute top-12 right-14 bg-white shadow-lg rounded-lg z-10">
        <div v-if="isAuthenticated">
          <RouterLink to="/settings" class="block px-4 py-2 hover:bg-gray-100">{{ t("navbar.settings") }}</RouterLink>
          <RouterLink to="/logout" class="block px-4 py-2 hover:bg-gray-100">{{ t("navbar.logout") }}</RouterLink>
        </div>
        <div v-else>
          <RouterLink to="/login" class="block px-4 py-2 hover:bg-gray-100">{{ t("navbar.login") }}</RouterLink>
        </div>
      </div>

      <select v-model="locale" class="border border-gray-300 rounded px-2 py-1 text-black">
        <option v-for="option in localeOptions" :key="option.code" :value="option.code">
          {{ t(option.nameKey) }}
        </option>
      </select>
    </div>
  </nav>
</template>
