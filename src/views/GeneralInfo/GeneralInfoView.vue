<script setup>
import FooterPage from "@/components/navigation/FooterPage.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <FooterPage :title="t('general-info.title')" file="general-info" />
  <RouterLink class="hover:text-kf-white" to="/before-crisis">{{t("before-crisis.title")}}</RouterLink>
  <div class="w-full max-w-6xl">
    <RouterView />
  </div>
</template>


<style scoped>

</style>