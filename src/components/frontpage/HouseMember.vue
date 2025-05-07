<script setup>

const props = defineProps({
  name: {
    type: String,
    default: 'null'
  },
  location: {
    type: String,
    default: 'null'
  },
})

</script>

<template>
  <div class="bg-kf-white w-full flex hover:bg-kf-white-contrast-3 justify-between px-2 drop-shadow-md border border-kf-white-contrast-2 rounded-md items-center">
    <p class="text-1xl">{{ props.name }}</p>
    <p class="text-1xl">{{ props.location }}</p>
  </div>
</template>

<style scoped>

</style>