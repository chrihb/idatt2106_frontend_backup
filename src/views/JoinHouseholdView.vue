<script setup>
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";

const { t } = useI18n();

</script>

<template>
  <div class="h-full flex justify-center py-4">
    <div class="flex flex-col gap-8 items-center">
      <p class="text-kf-blue text-2xl font-bold">{{ t('my-home.title') }}</p>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
</style>