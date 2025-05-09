import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '@/stores/settingsStore';
import { describe, it, beforeEach, expect } from 'vitest';

describe('settingsStore', () => {
  let settingsStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    settingsStore = useSettingsStore();
  });

  it('should initialize with default state', () => {
    expect(settingsStore.showStorage).toBe(false);
    expect(settingsStore.showHousehold).toBe(false);
  });

  it('should toggle showStorage', () => {
    settingsStore.toggleShowStorage();
    expect(settingsStore.showStorage).toBe(true);
    settingsStore.toggleShowStorage();
    expect(settingsStore.showStorage).toBe(false);
  });

  it('should toggle showHousehold', () => {
    settingsStore.toggleShowHousehold();
    expect(settingsStore.showHousehold).toBe(true);
    settingsStore.toggleShowHousehold();
    expect(settingsStore.showHousehold).toBe(false);
  });
});
