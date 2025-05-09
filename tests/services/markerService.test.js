import { markerService } from '@/services/markerService';
import axios from 'axios';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('axios');

describe('markerService', () => {
  const service = markerService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all markers successfully', async () => {
    const mockResponse = { data: [{ markerId: 1, type: 'Hjertestarter' }] };

    axios.get.mockResolvedValue(mockResponse);

    const result = await service.getAllMarkers();

    expect(axios.get).toHaveBeenCalledWith(`${window.backendURL}/api/map/markers`, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockResponse.data);
  });
});
