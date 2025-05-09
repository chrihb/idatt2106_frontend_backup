import { emergencyZoneService } from '@/services/emergencyZoneService';

describe('emergencyZoneService', () => {
  const service = emergencyZoneService();

  it('should return mock emergency zones', async () => {
    const mockMapAreaData = {};
    const mockZoneIds = [10];
    const result = await service.getEmergencyZonesMock(mockMapAreaData, mockZoneIds);

    expect(result.success).toBe(true);
    expect(result.zones.length).toBeGreaterThan(0);
  });

  it('should return mock emergency zone details', async () => {
    const mockZoneId = 10;
    const result = await service.getEmergencyZoneDetailsMock(mockZoneId);

    expect(result.success).toBe(true);
    expect(result.name).toBe('Test Zone');
  });
});
