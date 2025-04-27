<script lang="js">
import {defineComponent, ref, onMounted, watch} from 'vue';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import {emergencyItemService} from '@/services/emergencyItemService.js';
import {useCategoriesStore} from '@/stores/categoriesStore';
import {useUnitsStore} from '@/stores/unitsStore.js';

export default defineComponent({
  name: 'StorageItemMaximized',
  components: {StorageItemMinimized},
  props: {
    categoryId: {
      type: Number,
      required: true
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'update', 'create'],
  setup(props, {emit}) {
    const items = ref([]);
    const unitsStore = useUnitsStore();
    const categoriesStore = useCategoriesStore();

    const loadItems = async () => {
      if (props.display && props.categoryId) {
        try {
          const service = emergencyItemService();
          const categoryItems = await service.getEmergencyItemByCategoryId(props.categoryId);

          items.value = categoryItems.map(item => ({
            ...item,
            unit: unitsStore.getUnitName(item.unitId)
          }));
        } catch (error) {
          console.error('Error loading items for category');
        }
      }
    };

    const close = () => {
      emit('close');
    };

    const handleUpdate = (id) => {
      emit('update', id);
    };

    const handleCreate = () => {
      emit('create', props.categoryId);
    };

    const handleDelete = async (id) => {
      try {
        const service = emergencyItemService();
        await service.deleteEmergencyItem(id);
        await loadItems();
      } catch (error) {
        console.error('Error deleting item');
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
    }, { immediate: false });

    return {
      close,
      handleUpdate,
      handleCreate,
      handleDelete,
      items
    };
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="display"
         class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div
          class="bg-white rounded-lg shadow-xl w-4/5 md:w-3/5 max-h-4/5 overflow-auto p-6 max-w-3xl">
        <div class="flex flex-row justify-between items-center mb-6 border-b pb-4">
          <h1 class="text-2xl font-bold text-gray-800">Category Details</h1>
          <button
              class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              @click="close"
          >
            ✖
          </button>
        </div>

        <div v-if="items.length === 0" class="py-10 text-center text-gray-500">
          No items found in this category
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
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors duration-200"
              @click="handleCreate"
          >
            Create New Item
          </button>
          <button
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
              @click="close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>