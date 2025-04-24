<script setup>
import FooterPage from "@/components/navigation/FooterPage.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <FooterPage :title="t('footer.about-us')" file="about-us" />
</template>


<style scoped>

</style>