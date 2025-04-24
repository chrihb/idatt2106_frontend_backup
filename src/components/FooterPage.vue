<script setup>
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import fileImport from "@/utils/txtFileImport.js";

const { locale } = useI18n()
const text = ref('')

const props = defineProps({
  title: {
    type: String,
    default: 'null'
  },
  file: {
    type: String,
    default: 'null'
  },
})

watchEffect(async () => {
  try {
    text.value = await fileImport(props, locale)
  } catch (err) {
    text.value = 'Content not available in this language.'
  }
})

</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 space-y-4">
    <h1 class="text-4xl">{{ props.title }}</h1>
    <div class="" v-if="text">{{ text }}</div>
  </div>

</template>

<style scoped>

</style>