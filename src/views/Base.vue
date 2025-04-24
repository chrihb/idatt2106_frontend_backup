<script setup>
import Navbar from "@/components/navigation/Navbar.vue";
import { RouterView } from 'vue-router'
import Footer from "@/components/navigation/Footer.vue";
</script>

<template>
    <div class="mx-auto min-h-screen flex flex-col bg-kf-white-contrast-2">
      <div class="fixed z-50 w-full bg-kf-white shadow-md flex justify-center">
        <Navbar class="w-full max-w-6xl" />
      </div>
      <div class="flex-grow pt-20 flex flex-col items-center">
      <RouterView class="w-full max-w-6xl"/>
      </div>
      <div class="w-full bg-kf-red flex justify-center">
        <Footer class="w-full max-w-6xl"/>
      </div>
    </div>
</template>
