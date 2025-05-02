<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";

const { t } = useI18n();
const router = useRouter();

</script>

<template>
  <div class="h-full flex justify-center py-4">
    <div class="flex flex-col items-center">
      <ArrowLeftIcon @click="router.push('/household/options')" class="cursor-pointer row-1 col-1 mt-2 size-8 rounded-full hover:bg-kf-grey"/>
    </div>
  </div>

</template>

<style scoped>
</style>