import { markerService } from '@/services/markerService';
import axios from 'axios';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('axios');

describe('markerService', () => {
  const service = markerService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return mock markers', async () => {
    const mockMapAreaData = {};
    const mockMapItemIds = [1];
    const result = await service.getMarkersMock(mockMapAreaData, mockMapItemIds);

    expect(result.success).toBe(true);
    expect(result.markers.length).toBeGreaterThan(0);
  });

  it('should return mock marker details', async () => {
    const mockMarkerId = 1;
    const result = await service.getMarkerDetailsMock(mockMarkerId);

    expect(result.success).toBe(true);
    expect(result.name).toBe('Test Marker 1');
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

  it('should create a marker successfully', async () => {
    const mockMarkerData = { lat: 10, lng: 20, type: 'Test' };
    const mockResponse = { data: { success: true } };

    axios.post.mockResolvedValue(mockResponse);

    const result = await service.createMarker(mockMarkerData);

    expect(axios.post).toHaveBeenCalledWith(
      `${window.backendURL}/api/map/markers/create`,
      { markerData: mockMarkerData },
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(result).toEqual(mockResponse.data);
  });
});
