import { setActivePinia, createPinia } from 'pinia';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('@/services/emergencyItemService', () => ({
  emergencyItemService: () => ({
    getEmergencyItemCategories: vi.fn().mockResolvedValue([
      { id: 1, englishName: 'Category 1', norwegianName: 'Kategori 1' },
    ]),
  }),
}));

describe('categoriesStore', () => {
  let categoriesStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    categoriesStore = useCategoriesStore();
  });

  it('should initialize with an empty categories array', () => {
    expect(categoriesStore.categories).toEqual([]);
  });

  it('should fetch categories successfully', async () => {
    await categoriesStore.fetchCategories();
    expect(categoriesStore.categories).toEqual([
      { id: 1, englishName: 'Category 1', norwegianName: 'Kategori 1' },
    ]);
  });

  it('should return a category by ID', () => {
    categoriesStore.categories = [{ id: 1, englishName: 'Category 1' }];
    const category = categoriesStore.getCategoryById(1);
    expect(category).toEqual({ id: 1, englishName: 'Category 1' });
  });

  it('should return the correct category name based on locale', () => {
    categoriesStore.categories = [
      { id: 1, englishName: 'Category 1', norwegianName: 'Kategori 1' },
    ];
    const nameEn = categoriesStore.getCategoryName(1, 'en');
    const nameNo = categoriesStore.getCategoryName(1, 'nb-NO');
    expect(nameEn).toBe('Category 1');
    expect(nameNo).toBe('Kategori 1');
  });

  it('should return "Unknown Category" for an invalid ID', () => {
    const name = categoriesStore.getCategoryName(999);
    expect(name).toBe('Unknown Category');
  });
});
