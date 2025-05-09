<script setup lang="js">
import {ref, onMounted, watch, computed} from 'vue';
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import {useCategoriesStore} from '@/stores/categoriesStore.js';
import {useUnitsStore} from '@/stores/unitsStore.js';
import {useEmergencyItemsStore} from '@/stores/emergencyItemsStore.js';
import {useI18n} from "vue-i18n";
import {XMarkIcon} from "@heroicons/vue/24/solid/index.js";

const props = defineProps({
  categoryId: {
    type: Number,
    required: true
  },
  display: {
    type: Boolean,
    default: false
  },
  householdId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'update', 'create', 'itemUpdated']);
const {t, locale} = useI18n();

const unitsStore = useUnitsStore();
const categoriesStore = useCategoriesStore();
const itemsStore = useEmergencyItemsStore();

const items = ref([]);
const category = computed(() => {
  if (!props.categoryId) return '';
  return categoriesStore.getCategoryName(props.categoryId, locale.value);
});

const loadItems = async () => {
  if (props.display && props.categoryId) {
    try {
      const categoryItems = await itemsStore.fetchItemsByCategory(props.categoryId, props.householdId);

      items.value = categoryItems.map(item => ({
        ...item,
        unit: unitsStore.getUnitName(item.unitId, locale.value),
      }));
    } catch (error) {
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
    emit('itemUpdated', id);
  } catch (error) {
  }
};

onMounted(async () => {
  await loadItems();
});

watch(() => props.display, async (newValue) => {
  if (newValue === true) {
    await loadItems();
  }
}, {immediate: false});

watch(() => locale.value, async () => {
  if (items.value.length > 0) {
    items.value = items.value.map(item => ({
      ...item,
      unit: unitsStore.getUnitName(item.unitId, locale.value),
    }));
  }
}, {immediate: false});
</script>

<template>
  <Teleport to="body">
    <div v-if="display"
         class="fixed backdrop-blur-sm inset-0 flex items-center justify-center z-50 p-3 sm:p-0">
      <div
          class="bg-white rounded-lg shadow-xl w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-auto p-4 sm:p-6 max-w-3xl">
        <div class="flex flex-row justify-between items-center mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 truncate">
            {{ category }}
          </h1>
          <XMarkIcon class="w-8 h-8 cursor-pointer text-red-500"
                     @click="close"/>
        </div>

        <div v-if="items.length === 0" class="py-6 sm:py-10 text-center text-gray-500">
          {{ t("storage.no-items-in-category") }}
        </div>

        <div v-else
             class="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-1">
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

        <div
            class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
          <button
              data-test="create-item"
              class="w-full sm:w-auto px-4 py-2 bg-kf-blue rounded-lg text-white font-medium transition-colors duration-200 order-2 sm:order-1"
              @click="handleCreate"
          >
            {{ t("storage.new-item") }}
          </button>
          <button
              class="w-full sm:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200 order-1 sm:order-2"
              @click="close"
          >
            {{ t("storage.close") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
