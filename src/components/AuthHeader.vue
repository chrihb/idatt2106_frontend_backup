<script setup>
import LocaleSelection from "@/components/navigation/LocaleSelection.vue";


const props = defineProps({
  title: {
    type: String,
    default: 'null'
  },
})

</script>


<template>
  <div class="relative w-full flex justify-center items-center py-6">

    <h1 class="text-4xl font-bold text-kf-blue text-center">{{ props.title }}</h1>

    <div class="absolute top-2 right-2">
      <LocaleSelection class="w-16" />
    </div>
  </div>
</template>

<style scoped>

</style>