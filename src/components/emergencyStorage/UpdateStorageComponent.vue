<script setup lang="js">
import {computed, onMounted, ref, watch} from 'vue';
import {useCategoriesStore} from '@/stores/categoriesStore.js';
import {useUnitsStore} from '@/stores/unitsStore.js';
import {useEmergencyItemsStore} from '@/stores/emergencyItemsStore.js';
import {useEmergencyItemStore} from '@/stores/emergencyItemStore.js';
import {useUserStore} from "@/stores/userStore.js";
import {useI18n} from "vue-i18n";
import {XMarkIcon} from "@heroicons/vue/24/solid/index.js";

const {t, locale} = useI18n();
const props = defineProps(['categoryId', 'unitId', 'itemId', 'display', 'householdId']);
const emit = defineEmits(['close', 'itemSaved']);

const categoriesStore = useCategoriesStore();
const unitsStore = useUnitsStore();
const itemsStore = useEmergencyItemsStore();
const currentItemStore = useEmergencyItemStore();
const userStore = useUserStore();

const isUpdate = computed(() => props.itemId !== null);

const categories = ref([]);
const units = ref([]);

const formattedUnits = computed(() => {
  return units.value.map(unit => ({
    id: unit.id,
    name: unitsStore.getUnitName(unit.id, locale.value)
  }));
});

const formattedCategories = computed(() => {
  return categories.value.map(category => ({
    id: category.id,
    name: categoriesStore.getCategoryName(category.id, locale.value)
  }));
});

const itemData = ref({
  name: '',
  amount: '',
  unitId: props.unitId || 0,
  expirationDate: '',
  categoryId: props.categoryId || 0,
  householdId: props.householdId || null
});

const selectedCategory = ref(props.categoryId || 0);
const selectedHousehold = ref(props.householdId)
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
  try {
    const householdId = userStore?.householdId?.[0]?.id || null;
    itemData.value = {
      name: '',
      amount: '',
      unitId: 0,
      expirationDate: '',
      categoryId: 0,
      householdId: householdId
    };

    selectedCategory.value = 0;
    selectedHousehold.value = null;
    selectedUnit.value = 0;
    formIncomplete.value = false;

    currentItemStore.resetState();
  } catch (error) {
  }
};

const loadUnits = async () => {
  try {
    if (unitsStore.units.length === 0) {
      await unitsStore.fetchUnits();
    }
    units.value = unitsStore.units;
  } catch (error) {
  }
};

const loadCategories = async () => {
  try {
    if (categoriesStore.categories.length === 0) {
      await categoriesStore.fetchCategories();
    }
    categories.value = categoriesStore.categories;
  } catch (error) {
  }
};

const loadItemData = async () => {
  await Promise.all([loadCategories(), loadUnits()]);

  if (props.itemId) {
    try {
      let item;

      if (props.categoryId) {
        item = itemsStore.getItemById(props.itemId);

        if (!item && props.householdId) {
          await itemsStore.fetchItemsByCategory(props.categoryId, props.householdId);
          item = itemsStore.getItemById(props.itemId);
        }
      } else {
        await currentItemStore.fetchItemById(props.itemId);
        item = {
          id: currentItemStore.itemId,
          name: currentItemStore.name,
          amount: currentItemStore.amount,
          categoryId: currentItemStore.categoryId,
          unitId: currentItemStore.unitId,
          expirationDate: currentItemStore.expirationDate,
          householdId: currentItemStore.householdIds
        };
      }

      if (item) {
        if (item.expirationDate && typeof item.expirationDate === 'string') {
          item.expirationDate = new Date(item.expirationDate);
        }

        itemData.value = {...item};

        selectedCategory.value = item.categoryId;
        selectedUnit.value = item.unitId;

        if (item.householdIds !== undefined) {
          selectedHousehold.value = item.householdIds;
          itemData.value.householdId = item.householdIds;
        } else if (item.householdId !== undefined) {
          selectedHousehold.value = item.householdId;
          itemData.value.householdId = item.householdId;
        } else {
          selectedHousehold.value = userStore.householdId[0]?.id;
          itemData.value.householdId = userStore.householdId[0]?.id;
        }

        currentItemStore.setItemData(item);
      }
    } catch (error) {
    }
  } else if (props.categoryId || props.unitId || props.householdId) {
    if (props.unitId) {
      selectedUnit.value = props.unitId;
      itemData.value.unitId = props.unitId;
    }

    if (props.categoryId) {
      selectedCategory.value = props.categoryId;
      itemData.value.categoryId = props.categoryId;
    }

    if (props.householdId) {
      selectedHousehold.value = props.householdId;
      itemData.value.householdId = props.householdId;
    }
  }
};

