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
  <nav class="bg-white shadow-md w-full flex items-center justify-between px-4 h-20">
    <!-- Logo -->
    <RouterLink to="/" class="flex h-full">
      <img src="../assets/logo.png" alt="Logo" />
    </RouterLink>

    <!-- Right-side -->
    <div class="flex items-center gap-4">
      <RouterLink to="/account" class="text-black hover:text-blue-600">
        {{ t("navbar.account") }}
      </RouterLink>
      <RouterLink to="/emergency-storage" class="text-black hover:text-blue-600">
        {{ t("navbar.emergencyStorage") }}
      </RouterLink>
      <select v-model="locale" class="border border-gray-300 rounded px-2 py-1 text-black">
        <option v-for="option in localeOptions" :key="option.code" :value="option.code">
          {{ t(option.nameKey) }}
        </option>
      </select>
    </div>
  </nav>
</template>



<style scoped>

</style>