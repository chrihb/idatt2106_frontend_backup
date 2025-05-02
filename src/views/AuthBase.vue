<script setup>
import InfoBox from "@/components/InfoBox.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";
import LocaleSelection from "@/components/navigation/LocaleSelection.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-kf-white-contrast-2 px-4">
    <div class="relative bg-kf-white max-w-4xl w-full min-h-155 rounded-md shadow-md py-2 flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] md:grid-rows-[auto_1fr]">

    <div class="absolute top-2 left-2">
        <ArrowLeftIcon @click="router.push('/')" class="cursor-pointer row-1 col-1 size-8 rounded-full hover:bg-kf-grey"/>
      </div>

      <div class="absolute top-2 right-2">
        <LocaleSelection class="w-16" />
      </div>

      <div class="flex flex-col items-center col-1 row-1 gap-1">
        <img src="@/assets/logo.png" alt="Logo" class="size-16" />
        <h1 class="text-3xl hidden md:block font-bold text-kf-blue text-center">Krisefikser</h1>
      </div>

      <!-- Center Divider -->
      <div class="w-px hidden md:block bg-kf-blue h-full col-2 row-span-2 my-auto"></div>

      <!-- Right: Login/Register title -->
      <div class="col-3 row-1 w-full">
        <h1 v-if="route.path === '/login'"  class="mt-10 text-4xl font-bold text-kf-blue text-center">{{ t("auth.login") }}</h1>
        <h1 v-else-if="route.path === '/register-admin'" class="mt-10 text-4xl font-bold text-kf-blue text-center">{{ t("register.admin.register-admin") }}</h1>
        <h1 v-else class="mt-10 text-4xl font-bold text-kf-blue text-center">{{ t("auth.register") }}</h1>
      </div>

      <!-- Right: Form content -->
      <div class="col-3 row-2 flex flex-col p-2 h-full max-h-125 overflow-y-auto ">
        <div class="w-full flex-1">
          <router-view />
        </div>
      </div>

      <!-- Left: InfoBox -->
      <div class="col-1 hidden md:block row-2 p-4">
        <InfoBox title="Login Page" file="login-page-text" />
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>