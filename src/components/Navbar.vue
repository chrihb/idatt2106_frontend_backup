<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from "vue-i18n";


const { locale, t } = useI18n();
const localeOptions = [
  { code: 'en-US', nameKey: "navbar.language.en"},
  { code: 'nb-NO', nameKey: "navbar.language.nb"},
]
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="homeButton">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
      <h1>Krisefikser</h1>
    </RouterLink>
    <label>{{ t("navbar.menu") }}</label>
    <RouterLink to="/account">{{ t("navbar.account") }}</RouterLink>
    <select v-model="locale" id="localeSelect">
      <option v-for="option in localeOptions" :key="option.code" :value="option.code">
        {{ t(option.nameKey) }}
      </option>
    </select>
  </nav>
</template>

<style scoped>

</style>