<script setup>
import FooterPage from "@/components/navigation/FooterPage.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <FooterPage :title="t('footer.privacy-policy')" file="privacy-policy" />
</template>


<style scoped>

</style>