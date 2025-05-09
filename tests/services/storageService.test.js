import { getPreparednessStatus } from '@/services/storageService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore', () => ({
    useUserStore: () => ({
        token: 'mock-token',
    }),
}));

describe('storageService', () => {
    it('should fetch preparedness status successfully', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, householdName: 'Household 1', daysOfFood: 7, daysOfWater: 5 },
            ],
        });

        const result = await getPreparednessStatus();
        expect(result).toEqual([
            { id: 1, householdName: 'Household 1', daysOfFood: 7, daysOfWater: 5 },
        ]);
    });

    it('should throw an error if the request fails', async () => {
        axios.get.mockRejectedValue(new Error('Request failed'));

        await expect(getPreparednessStatus()).rejects.toThrow('Request failed');
    });
});
