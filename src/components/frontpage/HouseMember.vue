<script setup>
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/solid/index.js";


const props = defineProps({
  name: {
    type: String,
    default: 'null'
  },
  location: {
    type: String,
    default: 'null'
  },
  isHome: {
    type: Boolean,
    default: false
  },
})

</script>

<template>
  <div class="bg-kf-white w-full grid grid-cols-[1fr_1fr_auto] px-1 drop-shadow-md rounded-md items-center">
    <p class="text-1xl">{{ props.name }}</p>
    <p class="text-1xl">{{ props.location }}</p>
    <CheckCircleIcon class="size-8 text-kf-green" v-if="props.isHome" />
    <XCircleIcon class="size-8 text-kf-red" v-else />
  </div>
</template>

<style scoped>

</style>