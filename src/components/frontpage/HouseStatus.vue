<script setup>
import HouseMember from "@/components/frontpage/HouseMember.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();

</script>

<template>
  <div @click="router.push('/my-home')" class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 cursor-pointer px-2">
    <h1 class="text-2xl text-kf-blue">{{ t("my-home.title") }}</h1>
    <div class="flex flex-col gap-1 w-full">
      <HouseMember name="John Doe" location="Home" :isHome="true" />
      <HouseMember name="Jane Smith" location="Oslo" :isHome="false" />
      <HouseMember name="Alice Johnson" location="Home" :isHome="true" />
      <HouseMember name="Bob Brown" location="Stavanger" :isHome="false" />
    </div>
  </div>
</template>

<style scoped>

</style>