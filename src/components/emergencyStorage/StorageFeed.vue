<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {emergencyItemService} from '../../services/emergencyItemService';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import StorageItemMaximized from "@/components/emergencyStorage/StorageItemMaximized.vue";

// Define interface for the emergency category (shown in feed)
interface EmergencyCategory {
  id: number;
  name: string;
  amount: number;
  unit: string;
  expirationDate: string;
}

// Define interface for modal state
interface CategoryModal {
  id: number;
  display: boolean;
  items: EmergencyItem[];
}

// Define interface for individual emergency items (shown in modal)
interface EmergencyItem {
  id: number;
  name: string;
  amount: number;
  unit: string;
  expirationDate: string;
}

const categories = ref<EmergencyCategory[]>([]);
const modalData = ref<CategoryModal>({
  id: 0,
  display: false,
  items: []
});

// Fetch emergency categories from the API when the component is mounted
onMounted(() => {
  emergencyItemService().getEmergencyItems()
  .then((response) => {
    categories.value = response;
  })
  .catch((error) => {
    console.error(error);
  });
});

// Function to open the modal and fetch items for the selected category
const openModal = async (category: EmergencyCategory) => {
  modalData.value = {
    id: category.id,
    display: true,
    items: await emergencyItemService().getEmergencyItemByCategoryId(category.id)
  };
};

// Function to close the modal
const closeModal = () => {
  modalData.value.display = false;
};
</script>

<template>
  <StorageItemMinimized
      v-for="category in categories"
      :key="category.id"
      :name="category.name"
      :amount="category.amount"
      :unit="category.unit"
      :expirationDate="category.expirationDate"
      :id="category.id"
      @click="openModal(category)"/>

  <StorageItemMaximized
      :categoryId="modalData.id"
      :display="modalData.display"
      :items="modalData.items"
      @close="closeModal"/>
</template>

<style scoped>
</style>