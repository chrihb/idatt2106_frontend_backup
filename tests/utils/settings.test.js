import { describe, it, expect } from 'vitest';
import { toggleableSettingKeys, routedSettings, iconMap } from '@/utils/settings';
import { HomeIcon, UserGroupIcon, CogIcon } from '@heroicons/vue/24/solid/index.js';

describe('settings', () => {
  it('should contain toggleable setting keys with correct structure', () => {
    expect(toggleableSettingKeys).toEqual([
      {
        id: 'showStorageStatusOnFrontpage',
        description: 'account-settings.show-storage-on-frontpage',
      },
      {
        id: 'showHouseholdStatusOnFrontpage',
        description: 'account-settings.show-household-on-frontpage',
      },
    ]);
  });

  it('should contain routed settings with correct structure', () => {
    expect(routedSettings.value).toEqual([
      {
        id: 1,
        description: 'account-settings.manage-households',
        icon: 'home',
        route: '/household/options',
        adminNeeded: false,
        superAdminNeeded: false,
      },
      {
        id: 2,
        description: 'account-settings.admin-settings',
        icon: 'settings',
        route: '/admin-settings',
        adminNeeded: true,
        superAdminNeeded: false,
      },
      {
        id: 3,
        description: 'account-settings.manage-admins',
        icon: 'group',
        route: '/manage-admins',
        adminNeeded: false,
        superAdminNeeded: true,
      },
    ]);
  });

  it('should map icons correctly', () => {
    expect(iconMap.home).toBe(HomeIcon);
    expect(iconMap.group).toBe(UserGroupIcon);
    expect(iconMap.settings).toBe(CogIcon);
  });
});
