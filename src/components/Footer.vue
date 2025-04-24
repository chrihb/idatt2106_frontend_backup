<script setup>
import { useI18n} from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="flex items-center gap-4 h-12 px-4 py-1  bg-kf-red rounded-tr-lg rounded-t-lg">
    <RouterLink class="hover:text-kf-white" to="/about-us">{{ t("footer.about-us") }}</RouterLink>
    <RouterLink class="hover:text-kf-white" to="/privacy-policy">{{ t("footer.privacy-policy") }}</RouterLink>
  </div>
</template>

<style scoped>

</style>