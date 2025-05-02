<script setup>
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();
const { t } = useI18n();

</script>

<template>
  <div class="h-full flex justify-center p-4">
    <div class="flex flex-col gap-8 items-center max-w-xl w-full bg-kf-white shadow-md rounded-lg p-4">
      <p v-if="route.path === '/household/options'" class="text-kf-blue text-2xl">{{ t('my-home.title') }}</p>
      <p v-else-if="route.path === '/household/join'" class="text-kf-blue text-2xl">{{ t('my-home.available') }}</p>
      <p v-else class="text-kf-blue text-2xl">{{ t('my-home.create-household') }}</p>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
</style>