import { describe, it, expect } from 'vitest';
import { adminSettings } from '@/utils/adminSettings';

describe('adminSettings', () => {
  it('should contain map settings', () => {
    const mapSettings = adminSettings.value.find((setting) => setting.name === 'Map');
    expect(mapSettings).toBeDefined();
    expect(mapSettings.children).toHaveLength(5);
  });

  it('should contain news settings', () => {
    const newsSettings = adminSettings.value.find((setting) => setting.name === 'News');
    expect(newsSettings).toBeDefined();
    expect(newsSettings.children).toHaveLength(2);
  });

  it('should have correct routes for map settings', () => {
    const mapSettings = adminSettings.value.find((setting) => setting.name === 'Map');
    const createZoneRoute = mapSettings.children.find((child) => child.name === 'CreateNewEmergencyZone');
    expect(createZoneRoute.route).toBe('/admin-settings/createEmergencyZone');
  });
});
