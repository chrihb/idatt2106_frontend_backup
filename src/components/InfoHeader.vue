<script setup>
import {ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";
import { useRouter } from "vue-router";

const router = useRouter();

</script>

<template>
  <div class="relative w-full flex justify-center items-center py-2">

    <div class="absolute top-2 left-2">
      <ArrowLeftIcon @click="router.push('/')" class="row-1 col-1 size-10 rounded-full hover:bg-kf-grey"/>
    </div>


    <div class="flex flex-col items-center gap-1">
      <img src="@/assets/logo.png" alt="Logo" class="size-18" />
      <h1 class="text-3xl font-bold text-kf-blue text-center">Krisefikser</h1>
    </div>

  </div>

</template>

<style scoped>

</style>