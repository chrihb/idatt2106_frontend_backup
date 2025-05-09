import { describe, it, expect, vi, beforeEach } from 'vitest';
import fileImport from '@/utils/txtFileImport';

vi.mock('/src/locales/files/*.md', () => ({
  '/src/locales/files/test.en.md': vi.fn(() => Promise.resolve('English Content')),
  '/src/locales/files/test.no.md': vi.fn(() => Promise.resolve('Norwegian Content')),
}));

describe('txtFileImport', () => {
  let locale;

  beforeEach(() => {
    locale = { value: 'en' };
  });

  it('should return "Content not available." if the file does not exist', async () => {
    const content = await fileImport({ file: 'nonexistent' }, locale);
    expect(content).toBe('Content not available.');
  });

});
