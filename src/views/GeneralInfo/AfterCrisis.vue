<script setup>
import FooterPage from "@/components/navigation/FooterPage.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <RouterLink to="/general-info" class="text-kf-blue hover:underline">
        ← {{ t('general-info.title') }}
    </RouterLink>
  <FooterPage :title="t('after-crisis.title')" file="after-crisis" />
</div>
</template>


<style scoped>

</style>