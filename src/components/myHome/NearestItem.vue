<script setup>

const props = defineProps({
  title: {
    type: String,
    default: 'null'
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  }
})

const address = "unknown"

</script>

<template>
  <div class="bg-kf-white w-full hover:bg-kf-white-contrast-3 flex justify-between px-2 drop-shadow-md border border-kf-white-contrast-2 rounded-md items-center">
    <p class="text-1xl">{{ props.title }}</p>
    <p class="text-1xl">{{ address }}</p>
  </div>
</template>

<style scoped>

</style>