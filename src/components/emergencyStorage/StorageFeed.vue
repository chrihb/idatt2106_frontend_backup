<script setup lang="js">
import {onMounted, ref} from 'vue';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import StorageItemMaximized from "@/components/emergencyStorage/StorageItemMaximized.vue";
import UpdateStorageComponent from "@/components/emergencyStorage/UpdateStorageComponent.vue";
import DetailedStorageStatus from "@/components/emergencyStorage/DetailedStorageStatus.vue";
import EssentialItemChecklist from "@/components/emergencyStorage/EssentialItemChecklist.vue";
import {useCategoriesStore} from '@/stores/categoriesStore.js';
import {useUnitsStore} from '@/stores/unitsStore.js';
import {useEmergencyItemsStore} from '@/stores/emergencyItemsStore.js';
import {useI18n} from "vue-i18n";
import { ExclamationTriangleIcon, XCircleIcon } from "@heroicons/vue/24/solid/index.js";

const {t} = useI18n();

const props = defineProps({
  householdId: {
    type: [String],
    required: true
  }
});

const categoriesStore = useCategoriesStore();
const unitsStore = useUnitsStore();
const itemsStore = useEmergencyItemsStore();

const itemCategories = ref([]);
const modalData = ref({
  id: 0,
  display: false
});

const updateModalData = ref({
  display: false,
  categoryId: null,
  itemId: null
});

const expired = ref(false);
const expiringSoon = ref(false);
const fetchCategories = async () => {
  try {
    if (categoriesStore.categories.length === 0) {
      await categoriesStore.fetchCategories();
    }

    if (unitsStore.units.length === 0) {
      await unitsStore.fetchUnits();
    }

    await itemsStore.fetchAllItems(props.householdId);
    const allItems = itemsStore.items;

    const groupedCategories = allItems.reduce((acc, item) => {
      const category = acc[item.categoryId] || {
        id: item.categoryId,
        name: categoriesStore.getCategoryName(item.categoryId),
        units: new Set(),
        unit: null,
        amount: 0,
        expirationDate: null,
      };

      category.units.add(unitsStore.getUnitName(item.unitId));

      if (category.units.size > 1) {
        category.unit = t("storage.inconsistent-units");
        category.amount = null;
      } else {
        category.unit = [...category.units][0];
        category.amount += item.amount;
      }

      if (
          !category.expirationDate ||
          new Date(item.expirationDate) < new Date(category.expirationDate)
      ) {
        category.expirationDate = item.expirationDate;
      }

      if(new Date(category.expirationDate) < new Date()) {
        expired.value = true;
      } else if (new Date(category.expirationDate) < new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)) {
        expiringSoon.value = true;
      }

      acc[item.categoryId] = category;
      return acc;
    }, {});

    itemCategories.value = Object.values(groupedCategories).map(category => {
      delete category.units;
      return category;
    });
  } catch (error) {
    console.error("Error fetching categories");
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
  modalData.value = {
    id: category.id,
    display: true
  };
};

const closeModal = () => {
  modalData.value.display = false;
};

const closeUpdateModal = () => {
  updateModalData.value.display = false;
};

const handleItemUpdated = async () => {
  await fetchCategories();
  await checklistRef.value?.refreshEssentials();
};
const checklistRef = ref(null);


onMounted(async () => {
  await fetchCategories();
});
</script>

<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Venstre kolonne -->
      <div class="lg:col-span-1 flex flex-col gap-4">
        <DetailedStorageStatus :householdId="props.householdId"/>
        <EssentialItemChecklist :householdId="props.householdId"
        ref="checklistRef"/>
      </div>

      <!-- Høyre kolonne -->
    <div class="lg:col-span-2">
    <div
        class="mb-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
      <div v-if="expired" class="flex flex-row gap-2 w-1/3">
        <p>{{ t("storage.expired") }}</p>
        <XCircleIcon class="text-red-600 w-7 h-7"/>
      </div>
      <div v-if="expiringSoon && !expired" class="flex flex-row gap-2">
        <p>{{ t("storage.expiring-soon") }}</p>
        <ExclamationTriangleIcon class="text-orange-400 w-7 h-7"/>
      </div>
      <h2 class="text-xl sm:text-2xl font-semibold">{{ t("storage.inventory-categories") }}:</h2>
      <div class="flex flex-row-reverse w-1/3">
        <button
            class="bg-kf-blue text-white px-3 py-2 rounded transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
            @click="openCreateModal()"
        >
          {{ t("storage.new-item") }}
        </button>
      </div>
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

    <div v-if="itemCategories.length === 0" class="py-8 text-center text-gray-500">
      {{ t("storage.no-items-in-category") }}
    </div>

    <StorageItemMaximized
        :categoryId="modalData.id"
        :display="modalData.display"
        :householdId="householdId"
        @close="closeModal"
        @update="openUpdateModal"
        @create="openCreateModal"
        @itemUpdated="handleItemUpdated"/>

    <UpdateStorageComponent
        :display="updateModalData.display"
        :categoryId="updateModalData.categoryId"
        :itemId="updateModalData.itemId"
        @close="closeUpdateModal"
        @itemSaved="handleItemUpdated"/>
      </div>
    </div>
  </div>
</template>
