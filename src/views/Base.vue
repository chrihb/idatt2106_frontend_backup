<script setup>
import Navbar from "@/components/Navbar.vue";
import { RouterView } from 'vue-router'
import Footer from "@/components/Footer.vue";
</script>

<template>
  <div class="max-w-300 mx-auto min-h-screen flex flex-col">
    <div class="fixed max-w-300 z-50 w-full ">
      <Navbar class="h-20" />
    </div>
    <div class="flex-grow w-full pt-20">
      <RouterView />
    </div>
    <Footer class="w-full"/>
  </div>
</template>
