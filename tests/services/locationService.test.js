import axios from 'axios';
import { updateUserLocation, startLocationTracking } from '@/services/locationService';
import { useUserStore } from '@/stores/userStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore');

describe('locationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update user location successfully', async () => {
    const mockToken = 'mock-token';

    useUserStore.mockReturnValue({ token: mockToken });
    axios.put.mockResolvedValue({});

    await updateUserLocation(10, 20);

    expect(axios.put).toHaveBeenCalledWith(
      `${window.backendURL}/api/users/update-location`,
      { latitude: 10, longitude: 20 },
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('should start location tracking successfully', () => {
    const mockToken = 'mock-token';

    useUserStore.mockReturnValue({ token: mockToken });
    global.navigator.geolocation = {
      getCurrentPosition: vi.fn((success) => success({ coords: { latitude: 10, longitude: 20 } })),
    };

    startLocationTracking();

    expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });
});
