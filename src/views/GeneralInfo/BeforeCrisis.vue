<script setup>
import FooterPage from "@/components/navigation/FooterPage.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <RouterLink to="/general-info" class="text-kf-blue hover:underline">
        ← {{ t('general-info.title') }}
    </RouterLink>
  <FooterPage :title="t('before-crisis.title')" file="before-crisis" />
</template>


<style scoped>

</style>