<script setup>
import InfoBox from "@/components/InfoBox.vue";
import { useRoute } from "vue-router";
import AuthHeader from "@/components/AuthHeader.vue";
import { ref, watch } from "vue";
import InfoHeader from "@/components/InfoHeader.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentPage = ref('');
const route = useRoute();

function setHeaderTitle() {
  if (route.path === '/login') {
    currentPage.value = t("auth.login");
  } else if (route.path === '/register-account') {
    currentPage.value = t("auth.register");
  } else {
    currentPage.value = 'Unknown Page';
  }
}

// Set the title initially
setHeaderTitle();

// Watch for route changes and update the title
watch(() => route.path, setHeaderTitle);
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-kf-white-contrast-2 px-4">
    <div class="bg-kf-white max-w-4xl h-[90vh] rounded-md shadow-md py-4 grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr] w-full">

      <InfoHeader class="col-1 row-1"/>

      <!-- Left: InfoBox -->
      <div class="col-1 row-2 p-4">
        <InfoBox title="Login Page" file="login-page-text" />
      </div>

      <!-- Center Divider -->
      <div class="w-px bg-kf-blue h-full col-2 row-span-2 my-auto"></div>

      <!-- Right: Login/Register title -->
      <div class="col-3 row-1 w-full">
        <AuthHeader :title="currentPage" />
      </div>

      <!-- Right: Form content -->
      <div class="col-3 row-2 flex flex-col p-2 h-full overflow-y-auto ">
        <div class="w-full flex-1">
          <router-view />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>