const saveItem = async () => {
  if (
      !itemData.value.name.trim() ||
      !itemData.value.amount ||
      !selectedCategory.value ||
      !selectedUnit.value ||
      !itemData.value.expirationDate ||
      !selectedHousehold.value
  ) {
    formIncomplete.value = true;
    return;
  }

  try {
    formIncomplete.value = false;

    currentItemStore.itemId = itemData.value.id;
    currentItemStore.name = itemData.value.name;
    currentItemStore.amount = itemData.value.amount;
    currentItemStore.categoryId = selectedCategory.value;
    currentItemStore.unitId = selectedUnit.value;
    currentItemStore.expirationDate = typeof itemData.value.expirationDate === 'string'
        ? itemData.value.expirationDate
        : itemData.value.expirationDate.toISOString().split('T')[0];
    currentItemStore.householdIds = selectedHousehold.value;

    await currentItemStore.saveItem();

    emit('itemSaved');
    close();
  } catch (error) {
  }
};

watch(() => categoriesStore.categories, (newCategories) => {
  categories.value = newCategories;
}, {deep: true});

watch(() => unitsStore.units, (newUnits) => {
  units.value = newUnits;
}, {deep: true});

watch(() => props.display, async (newVal) => {
  if (newVal) {
    await loadItemData();
  }
});

onMounted(async () => {
  await Promise.all([loadCategories(), loadUnits()]);

  if (props.display) {
    await loadItemData();
  }
});
</script>

<template>
  <Teleport v-if="display" to="body">
    <div>
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      <div
           class="fixed inset-0 flex items-center justify-center drop-shadow-md z-50 p-3 sm:p-0">
        <div
            class="bg-white rounded-lg shadow-xl w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-auto p-4 sm:p-6 max-w-3xl">
          <div class="flex flex-row justify-between items-center mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-800">
              {{ isUpdate ? t('storage.update-item') : t('storage.new-item') }}
            </h1>
            <XMarkIcon class="w-8 h-8 cursor-pointer text-red-500"
                       @click="handleCancel"/>
          </div>

          <div class="space-y-3">
            <div class="mb-3">
              <label for="item-name" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('storage.item-name') }}
              </label>
              <input
                  id="item-name"
                  v-model="itemData.name"
                  type="text"
                  :placeholder="t('storage.item-name')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base">
            </div>

            <div class="mb-3">
              <label for="item-category" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('storage.select-category') }}
              </label>
              <select
                  id="item-category"
                  data-test="select-category"
                  v-model="selectedCategory"
                  class="border border-gray-300 w-full rounded-lg p-3 text-base text-black focus:ring-2 focus:ring-blue-500 bg-white">
                <option disabled :value="0">{{ t("storage.select-category") }}</option>
                <option v-for="category in formattedCategories" :key="category.id"
                        :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('storage.item-amount') }}
              </label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                    v-model="itemData.amount"
                    type="number"
                    :placeholder="t('storage.item-amount')"
                    class="w-full sm:w-3/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base">
                <select
                    data-test="select-unit"
                    v-model="selectedUnit"
                    class="border border-gray-300 w-full sm:w-1/4 rounded-lg p-3 text-base text-black focus:ring-2 focus:ring-blue-500 bg-white">
                  <option disabled :value="0">{{ t("storage.select-unit") }}</option>
                  <option v-for="unit in formattedUnits" :key="unit.id" :value="unit.id">
                    {{ unit.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="item-expiration" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('storage.expiration-date') }}
              </label>
              <input
                  id="item-expiration"
                  v-model="itemData.expirationDate"
                  type="date"
                  :placeholder="t('storage.expiration-date')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base">
            </div>
          </div>

          <div>
            <label for="item-household" class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('storage.select-household') }}
            </label>
            <select
                id="item-household"
                v-model="selectedHousehold"
                class="border border-gray-300 w-full rounded-lg p-3 text-base text-black focus:ring-2 focus:ring-blue-500 bg-white">
              <option disabled value="">{{ t("storage.select-household") }}</option>
              <option v-for="household in userStore.householdId" :key="household.id" :value="household.id">
                {{ household.name }}
              </option>
            </select>
          </div>

          <div data-test="incomplete-form" v-if="formIncomplete" class="mt-3 mb-1 text-red-600 text-sm text-center">
            {{ t("storage.fill-all-fields") }}
          </div>

          <div
              class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
            <button
                data-test="save-item"
                class="order-2 sm:order-1 w-full sm:w-auto px-4 py-3 bg-kf-blue rounded-lg text-white font-medium transition-colors duration-200 text-base"
                @click="saveItem">
              {{ isUpdate ? t("storage.update-item") : t("storage.new-item") }}
            </button>
            <button
                class="order-1 sm:order-2 w-full sm:w-auto px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200 text-base"
                @click="handleCancel"
            >
              {{ t("storage.close") }}
            </button>
          </div>

          <div v-if="showConfirmation"
               class="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div class="bg-white rounded-lg p-4 sm:p-6 shadow-xl max-w-md w-full">
              <p class="mb-4 sm:mb-6 text-base sm:text-lg">{{ t("storage.leave-message") }}</p>
              <div class="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3">
                <button
                    class="w-full sm:w-auto order-2 sm:order-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200 text-base"
                    @click="cancelConfirmation">
                  {{ t("storage.stay") }}
                </button>
                <button
                    class="w-full sm:w-auto order-1 sm:order-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors duration-200 text-base"
                    @click="confirmCancel">
                  {{ t("storage.quit") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>