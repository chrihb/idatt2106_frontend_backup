import { ref } from 'vue';
import {mount, flushPromises} from "@vue/test-utils";
import {describe, it, expect, vi, beforeEach} from "vitest";
import StorageFeed from "@/components/emergencyStorage/StorageFeed.vue";
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";
import StorageItemMaximized from "@/components/emergencyStorage/StorageItemMaximized.vue";
import UpdateStorageComponent from "@/components/emergencyStorage/UpdateStorageComponent.vue";
import DetailedStorageStatus from "@/components/emergencyStorage/DetailedStorageStatus.vue";
import EssentialItemChecklist from "@/components/emergencyStorage/EssentialItemChecklist.vue";
import {useEmergencyItemsStore} from "@/stores/emergencyItemsStore.js";
import {emergencyItemService} from "@/services/emergencyItemService.js";

vi.mock("@/services/emergencyItemService.js", () => ({
  emergencyItemService: vi.fn(() => ({
    getEmergencyItemByCategoryId: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: "Rice",
        amount: 5,
        unitId: 1,
        categoryId: 1,
        expirationDate: "2025-12-31"
      },
      {
        id: 2,
        name: "Pasta",
        amount: 3,
        unitId: 1,
        categoryId: 1,
        expirationDate: "2026-01-15"
      }
    ])
  }))
}));

vi.mock("@/stores/categoriesStore.js", () => ({
  useCategoriesStore: vi.fn(() => ({
    categories: [
      {id: 1, name: "Food"},
      {id: 2, name: "Water"}
    ],
    fetchCategories: vi.fn().mockResolvedValue(),
    getCategoryName: vi.fn((id, locale) => id === 1 ? "Food" : "Water")
  }))
}));

vi.mock("@/stores/unitsStore.js", () => ({
  useUnitsStore: vi.fn(() => ({
    units: [
      {id: 1, name: "kg"},
      {id: 2, name: "L"}
    ],
    fetchUnits: vi.fn().mockResolvedValue(),
    getUnitName: vi.fn((id, locale) => id === 1 ? "Kg" : "L")
  }))
}));

vi.mock("@/stores/emergencyItemsStore.js", () => ({
  useEmergencyItemsStore: vi.fn(() => {
    const items = [
      {
        id: 1,
        name: "Rice",
        amount: 5,
        unitId: 1,
        categoryId: 1,
        expirationDate: "2025-12-31"
      },
      {
        id: 2,
        name: "Pasta",
        amount: 3,
        unitId: 1,
        categoryId: 1,
        expirationDate: "2026-01-15"
      },
      {
        id: 3,
        name: "Water",
        amount: 10,
        unitId: 2,
        categoryId: 2,
        expirationDate: "2026-02-01"
      }
    ];

    return {
      items,
      fetchAllItems: vi.fn().mockResolvedValue(items),
      fetchItemsByCategory: vi.fn((categoryId) => {
        return Promise.resolve(
            items.filter(item => item.categoryId === categoryId));
      })
    };
  })
}));

vi.mock("@/components/emergencyStorage/StorageItemMinimized.vue", () => ({
  default: {
    name: "StorageItemMinimized",
    props: ["id", "name", "amount", "unit", "expirationDate", "possibleUpdate"],
    template: '<div class="storage-item-minimized" @click="$emit(\'click\')">{{name}} - {{amount}} {{unit}}</div>'
  }
}));

vi.mock("@/components/emergencyStorage/StorageItemMaximized.vue", () => ({
  default: {
    name: "StorageItemMaximized",
    props: ["categoryId", "display", "householdId"],
    template: '<div v-if="display" class="storage-item-maximized">Category: {{categoryId}}</div>',
    emits: ['close', 'update', 'create', 'itemUpdated']
  }
}));

vi.mock("@/components/emergencyStorage/UpdateStorageComponent.vue", () => ({
  default: {
    name: "UpdateStorageComponent",
    props: ["display", "categoryId", "itemId"],
    template: '<div v-if="display" class="update-storage-component">Item: {{itemId}}</div>',
    emits: ['close', 'itemSaved']
  }
}));

vi.mock("@/components/emergencyStorage/DetailedStorageStatus.vue", () => ({
  default: {
    name: "DetailedStorageStatus",
    props: ["householdId"],
    template: '<div class="detailed-storage-status">Storage Status</div>'
  }
}));

