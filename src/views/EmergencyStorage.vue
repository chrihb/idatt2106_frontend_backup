<script setup>
import StorageFeed from "@/components/emergencyStorage/StorageFeed.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n()
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
</script>

<template>
  <StorageFeed :householdId="props.id"/>
</template>

<style scoped>

</style>