import { setActivePinia, createPinia } from 'pinia';
import { useLayerLabelStore } from '@/stores/layerLabelStore';
import { describe, it, beforeEach, expect } from 'vitest';

describe('layerLabelStore', () => {
  let layerLabelStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    layerLabelStore = useLayerLabelStore();
  });

  it('should initialize with default labels', () => {
    expect(layerLabelStore.labels).toHaveProperty('home', 'Hjem');
    expect(layerLabelStore.labels).toHaveProperty('Hjertestarter', 'Hjertestarter');
  });

  it('should return the correct label for a given key', () => {
    const label = layerLabelStore.getLabel('home');
    expect(label).toBe('Hjem');
  });

  it('should return the key itself if no label is found', () => {
    const label = layerLabelStore.getLabel('unknownKey');
    expect(label).toBe('unknownKey');
  });

  it('should update a label', () => {
    layerLabelStore.updateLabel('home', 'New Home Label');
    expect(layerLabelStore.labels.home).toBe('New Home Label');
  });

  it('should replace all labels with new ones', () => {
    const newLabels = { testKey: 'Test Label' };
    layerLabelStore.setLabels(newLabels);
    expect(layerLabelStore.labels).toEqual(newLabels);
  });
});
