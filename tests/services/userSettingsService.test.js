import axios from 'axios';
import { getUserSettings, saveUserSettings } from '@/services/userSettingsService';
import { useUserStore } from '@/stores/userStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore');

describe('userSettingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save user settings successfully', async () => {
    const mockToken = 'mock-token';
    const mockSettings = { theme: 'light', notifications: false };

    useUserStore.mockReturnValue({ token: mockToken });
    axios.post.mockResolvedValue({});

    await saveUserSettings(mockSettings);

    expect(axios.post).toHaveBeenCalledWith(
      `${window.backendURL}/api/users/settings/save`,
      mockSettings,
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('should throw an error if no token is available when saving settings', async () => {
    useUserStore.mockReturnValue({ token: null });
    sessionStorage.getItem = vi.fn().mockReturnValue(null);

    await expect(saveUserSettings({})).rejects.toThrow('No token available');
  });
});
