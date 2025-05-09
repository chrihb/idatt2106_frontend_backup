import { watchUserPosition } from '@/services/geoLocationService';
import { vi, describe, it, expect } from 'vitest';

describe('geoLocationService', () => {
  it('should call onSuccess when geolocation is available', () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    global.navigator.geolocation = {
      watchPosition: vi.fn((success) => success({ coords: { latitude: 0, longitude: 0 } })),
    };

    watchUserPosition(mockOnSuccess, mockOnError);

    expect(global.navigator.geolocation.watchPosition).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalledWith({ coords: { latitude: 0, longitude: 0 } });
  });
});
