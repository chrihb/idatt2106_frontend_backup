<script setup lang="js">
import {defineComponent, ref, computed, onMounted, watch, defineProps, defineEmits} from 'vue';
import {emergencyItemService} from '@/services/emergencyItemService.js';
import {useCategoriesStore} from '@/stores/categoriesStore.js';
import {useUnitsStore} from '@/stores/unitsStore.js';
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const isUpdate = computed(() => props.itemId !== null);
const categoriesStore = useCategoriesStore();
const unitsStore = useUnitsStore();
const props = defineProps(['categoryId', 'unitId', 'itemId', 'display']);
const emit = defineEmits(['close', 'itemSaved']);

const categories = ref([]);
const units = ref([]);

const itemData = ref({
  name: '',
  amount: '',
  unitId: props.unitId || 0,
  expirationDate: '',
  categoryId: props.categoryId || 0
});

const selectedCategory = ref(props.categoryId || 0);
const selectedUnit = ref(props.unitId || 0);
const formIncomplete = ref(false);
const showConfirmation = ref(false);

const close = () => {
  resetForm();
  emit('close');
};

const handleCancel = () => {
  showConfirmation.value = true;
};

const confirmCancel = () => {
  showConfirmation.value = false;
  close();
};

const cancelConfirmation = () => {
  showConfirmation.value = false;
};

const resetForm = () => {
  itemData.value = {
    name: '',
    amount: '',
    unitId: 0,
    expirationDate: '',
    categoryId: 0
  };

  selectedCategory.value = null;
  selectedUnit.value = null;
  formIncomplete.value = false;
};

const loadItemData = async () => {
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories();
  }
  categories.value = categoriesStore.categories;

  if (unitsStore.units.length === 0) {
    await unitsStore.fetchUnits();
  }
  units.value = unitsStore.units;

  if (props.itemId) {
    try {
      let item;
      const service = emergencyItemService();

      if (props.categoryId) {
        const items = await service.getEmergencyItemByCategoryId(props.categoryId);
        item = items.find((i) => i.id === props.itemId);
      } else {
        item = await service.getEmergencyItemById(props.itemId);
      }

      if (item) {
        if (item.expirationDate && typeof item.expirationDate === 'string') {
          item.expirationDate = new Date(item.expirationDate);
        }

        itemData.value = {...item};
        selectedCategory.value = item.categoryId;
        selectedUnit.value = item.unitId;
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  } else if (props.categoryId || props.unitId) {
    if (props.unitId) {
      selectedUnit.value = props.unitId;
      itemData.value.unitId = props.unitId;
    }

    if (props.categoryId) {
      selectedCategory.value = props.categoryId;
      itemData.value.categoryId = props.categoryId;
    }
  }
};

const saveItem = async () => {
  if (
      !itemData.value.name.trim() ||
      !itemData.value.amount ||
      !selectedCategory.value ||
      !selectedUnit.value ||
      !itemData.value.expirationDate
  ) {
    formIncomplete.value = true;
    return;
  }
  try {
    formIncomplete.value = false;

    const saveData = {
      id: itemData.value.id,
      name: itemData.value.name,
      amount: itemData.value.amount,
      categoryId: selectedCategory.value,
      unitId: selectedUnit.value,
      expirationDate: typeof itemData.value.expirationDate === 'string'
          ? itemData.value.expirationDate
          : itemData.value.expirationDate.toISOString().split('T')[0]
    };

    const service = emergencyItemService();
    if (isUpdate.value) {
      await service.updateEmergencyItem(saveData);
    } else {
      await service.createEmergencyItem(saveData);
    }

    emit('itemSaved');
    close();
  } catch (error) {
    console.error("Error saving item:", error);
  }
};

watch(() => categoriesStore.categories, (newCategories) => {
  categories.value = newCategories;
}, {deep: true});

watch(() => unitsStore.units, (newUnits) => {
  units.value = newUnits;
}, {deep: true});

watch(() => props.display, (newVal) => {
  if (newVal) {
    loadItemData();
  }
});

onMounted(async () => {
  if (props.display) {
    await loadItemData();
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="display"
         class="fixed inset-0 flex items-center justify-center z-50">
      <div
          class="bg-white rounded-lg shadow-xl w-4/5 md:w-3/5 max-h-4/5 overflow-auto p-6 max-w-3xl">
        <div class="flex flex-row justify-between items-center mb-6 border-b pb-4">
          <h1 class="text-2xl font-bold text-gray-800">
            {{ isUpdate ? 'Update Item' : 'Add New Item' }}
          </h1>
          <button
              class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              @click="handleCancel"
          >
            ✖
          </button>
        </div>

        <div class="space-y-3">
          <input
              v-model="itemData.name"
              type="text"
              :placeholder="t('storage.item-name')"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <select v-model="selectedCategory"
                  class="border border-gray-300 w-5/5 rounded-lg p-2 text-black focus:ring-2 focus:ring-blue-500">
            <option disabled value="">{{ t("storage.select-category") }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div class="flex gap-2">
            <input
                v-model="itemData.amount"
                type="number"
                :placeholder="t('storage.item-amount')"
                class="w-4/5 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <select v-model="selectedUnit"
                    class="border border-gray-300 w-1/5 rounded-lg px-2 py-1 text-black focus:ring-2 focus:ring-blue-500">
              <option disabled value="">{{ t("storage.select-unit") }}</option>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">
                {{ unit.name }}
              </option>
            </select>
          </div>
          <input
              v-model="itemData.expirationDate"
              type="date"
              :placeholder="t('storage.expiration-date')"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div class="mt-6 pt-4 border-t flex justify-between">
          <button
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors duration-200"
              @click="saveItem">
            {{ isUpdate ? t("storage.update-item") : t("storage.new-item") }}
          </button>
          <p
              v-if="formIncomplete"
              class="text-red-600 text-sm">
            {{ t("storage.fill-all-fields") }}
          </p>
          <button
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
              @click="handleCancel"
          >
            {{ t("storage.close") }}
          </button>
        </div>

        <div v-if="showConfirmation"
             class="fixed inset-0 flex items-center justify-center z-[60]">
          <div class="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <p class="mb-6">{{ t("storage.leave-message") }}</p>
            <div class="flex justify-end space-x-3">
              <button
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
                  @click="cancelConfirmation">
                {{ t("storage.stay") }}
              </button>
              <button
                  class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors duration-200"
                  @click="confirmCancel">
                {{ t("storage.quit") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>