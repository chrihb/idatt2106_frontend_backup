<script setup>
import { defineProps } from 'vue';

defineProps(["name", "amount", "expirationDate", "id"]);
</script>

<template>
  <div class="">
    <p>{{amount}}</p>
    <p>{{name}}</p>
    <p>Utløpsdato: {{expirationDate}}</p>
  </div>
</template>

<style scoped>
</style>