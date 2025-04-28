<script setup>
import { useI18n } from "vue-i18n";
import { ArchiveBoxIcon} from "@heroicons/vue/24/solid/index.js";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

</script>

<template>
  <div @click="router.push('/storage')" class="bg-kf-white cursor-pointer flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <div class="flex gap-1">
      <ArchiveBoxIcon class="size-8 text-kf-blue" />
      <h1 class="text-2xl text-kf-blue">{{ t("my-home.manage-storage") }}</h1>
    </div>
  </div>
</template>


<style scoped>

</style>