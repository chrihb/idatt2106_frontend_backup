<script setup>
import {HomeIcon} from "@heroicons/vue/24/solid/index.js";
import {useRouter} from "vue-router";

const router = useRouter();
</script>

<template>
  <button @click="router.push('/')" class="flex gap-2 rounded-md items-center cursor-pointer hover:bg-kf-grey">
    <HomeIcon class="text-kf-blue size-8 cursor-pointer"/>
    <label class="text-kf-blue text-2xl cursor-pointer">Home</label>
  </button>
</template>

<style scoped>

</style>