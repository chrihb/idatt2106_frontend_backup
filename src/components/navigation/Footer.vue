<script setup>
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/userStore";

const { t } = useI18n();
const userStore = useUserStore();
</script>

<template>
  <div class="flex items-center gap-4 h-12 py-1 px-2">
    <RouterLink class="hover:text-kf-white" to="/about-us">{{ t("footer.about-us") }}</RouterLink>
    <RouterLink class="hover:text-kf-white" to="/privacy-policy">{{ t("footer.privacy-policy") }}</RouterLink>
    <RouterLink v-if="userStore.token" class="hover:text-kf-white" to="/admin-login">{{t("login.adminLogin")}}</RouterLink>
  </div>
</template>