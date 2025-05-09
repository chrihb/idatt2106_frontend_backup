<script setup>
import {onMounted, onUnmounted, ref, watchEffect} from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from "vue-i18n"
import { UserCircleIcon } from "@heroicons/vue/24/outline/index.js";
import { Bars3Icon } from "@heroicons/vue/24/solid/index.js";
import { useUserStore } from "@/stores/userStore.js";
import LocaleSelection from "@/components/navigation/LocaleSelection.vue";
import router from "@/router/index.js";

const userStore = useUserStore()
const { t } = useI18n()

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

const logout = () => {
  userStore.clearToken()
  router.push('/')
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
  <nav class="w-full flex items-center justify-between px-4 h-20 relative">
    <!-- Logo -->
    <RouterLink to="/">
      <div class="flex gap-2 items-center">
        <img class="h-18" src="@/assets/logo.png" alt="Logo" />
        <h1 class="text-2xl text-kf-blue hidden md:block">Krisefikser</h1>
      </div>
    </RouterLink>

    <!-- Right-side -->
    <div class="flex items-center gap-4 relative">
      <div class="hidden md:flex gap-4 text-lg">
        <RouterLink to="/storage/list" class="text-kf-blue hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150 px-0.5" >{{ t("navbar.storage") }}</RouterLink>
        <RouterLink to="/household/list" class="text-kf-blue hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150 px-0.5" >{{ t("navbar.my-home") }}</RouterLink>
        <RouterLink to="/news" class="text-kf-blue hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150 px-0.5" >{{ t("navbar.news") }}</RouterLink>
        <RouterLink to="/map" class="text-kf-blue hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150 px-0.5" >{{ t("navbar.map") }}</RouterLink>
        <RouterLink to="/general-info" class="text-kf-blue hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150 px-0.5" >{{t("footer.general-info")}}</RouterLink>
      </div>

      <Bars3Icon @click="toggleMenuDropdown" class="block md:hidden size-10 text-kf-blue hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150" />

      <div v-if="showMenuDropdown" @mouseleave="toggleMenuDropdown" class="absolute top-12 right-28 bg-kf-white shadow-lg rounded-lg z-10">
        <RouterLink to="/storage/list" class="block px-4 py-2 hover:bg-kf-grey">{{ t("navbar.storage") }}</RouterLink>
        <RouterLink to="/household/list" class="block px-4 py-2 hover:bg-kf-grey">{{ t("navbar.my-home") }}</RouterLink>
        <RouterLink to="/news" class="block px-4 py-2 hover:bg-kf-grey">{{ t("navbar.news") }}</RouterLink>
        <RouterLink to="/map" class="block px-4 py-2 hover:bg-kf-grey">{{ t("navbar.map") }}</RouterLink>
        <RouterLink to="/general-info" class="block px-4 py-2 hover:bg-kf-grey">{{t("footer.general-info")}}</RouterLink>
      </div>

      <!-- Dropdown -->
      <div v-if="userStore.authenticated">
        <UserCircleIcon @click="toggleAccountDropdown" class="size-10 text-kf-blue hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150"/>
        <div v-if="showAccountDropdown" @mouseleave="toggleAccountDropdown" class="absolute top-12 right-14 bg-kf-white shadow-lg rounded-lg z-10">
          <RouterLink to="/account" class="block px-4 py-2 text-kf-blue hover:bg-kf-grey">{{ t("navbar.account") }}</RouterLink>
          <p @click.prevent="logout" class="cursor-pointer block px-4 py-2 text-kf-blue hover:bg-kf-grey">{{ t("navbar.logout") }}</p>
        </div>
      </div>
      <div v-else>
        <RouterLink to="/login" class="text-kf-blue text-lg hover:bg-kf-grey rounded cursor-pointer transition-colors duration-150 px-0.5">{{ t("navbar.login") }}</RouterLink>
      </div>


      <LocaleSelection />
    </div>
  </nav>
</template>
