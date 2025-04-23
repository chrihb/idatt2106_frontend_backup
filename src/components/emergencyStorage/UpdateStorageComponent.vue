<script lang="ts">
import {defineComponent, ref, computed} from 'vue';
import {emergencyItemService} from '@/services/emergencyItemService';

interface EmergencyItem {
  id?: number;
  name: string;
  amount: string | number;
  unit: string;
  expirationDate: string;
  categoryId?: number;
}

export default defineComponent({
  name: 'UpdateStorageComponent',
  props: {
    categoryId: {
      type: Number,
      required: false,
      default: null
    },
    itemId: {
      type: Number,
      required: false,
      default: null
    },
    display: {
      type: Boolean,
      default: false
    },
  },
  emits: ['close', 'itemSaved'],
  setup(props, {emit}) {
    const isUpdate = computed(() => props.itemId !== null);
    const itemData = ref<EmergencyItem>({
      name: '',
      amount: '',
      unit: '',
      expirationDate: '',
      categoryId: props.categoryId || null
    });

    const categories = ref([
      {id: 1, name: 'Food'},
      {id: 2, name: 'Water'},
      {id: 3, name: 'Medicine'},
    ]);

    const selectedCategory = ref<number | null>(props.categoryId || null);

    const close = () => {
      resetForm();
      emit('close');
    };

    const resetForm = () => {
      itemData.value = {
        name: '',
        amount: '',
        unit: '',
        expirationDate: '',
        categoryId: null
      };
      selectedCategory.value = null;
    };

    const loadItemData = async () => {
      if (props.itemId) {
        try {
          const fetchedItems = await emergencyItemService().getEmergencyItemByCategoryId(props.categoryId);
          const item = fetchedItems.find((item: EmergencyItem) => item.id === props.itemId);

          if (item) {
            itemData.value = { ...item };
            selectedCategory.value = props.categoryId;
          }
        } catch (error) {
          console.error("Error fetching item:", error);
        }
      } else if (props.categoryId) {
        selectedCategory.value = props.categoryId;
        itemData.value.categoryId = props.categoryId;
      }
    };

    const saveItem = async () => {
      try {
        itemData.value.categoryId = selectedCategory.value as number;

        if (isUpdate.value) {
          await emergencyItemService().updateEmergencyItem(itemData.value);
        } else {
          await emergencyItemService().createEmergencyItem(itemData.value);
        }

        emit('itemSaved');
        close();
      } catch (error) {
        console.error("Error saving item:", error);
      }
    };

    if (props.display) {
      loadItemData();
    }

    return {
      close,
      categories,
      selectedCategory,
      itemData,
      saveItem,
      isUpdate
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
          <h1 class="text-2xl font-bold text-gray-800">
            {{ isUpdate ? 'Update Item' : 'Create New Item' }}
          </h1>
          <button
              class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              @click="close"
          >
            ✖
          </button>
        </div>

        <div class="space-y-3">
          <input
              v-model="itemData.name"
              type="text"
              placeholder="Item name"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div class="flex gap-2">
            <input
                v-model="itemData.amount"
                type="number"
                placeholder="Item amount"
                class="w-3/5 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <input
                v-model="itemData.unit"
                type="text"
                placeholder="Unit"
                class="w-2/5 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <input
              v-model="itemData.expirationDate"
              type="date"
              placeholder="Item expiration date"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div class="mt-6 pt-4 border-t flex justify-between">
          <button
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors duration-200"
              @click="saveItem">
            {{ isUpdate ? 'Update' : 'Create' }}
          </button>
          <button
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
              @click="close"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>