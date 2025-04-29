import {mount, flushPromises} from "@vue/test-utils";
import {describe, it, expect, vi, beforeEach} from "vitest";
import StorageItemMaximized from "@/components/emergencyStorage/StorageItemMaximized.vue";
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";

vi.mock("@/services/emergencyItemService.js", () => ({
  emergencyItemService: vi.fn(() => ({
    getEmergencyItemByCategoryId: vi.fn().mockResolvedValue([
      {id: 1, name: "Rice", amount: 5, unitId: 3, expirationDate: "2025-12-31"},
      {id: 2, name: "Potatoes", amount: 10, unitId: 3, expirationDate: "2026-01-15"}
    ]),
    deleteEmergencyItem: vi.fn().mockResolvedValue(true)
  }))
}));

vi.mock("@/stores/categoriesStore.js", () => ({
  useCategoriesStore: vi.fn(() => ({
    categories: [{id: 1, name: "Food"}],
    fetchCategories: vi.fn().mockResolvedValue(),
    getCategoryName: vi.fn().mockReturnValue("Food")
  }))
}));

vi.mock("@/stores/unitsStore.js", () => ({
  useUnitsStore: vi.fn(() => ({
    units: [{id: 1, name: "kg"}, {id: 2, name: "L"}],
    fetchUnits: vi.fn().mockResolvedValue(),
    getUnitName: vi.fn((id) => id === 1 ? "kg" : "L")
  }))
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key) => {
      const translations = {
        "storage.no-items-in-category": "No items in this category",
        "storage.new-item": "New Item",
        "storage.close": "Close"
      };
      return translations[key] || key;
    }
  }),
  createI18n: vi.fn(() => ({
    global: {},
    install: vi.fn()
  }))
}));

vi.mock("@/components/emergencyStorage/StorageItemMinimized.vue", () => ({
  default: {
    name: "StorageItemMinimized",
    props: ["id", "name", "amount", "unit", "expirationDate", "possibleUpdate"],
    template: '<div class="storage-item-minimized">{{name}} - {{amount}} {{unit}}</div>'
  }
}));

describe('StorageItemMaximized.vue', () => {
  let wrapper;

  const makeComponent = (props = {}) => {
    return mount(StorageItemMaximized, {
      props: {
        categoryId: 1,
        display: true,
        ...props
      },
      global: {
        stubs: {
          Teleport: true,
          StorageItemMinimized: true
        }
      }
    });
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    wrapper = makeComponent();
    await flushPromises();
  });

  it('renders when display is true', () => {
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.find('h1').text()).toBe('Food');
  });

  it('does not render when display is false', async () => {
    wrapper = makeComponent({display: false});
    await flushPromises();

    expect(wrapper.find('.fixed').exists()).toBeFalsy();
  });

  it('loads items for the given category on mount', async () => {
    const items = wrapper.findAllComponents(StorageItemMinimized);
    expect(items).toHaveLength(2);
  });

  it('close event when close button is clicked', async () => {
    const closeButton = wrapper.find('button[class*="text-gray-500"]');
    await closeButton.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('close event when the bottom close button is clicked', async () => {
    const bottomButton = wrapper.findAll('button').at(-1);
    await bottomButton.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('create event with categoryId when "New Item" button is clicked', async () => {
    const newBtn = wrapper.find('button.bg-blue-500');
    await newBtn.trigger('click');

    expect(wrapper.emitted().create).toBeTruthy();
    expect(wrapper.emitted().create[0]).toEqual([1]);
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('update event when update is triggered from a storage item', async () => {
    const firstItem = wrapper.findComponent(StorageItemMinimized);

    await firstItem.vm.$emit('update', 1);

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0]).toEqual([1]);
    expect(wrapper.emitted().close).toBeTruthy();
  });
});