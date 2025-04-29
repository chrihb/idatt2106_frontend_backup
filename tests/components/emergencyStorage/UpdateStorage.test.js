import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UpdateStorage from "@/components/emergencyStorage/UpdateStorageComponent.vue";

vi.mock("@/services/emergencyItemService.js", () => ({
  emergencyItemService: vi.fn(() => ({
    getEmergencyItemByCategoryId: vi.fn().mockResolvedValue([
      { id: 1, name: "Rice", amount: 5, unitId: 1, categoryId: 1, expirationDate: "2025-12-31" }
    ]),
    getEmergencyItemById: vi.fn().mockResolvedValue(
        { id: 1, name: "Rice", amount: 5, unitId: 1, categoryId: 1, expirationDate: "2025-12-31" }
    ),
    createEmergencyItem: vi.fn().mockResolvedValue(true),
    updateEmergencyItem: vi.fn().mockResolvedValue(true)
  }))
}));

vi.mock("@/stores/categoriesStore.js", () => ({
  useCategoriesStore: vi.fn(() => ({
    categories: [
      { id: 1, name: "Food" },
      { id: 2, name: "Water" }
    ],
    fetchCategories: vi.fn().mockResolvedValue()
  }))
}));

vi.mock("@/stores/unitsStore.js", () => ({
  useUnitsStore: vi.fn(() => ({
    units: [
      { id: 1, name: "kg" },
      { id: 2, name: "L" }
    ],
    fetchUnits: vi.fn().mockResolvedValue()
  }))
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key) => {
      const translations = {
        "storage.item-name": "Item Name",
        "storage.select-category": "Select Category",
        "storage.item-amount": "Amount",
        "storage.select-unit": "Select Unit",
        "storage.expiration-date": "Expiration Date",
        "storage.update-item": "Update Item",
        "storage.new-item": "New Item",
        "storage.close": "Close",
        "storage.fill-all-fields": "Please fill all fields",
        "storage.leave-message": "Are you sure you want to leave? Your changes will be lost.",
        "storage.stay": "Stay",
        "storage.quit": "Quit"
      };
      return translations[key] || key;
    }
  }),
  createI18n: vi.fn(() => ({
    global: {},
    install: vi.fn()
  }))
}));

describe('UpdateStorage.vue', () => {
  let wrapper;

  const setupComp = (props = {}) => {
    return mount(UpdateStorage, {
      props: {
        categoryId: null,
        unitId: null,
        itemId: null,
        display: true,
        ...props
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    });
  };

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it('renders correctly for new item mode', async () => {
    wrapper = setupComp();
    await flushPromises();

    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.find('h1').text()).toBe('Add New Item');
    expect(wrapper.find('button.bg-blue-500').text()).toContain('New Item');
  });

  it('renders correctly for update mode', async () => {
    wrapper = setupComp({ itemId: 1 });
    await flushPromises();

    expect(wrapper.find('h1').text()).toBe('Update Item');
    expect(wrapper.find('button.bg-blue-500').text()).toContain('Update Item');
  });


  it('uses provided categoryId and unitId for new item', async () => {
    wrapper = setupComp({ categoryId: 2, unitId: 2 });
    await flushPromises();

    expect(wrapper.findAll('select')[0].element.value).toBe('2');
    expect(wrapper.findAll('select')[1].element.value).toBe('2');
  });

  it('shows incomplete form message when trying to save with missing fields', async () => {
    wrapper = setupComp();
    await flushPromises();

    await wrapper.find('button.bg-blue-500').trigger('click');

    expect(wrapper.find('.text-red-600').exists()).toBeTruthy();
    expect(wrapper.find('.text-red-600').text()).toContain('Please fill all fields');
  });

  it('shows confirmation dialog when trying to close with changes', async () => {
    wrapper = setupComp();
    await flushPromises();

    await wrapper.find('input[type="text"]').setValue('New Item');

    await wrapper.find('button.text-gray-500').trigger('click');

    expect(wrapper.find('.z-\\[60\\]').exists()).toBeTruthy();
    expect(wrapper.find('.z-\\[60\\] p').text()).toContain('Are you sure you want to leave?');
  });

  it('stays on form when canceling confirmation', async () => {
    wrapper = setupComp();
    await flushPromises();

    await wrapper.find('input[type="text"]').setValue('New Item');
    await wrapper.find('button.text-gray-500').trigger('click');

    const stayBtn = wrapper.find('.z-\\[60\\] button:first-of-type');
    await stayBtn.trigger('click');

    expect(wrapper.find('.z-\\[60\\]').exists()).toBeFalsy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.emitted().close).toBeFalsy();
  });

  it('closes form when confirming quit', async () => {
    wrapper = setupComp();
    await flushPromises();

    await wrapper.find('input[type="text"]').setValue('New Item');
    await wrapper.find('button.text-gray-500').trigger('click');

    const quitBtn = wrapper.find('.z-\\[60\\] button:last-of-type');
    await quitBtn.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
  });
});