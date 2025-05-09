<script setup>
import FooterPage from "@/components/navigation/FooterPage.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <FooterPage :title="t('general-info.title')" file="general-info" />
    
    <h1 class="text-2xl text-kf-blue text-center mt-8">
      {{ t("general-info.find-information") }}
    </h1>

    <div class="flex flex-col items-center space-y-4 mt-4">
      <RouterLink class="block text-xl text-kf-blue font-semibold hover:underline" to="/before-crisis">
        {{ t("before-crisis.title") }}
      </RouterLink>
      <RouterLink class="block text-xl text-kf-blue font-semibold hover:underline" to="/during-crisis">
        {{ t("during-crisis.title") }}
      </RouterLink>
      <RouterLink class="block text-xl text-kf-blue font-semibold hover:underline" to="/after-crisis">
        {{ t("after-crisis.title") }}
      </RouterLink>
    </div>
  </div>
</template>


<style scoped>

</style>