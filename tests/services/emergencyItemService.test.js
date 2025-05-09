import { emergencyItemService } from '@/services/emergencyItemService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore', () => ({
    useUserStore: () => ({
        token: 'mock-token',
    }),
}));

describe('emergencyItemService', () => {
    const service = emergencyItemService();

    it('should fetch emergency items for a household', async () => {
        axios.create.mockReturnValue({
            get: vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Item 1' }] }),
        });

        const items = await service.getEmergencyItems(1);
        expect(items).toEqual([{ id: 1, name: 'Item 1' }]);
    });

    it('should throw an error if no token is found', () => {
        vi.mocked(axios.create).mockImplementation(() => {
            throw new Error('No token found');
        });

        expect(() => service.getEmergencyItems(1)).rejects.toThrow('Failed to fetch emergency items');
    });

    it('should fetch emergency item categories', async () => {
        axios.create.mockReturnValue({
            get: vi.fn().mockResolvedValue({ data: ['Category 1', 'Category 2'] }),
        });

        const categories = await service.getEmergencyItemCategories();
        expect(categories).toEqual(['Category 1', 'Category 2']);
    });

    // ...additional tests for other methods...
});
