<script setup lang="ts">
import {onMounted} from 'vue';
import {getEmergencyItems} from '../../services/emergencyItemService';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";

// Define interface for the emergency item
interface emergencyItem {
  id: number;
  name: string;
  amount: number;
  expirationDate: string;
}

let items: emergencyItem[] = [];

// Fetch emergency items from the API when the component is mounted
onMounted(() => {
  getEmergencyItems()
  .then((response) => {
    items = response.data;
  })
  .catch((error) => {
    console.error(error);
  });
});
</script>

<template>
  <StorageItemMinimized
      v-for="item in items"
      :key="item.id"
      :name="item.name"
      :amount="item.amount"
      :expirationDate="item.expirationDate"
      :id="item.id"/>
</template>

<style scoped>
</style>