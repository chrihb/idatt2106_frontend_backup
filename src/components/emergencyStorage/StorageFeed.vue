<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {emergencyItemService} from '@/services/emergencyItemService';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import StorageItemMaximized from "@/components/emergencyStorage/StorageItemMaximized.vue";
import UpdateStorageComponent from "@/components/emergencyStorage/UpdateStorageComponent.vue";

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
  id?: number;
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

const updateModalData = ref({
  display: false,
  categoryId: null as number | null,
  itemId: null as number | null
});

// Fetch emergency categories from the API when the component is mounted
onMounted(() => {
  fetchCategories();
});

const fetchCategories = async () => {
  try {
    const response = await emergencyItemService().getEmergencyItems();
    categories.value = response;
  } catch (error) {
    console.error(error);
  }
};

// Function to open the update modal for creating a new item
const openCreateModal = (categoryId: number | null = null) => {
  updateModalData.value = {
    display: true,
    categoryId,
    itemId: null
  };
};

// Function to open the update modal for updating an existing item
const openUpdateModal = (itemId: number) => {
  updateModalData.value = {
    display: true,
    categoryId: modalData.value.id,
    itemId
  };
};

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

// Function to close the update modal
const closeUpdateModal = () => {
  updateModalData.value.display = false;
};

// Function to handle item saved (created or updated)
const handleItemSaved = async () => {
  await fetchCategories();

  if (modalData.value.display) {
    modalData.value.items = await emergencyItemService().getEmergencyItemByCategoryId(modalData.value.id);
  }
};
</script>

<template>
  <div class="mb-4 flex justify-end">
    <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        @click="openCreateModal()"
    >
      Create New Item
    </button>
  </div>

  <StorageItemMinimized
      v-for="category in categories"
      :key="category.id"
      :name="category.name"
      :amount="category.amount"
      :unit="category.unit"
      :expirationDate="category.expirationDate"
      :id="category.id"
      :possibleUpdate="false"
      @click="openModal(category)"
      @update="openUpdateModal"/>

  <StorageItemMaximized
      :categoryId="modalData.id"
      :display="modalData.display"
      :items="modalData.items"
      @close="closeModal"
      @update="openUpdateModal"
      @create="openCreateModal"/>

  <UpdateStorageComponent
      :display="updateModalData.display"
      :categoryId="updateModalData.categoryId"
      :itemId="updateModalData.itemId"
      @close="closeUpdateModal"
      @itemSaved="handleItemSaved"/>
</template>