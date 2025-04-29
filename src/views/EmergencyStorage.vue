<script setup>
import StorageFeed from "@/components/emergencyStorage/StorageFeed.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n()
</script>

<template>
  <h1>{{ t("storage.title") }}</h1>
  <StorageFeed/>
</template>

<style scoped>

</style>