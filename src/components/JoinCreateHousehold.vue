<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { HomeIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";

const { t } = useI18n();
</script>

<template>
  <div class="h-full flex justify-center py-4">
    <div class="flex flex-col gap-8 items-center">
      <p class="text-kf-blue text-2xl">{{ t('my-home.title') }}</p>
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex cursor-pointer flex-col justify-center items-center bg-kf-white-contrast-1 shadow-md rounded-lg size-32 p-4">
          <PlusCircleIcon class="size-12 text-kf-blue mb-2" />
          <p class="text-center text-kf-blue font-bold">{{ t('my-home.create') }}</p>
        </div>
        <p class="text-kf-blue text-2xl">{{ t('my-home.or') }}</p>
        <div class="flex cursor-pointer flex-col justify-center items-center bg-kf-white-contrast-1 shadow-md rounded-lg size-32 p-4">
          <HomeIcon class="size-12 text-kf-blue mb-2" />
          <p class="text-center text-kf-blue font-bold">{{ t('my-home.join') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>