<script setup lang="js">
import {ref, onMounted, watch} from 'vue';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import {useCategoriesStore} from '@/stores/categoriesStore.js';
import {useUnitsStore} from '@/stores/unitsStore.js';
import {useEmergencyItemsStore} from '@/stores/emergencyItemsStore.js';
import {useI18n} from "vue-i18n";

const props = defineProps({
  categoryId: {
    type: Number,
    required: true
  },
  display: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'update', 'create']);
const {t} = useI18n();

const unitsStore = useUnitsStore();
const categoriesStore = useCategoriesStore();
const itemsStore = useEmergencyItemsStore();

const items = ref([]);

const loadItems = async () => {
  if (props.display && props.categoryId) {
    try {
      const categoryItems = await itemsStore.fetchItemsByCategory(props.categoryId);

      items.value = categoryItems.map(item => ({
        ...item,
        unit: unitsStore.getUnitName(item.unitId)
      }));
    } catch (error) {
      console.error('Error loading items for category', error);
    }
  }
};

const close = () => {
  items.value = [];
  emit('close');
};

const handleUpdate = (id) => {
  emit('update', id);
  close();
};

const handleCreate = () => {
  emit('create', props.categoryId);
  close();
};

const handleDelete = async (id) => {
  try {
    await itemsStore.deleteItem(id);
    await loadItems();
  } catch (error) {
    console.error('Error deleting item', error);
  }
};

onMounted(async () => {
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories();
  }

  if (unitsStore.units.length === 0) {
    await unitsStore.fetchUnits();
  }

  await loadItems();
});

watch(() => props.display, async (newValue) => {
  if (newValue === true) {
    await loadItems();
  }
}, {immediate: false});
</script>

<template>
  <Teleport to="body">
    <div v-if="display"
         class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div
          class="bg-white rounded-lg shadow-xl w-4/5 md:w-3/5 max-h-4/5 overflow-auto p-6 max-w-3xl">
        <div class="flex flex-row justify-between items-center mb-6 border-b pb-4">
          <h1 class="text-2xl font-bold text-gray-800">{{
              categoriesStore.getCategoryName(categoryId)
            }}</h1>
          <button
              class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              @click="close"
          >
            ✖
          </button>
        </div>

        <div v-if="items.length === 0" class="py-10 text-center text-gray-500">
          {{ t("storage.no-items-in-category") }}
        </div>

        <div v-else class="space-y-3">
          <StorageItemMinimized
              v-for="item in items"
              :key="item.id"
              :name="item.name"
              :amount="item.amount"
              :unit="item.unit"
              :expirationDate="item.expirationDate"
              :id="item.id"
              :possibleUpdate="true"
              @update="handleUpdate"
              @delete="handleDelete"/>
        </div>

        <div class="mt-6 pt-4 border-t flex justify-between">
          <button
              class="px-4 py-2 bg-kf-blue rounded-lg text-white font-medium transition-colors duration-200"
              @click="handleCreate"
          >
            {{ t("storage.new-item") }}
          </button>
          <button
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
              @click="close"
          >
            {{ t("storage.close") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>