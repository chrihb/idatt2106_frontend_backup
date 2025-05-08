<script setup>
import {useI18n} from "vue-i18n";
import { watch } from "vue";

const { locale, t } = useI18n()

const localeOptions = [
  { code: 'en-US', nameKey: "navbar.language.en" },
  { code: 'nb-NO', nameKey: "navbar.language.nb" }
]

watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale)
})
</script>

<template>
  <select v-model="locale" class="border border-kf-blue rounded px-2 py-1 text-kf-blue">
    <option v-for="option in localeOptions" :key="option.code" :value="option.code">
      {{ t(option.nameKey) }}
    </option>
  </select>
</template>

<style scoped>

</style>