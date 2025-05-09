import { setActivePinia, createPinia } from 'pinia';
import { useNewsStore } from '@/stores/newsStore';
import { describe, it, beforeEach, expect } from 'vitest';

describe('newsStore', () => {
  let newsStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    newsStore = useNewsStore();
  });

  it('should initialize with default state', () => {
    expect(newsStore.articles).toEqual([]);
    expect(newsStore.noNewsFound).toBe(false);
  });

  it('should clear all articles', () => {
    newsStore.articles = [{ title: 'News 1' }, { title: 'News 2' }];
    newsStore.clearNews();
    expect(newsStore.articles).toEqual([]);
  });
});
