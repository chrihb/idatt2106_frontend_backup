<script setup>
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import { HomeIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";


const { t } = useI18n();

</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 items-center">
    <RouterLink to="/household/create" class="flex cursor-pointer flex-col justify-center items-center bg-kf-white border border-kf-white-contrast-3 active:border-kf-blue shadow-md rounded-lg size-32 p-4">
      <PlusCircleIcon class="size-12 text-kf-blue mb-2" />
      <p class="text-center text-kf-blue font-bold">{{ t('my-home.create') }}</p>
    </RouterLink>
    <p class="text-kf-blue text-2xl">{{ t('my-home.or') }}</p>
    <RouterLink to="/household/join" class="flex cursor-pointer flex-col justify-center items-center bg-kf-white border border-kf-white-contrast-3 active:border-kf-blue shadow-md rounded-lg size-32 p-4">
      <HomeIcon class="size-12 text-kf-blue mb-2" />
      <p class="text-center text-kf-blue font-bold">{{ t('my-home.join') }}</p>
    </RouterLink>
  </div>
</template>

<style scoped>
</style>