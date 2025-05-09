import axios from 'axios';
import { getEssentialItems } from '@/services/essentialItemService';
import { useUserStore } from '@/stores/userStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore');

describe('essentialItemService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch essential items successfully', async () => {
    const mockToken = 'mock-token';
    const mockHouseholdId = '123';
    const mockResponse = { data: [{ name: 'Water', present: true }] };

    useUserStore.mockReturnValue({ token: mockToken });
    axios.get.mockResolvedValue(mockResponse);

    const result = await getEssentialItems(mockHouseholdId);

    expect(axios.get).toHaveBeenCalledWith(
      `${window.backendURL}/api/households/essential-items/${mockHouseholdId}`,
      {
        headers: { Authorization: `Bearer ${mockToken}` },
        params: { householdId: mockHouseholdId },
      }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle errors gracefully', async () => {
    useUserStore.mockReturnValue({ token: 'mock-token' });
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(getEssentialItems('123')).rejects.toThrow('Network Error');
  });
});
