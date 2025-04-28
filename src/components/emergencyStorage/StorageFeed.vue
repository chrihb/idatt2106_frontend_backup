<script setup lang="js">
import {onMounted, ref} from 'vue';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import StorageItemMaximized from "@/components/emergencyStorage/StorageItemMaximized.vue";
import UpdateStorageComponent from "@/components/emergencyStorage/UpdateStorageComponent.vue";
import {useCategoriesStore} from '@/stores/categoriesStore.js';
import {useUnitsStore} from '@/stores/unitsStore.js';
import {useEmergencyItemsStore} from '@/stores/emergencyItemsStore.js';
import {emergencyItemService} from '@/services/emergencyItemService.js';

const categoriesStore = useCategoriesStore();
const unitsStore = useUnitsStore();
const itemsStore = useEmergencyItemsStore();

const itemCategories = ref([]);
const modalData = ref({
  id: 0,
  display: false,
  items: []
});

const updateModalData = ref({
  display: false,
  categoryId: null,
  itemId: null
});

const fetchCategories = async () => {
  try {
    if (categoriesStore.categories.length === 0) {
      await categoriesStore.fetchCategories();
    }

    if (unitsStore.units.length === 0) {
      await unitsStore.fetchUnits();
    }

    const allItems = await itemsStore.fetchAllItems();
    itemCategories.value = allItems.map(item => ({
      ...item,
      unit: unitsStore.getUnitName(item.unitId)
    }));
  } catch (error) {
    console.error('Error fetching categories:');
  }
};

const openCreateModal = (categoryId = null) => {
  updateModalData.value = {
    display: true,
    categoryId,
    itemId: null
  };
};

const openUpdateModal = (itemId) => {
  updateModalData.value = {
    display: true,
    categoryId: modalData.value.id,
    itemId
  };
};

const openModal = async (category) => {
  const service = emergencyItemService();
  const items = await service.getEmergencyItemByCategoryId(category.id);

  modalData.value = {
    id: category.categoryId,
    display: true,
    items
  };
};

const closeModal = () => {
  modalData.value.display = false;
};

const closeUpdateModal = () => {
  updateModalData.value.display = false;
};

const handleItemSaved = async () => {
  await fetchCategories();

  if (modalData.value.display) {
    const service = emergencyItemService();
    modalData.value.items = await service.getEmergencyItemByCategoryId(modalData.value.id);
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4 flex justify-end">
      <button
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          @click="openCreateModal()"
      >
        Create New Item
      </button>
    </div>
    <StorageItemMinimized
        v-for="categoryItem in itemCategories"
        :key="categoryItem.id"
        :name="categoryItem.name"
        :amount="categoryItem.amount"
        :unit="categoryItem.unit"
        :expirationDate="categoryItem.expirationDate"
        :id="categoryItem.id"
        :possibleUpdate="false"
        @click="openModal(categoryItem)"/>

    <StorageItemMaximized
        :categoryId="modalData.id"
        :display="modalData.display"
        @close="closeModal"
        @update="openUpdateModal"
        @create="openCreateModal"/>

    <UpdateStorageComponent
        :display="updateModalData.display"
        :categoryId="updateModalData.categoryId"
        :itemId="updateModalData.itemId"
        @close="closeUpdateModal"
        @itemSaved="handleItemSaved"/>
  </div>
</template>