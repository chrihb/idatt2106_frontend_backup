<script setup>
import {useI18n} from "vue-i18n";
import {ref, watchEffect} from "vue";
import fileImport from "@/utils/txtFileImport.js";
import { marked } from 'marked'

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
    const markdown = await fileImport(props, locale)
    text.value = marked.parse(markdown)
  } catch (err) {
    text.value = 'Content not available in this language.'
  }
})

</script>

<template>

<div class="">
  <div class="prose w-full" v-html="text" />
</div>
</template>

<style scoped>
</style>
