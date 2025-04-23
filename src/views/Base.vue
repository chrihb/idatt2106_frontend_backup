<script setup>
import Navbar from "@/components/Navbar.vue";
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="max-w-300 mx-auto">
    <Navbar class="h-20" />
    <RouterView class="w-full" />
  </div>
</template>
