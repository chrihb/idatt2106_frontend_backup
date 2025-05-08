import {flushPromises, mount} from "@vue/test-utils";
import {beforeEach, describe, expect, it, vi} from "vitest";
import StorageItemMaximized
  from "@/components/emergencyStorage/StorageItemMaximized.vue";
import {createTestingPinia} from "@pinia/testing";

vi.mock("@/stores/emergencyItemsStore.js", () => ({
  useEmergencyItemsStore: vi.fn(() => ({
    fetchItemsByCategory: vi.fn().mockResolvedValue([
      {id: 1, name: "Rice", amount: 5, unitId: 3, expirationDate: "2025-12-31"},
      {id: 2, name: "Potatoes", amount: 10, unitId: 3, expirationDate: "2026-01-15"}
    ]),
    deleteItem: vi.fn().mockResolvedValue(true)
  }))
}));

vi.mock("@/stores/categoriesStore.js", () => ({
  useCategoriesStore: vi.fn(() => ({
    categories: [{id: 1, englishName: "Food"}],
    fetchCategories: vi.fn().mockResolvedValue(),
    getCategoryName: vi.fn().mockReturnValue("Food")
  }))
}));

vi.mock("@/stores/unitsStore.js", () => ({
  useUnitsStore: vi.fn(() => ({
    units: [{id: 1, englishName: "kg"}, {id: 2, englishName: "L"}],
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
    },
    locale: {value: 'en'}
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
        householdId: "household123",
        ...props
      },
      global: {
        plugins: [createTestingPinia({createSpy: vi.fn})],
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

  it('close event when close button is clicked', async () => {
    const closeButton = wrapper.find('button[class*="text-gray-500"]');
    await closeButton.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close.length).toBe(1);
  });

  it('close event when the bottom close button is clicked', async () => {
    const bottomCloseButton = wrapper.find(
        'button:not([data-test="create-item"])');
    await bottomCloseButton.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('create event with categoryId when "New Item" button is clicked', async () => {
    const newBtn = wrapper.find('[data-test="create-item"]');
    await newBtn.trigger('click');

    expect(wrapper.emitted().create).toBeTruthy();
    expect(wrapper.emitted().create[0]).toEqual([1]);
    expect(wrapper.emitted().close).toBeTruthy();
  });
});