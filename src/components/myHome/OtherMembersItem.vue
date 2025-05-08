<script setup>
import {PlusCircleIcon, MinusCircleIcon} from "@heroicons/vue/24/outline";


const props = defineProps({
  title: {
    type: String,
    default: 'null',
  },
  total: {
    type: Number,
    default: 0,
  },
  plus: {
    type: Function,
    default: () => {},
  },
  minus: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <div class="bg-kf-white w-full flex justify-between px-2 drop-shadow-md border border-kf-white-contrast-2 rounded-md items-center">
    <p class="text-xl">{{ title }}</p>
    <div class="flex gap-2 items-center">
      <PlusCircleIcon @click="plus" class="size-6 hover:text-kf-green"/>
      <p class="text-xl">{{ total }}</p>
      <MinusCircleIcon @click="minus" class="size-6 hover:text-kf-red"/>
    </div>
  </div>
</template>

<style scoped>
</style>