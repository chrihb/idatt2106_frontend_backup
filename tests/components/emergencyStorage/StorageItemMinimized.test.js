import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StorageItemMinimized from "@/components/emergencyStorage/StorageItemMinimized.vue";

vi.mock("vue-i18n", () => {
  const useI18n = () => ({
    t: (key) => {
      const translations = {
        "storage.expiration-date": "Expiration Date",
        "storage.update-item": "Update",
        "storage.delete-item": "Delete"
      };
      return translations[key] || key;
    }
  });

  const createI18n = () => ({
    global: {
      t: useI18n().t
    },
    install: vi.fn()
  });

  return {
    useI18n,
    createI18n
  };
});

describe("StorageItemMinimized.vue", () => {
  const defaultValues = {
    id: "1",
    name: "Water",
    amount: "5",
    unit: "L",
    expirationDate: "2025-12-31",
    possibleUpdate: true
  };

  let wrapper;

  beforeEach(() => {
    wrapper = mount(StorageItemMinimized, {
      props: defaultValues,
      global: {
        mocks: {
          $t: (key) => {
            const translations = {
              "storage.expiration-date": "Expiration Date",
              "storage.update-item": "Update",
              "storage.delete-item": "Delete"
            };
            return translations[key] || key;
          }
        }
      }
    });
  });

  it("renders with correct values", () => {
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.text()).toContain("5 L");
    expect(wrapper.text()).toContain("Water");
    expect(wrapper.text()).toContain("Expiration Date: 2025-12-31");
  });

  it("renders update and delete buttons when possibleUpdate are true", () => {
    expect(wrapper.getItem("button:first-of-type").text()).toBe("Update");
    expect(wrapper.getItem("button:second-of-type").text()).toBe("Delete");
  });

  it("does not render buttons when possibleUpdate is false", async () => {
    await wrapper.setProps({ possibleUpdate: false });

    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(0);
  });

  it("click event when item is clicked", async () => {
    await wrapper.trigger("click");

    expect(wrapper.emitted().click).toBeTruthy();
  });

  it("update event when update button is clicked", async () => {
    const updateButton = wrapper.find("button:first-of-type");
    await updateButton.trigger("click");

    expect(wrapper.emitted().update).toBeTruthy();
  });

  it("delete event when delete button is clicked", async () => {
    const deleteButton = wrapper.find("button:last-of-type");
    await deleteButton.trigger("click");

    expect(wrapper.emitted().delete).toBeTruthy();
  });

  it("prevents event propagation when buttons are clicked", async () => {
    const updateButton = wrapper.find("button:first-of-type");
    await updateButton.trigger("click");

    expect(wrapper.emitted().click).toBeFalsy();

    expect(wrapper.emitted().update).toBeTruthy();
  });
});