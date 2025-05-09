import axios from 'axios';
import { requestHouseholds, joinHousehold, createHousehold } from '@/services/householdService';
import { useUserStore } from '@/stores/userStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore');

describe('householdService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should join a household successfully', async () => {
    const mockToken = 'mock-token';
    const mockInviteCode = 'invite123';
    const mockResponse = { status: 200 };

    useUserStore.mockReturnValue({ token: mockToken, setCredentials: vi.fn() });
    axios.post.mockResolvedValue(mockResponse);

    const result = await joinHousehold(mockInviteCode);

    expect(axios.post).toHaveBeenCalledWith(
      `${window.backendURL}/api/households/${mockInviteCode}/join`,
      {},
      { headers: { Authorization: `Bearer ${mockToken}` } }
    );
    expect(result).toEqual({ success: true });
  });

  it('should create a household successfully', async () => {
    const mockToken = 'mock-token';
    const mockResponse = { status: 201 };

    useUserStore.mockReturnValue({ token: mockToken, setCredentials: vi.fn() });
    axios.post.mockResolvedValue(mockResponse);

    const result = await createHousehold('Test Household', 10, 20);

    expect(axios.post).toHaveBeenCalledWith(
      `${window.backendURL}/api/households/create`,
      { name: 'Test Household', latitude: 10, longitude: 20 },
      { headers: { Authorization: `Bearer ${mockToken}` } }
    );
    expect(result).toEqual({ success: true });
  });
});
