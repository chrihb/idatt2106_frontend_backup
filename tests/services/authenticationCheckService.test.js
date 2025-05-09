import { requestAuthenticationCheck } from '@/services/authenticationCheckService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore', () => ({
    useUserStore: () => ({
        token: 'mock-token',
        clearToken: vi.fn(),
    }),
}));
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

describe('authenticationCheckService', () => {
    it('should return true if authenticated', async () => {
        axios.post.mockResolvedValue({ status: 200, data: true });

        const result = await requestAuthenticationCheck();
        expect(result).toBe(true);
    });

    it('should redirect to login if not authenticated', async () => {
        axios.post.mockRejectedValue({ response: { status: 401 } });

        const result = await requestAuthenticationCheck();
        expect(result).toBe(false);
    });
});
