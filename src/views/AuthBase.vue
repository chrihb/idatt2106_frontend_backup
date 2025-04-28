<script setup>

import InfoBox from "@/components/InfoBox.vue";
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="flex flex-col md:flex-row gap-4 w-full max-w-7xl">
      <!-- Child Component (Login or Register) -->
      <div class="flex-1">
        <router-view />
      </div>

      <!-- InfoBox Component -->
      <div class="flex-1 flex justify-center items-start pt-12">
        <div class="w-full max-w-4xl">
          <InfoBox title="Login Page" file="login-page-text"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