vi.mock("@/components/emergencyStorage/EssentialItemChecklist.vue", () => ({
  default: {
    name: "EssentialItemChecklist",
    props: ["householdId"],
    template: '<div class="essential-item-checklist">Essential Items</div>',
    methods: {
      refreshEssentials: vi.fn()
    }
  }
}));

vi.mock("@heroicons/vue/24/solid/index.js", () => ({
  ExclamationTriangleIcon: {
    render: () => null
  },
  XCircleIcon: {
    render: () => null
  }
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key) => {
      const translations = {
        "storage.new-item": "New Item",
        "storage.inventory-categories": "Inventory Categories",
        "storage.no-items-in-category": "No items in this category",
        "storage.inconsistent-units": "Mixed Units",
        "storage.expired": "Expired",
        "storage.expiring-soon": "Expiring Soon"
      };
      return translations[key] || key;
    },
    locale: ref("en")
  }),
  createI18n: vi.fn(() => ({
    global: {},
    install: vi.fn()
  }))
}));

describe('StorageFeed.vue', () => {
  let wrapper;

  beforeEach(async () => {
    vi.clearAllMocks();

    wrapper = mount(StorageFeed, {
      props: {
        householdId: "123"
      },
      global: {
        stubs: {
          StorageItemMinimized: true,
          StorageItemMaximized: true,
          UpdateStorageComponent: true,
          DetailedStorageStatus: true,
          EssentialItemChecklist: true,
          ExclamationTriangleIcon: true,
          XCircleIcon: true
        }
      }
    });

    await flushPromises();
  });

  it('displays correctly with initial elements', async () => {
    expect(wrapper.isVisible()).toBeTruthy();

    const newItemButton = wrapper.find('button');
    expect(newItemButton.exists()).toBeTruthy();
    expect(newItemButton.text()).toBe('New Item');

    const categoryItems = wrapper.findAllComponents(StorageItemMinimized);
    expect(categoryItems.length).toBe(2);
  });

  it('opens and closes category modal', async () => {
    const categoryItems = wrapper.findAllComponents(StorageItemMinimized);
    await categoryItems[0].trigger('click');
    await flushPromises();

    const modal = wrapper.findComponent(StorageItemMaximized);
    expect(modal.props().display).toBe(true);
    expect(modal.props().categoryId).toBe(1);
    expect(modal.props().householdId).toBe("123");

    await modal.vm.$emit('close');
    await flushPromises();

    expect(wrapper.vm.modalData.display).toBe(false);
  });

  it('shows create modal on create event', async () => {
    const categoryItems = wrapper.findAllComponents(StorageItemMinimized);
    await categoryItems[0].trigger('click');
    await flushPromises();

    const modal = wrapper.findComponent(StorageItemMaximized);
    await modal.vm.$emit('create', 1);
    await flushPromises();

    const updateModal = wrapper.findComponent(UpdateStorageComponent);
    expect(updateModal.props().display).toBe(true);
    expect(updateModal.props().categoryId).toBe(1);
    expect(updateModal.props().itemId).toBe(null);
  });

  it('opens create modal on click of New Item button', async () => {
    const newItemButton = wrapper.find('button');
    await newItemButton.trigger('click');
    await flushPromises();

    const updateModal = wrapper.findComponent(UpdateStorageComponent);
    expect(updateModal.props().display).toBe(true);
    expect(updateModal.props().categoryId).toBe(null);
    expect(updateModal.props().itemId).toBe(null);
  });

  it('closes update modal', async () => {
    const newItemButton = wrapper.find('button');
    await newItemButton.trigger('click');
    await flushPromises();

    const updateModal = wrapper.findComponent(UpdateStorageComponent);
    await updateModal.vm.$emit('close');
    await flushPromises();

    expect(wrapper.vm.updateModalData.display).toBe(false);
  });

  it('shows update modal on update event', async () => {
    const categoryItems = wrapper.findAllComponents(StorageItemMinimized);
    await categoryItems[0].trigger('click');
    await flushPromises();

    const modal = wrapper.findComponent(StorageItemMaximized);
    await modal.vm.$emit('update', 1);
    await flushPromises();

    const updateModal = wrapper.findComponent(UpdateStorageComponent);
    expect(updateModal.props().display).toBe(true);
    expect(updateModal.props().categoryId).toBe(1);
    expect(updateModal.props().itemId).toBe(1);
  });
});