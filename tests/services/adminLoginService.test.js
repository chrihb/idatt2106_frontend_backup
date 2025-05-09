import { request2FA, requestLogin } from '@/services/adminLoginService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore', () => ({
    useUserStore: () => ({
        setCredentials: vi.fn(),
    }),
}));

describe('adminLoginService', () => {
    it('should request 2FA successfully', async () => {
        axios.post.mockResolvedValue({ data: { success: true } });

        const response = await request2FA({ email: 'admin@example.com' }, vi.fn());
        expect(response).toEqual({ success: true });
    });

    it('should log in successfully', async () => {
        axios.post.mockResolvedValue({ status: 200, data: 'mock-token' });

        const response = await requestLogin({ email: 'admin@example.com', password: 'password' }, vi.fn());
        expect(response).toEqual({ success: true });
    });

    // ...additional tests for error handling...
});
