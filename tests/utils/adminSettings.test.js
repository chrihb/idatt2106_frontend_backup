import { describe, it, expect } from 'vitest';
import { adminSettings } from '@/utils/adminSettings';

describe('adminSettings', () => {

  it('should contain news settings', () => {
    const newsSettings = adminSettings.value.find((setting) => setting.name === 'News');
    expect(newsSettings).toBeDefined();
    expect(newsSettings.children).toHaveLength(2);
  });
});
