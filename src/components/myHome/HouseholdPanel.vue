<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
});

</script>

<template>
  <div class="bg-kf-white flex flex-col gap-1 items-center shadow-lg rounded-2xl py-2 px-2">
    <h1 class="text-2xl text-kf-blue font-bold">{{ props.name }}</h1>
    <p class="text-1xl text-kf-blue"> {{ props.address }} </p>
  </div>
</template>


<style scoped>

</style>