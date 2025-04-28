<script setup>
import { useI18n } from "vue-i18n";
import { useHomeStore } from "@/stores/homeStore.js";

const homeStore = useHomeStore();
const { t } = useI18n();

</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.address") }}</h1>
    <p class="text-1xl text-kf-blue"> {{homeStore.address}} </p>
  </div>
</template>


<style scoped>

</style>