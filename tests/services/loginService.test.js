import { requestLogin } from '@/services/loginService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/userStore', () => ({
    useUserStore: () => ({
        setCredentials: vi.fn(),
        setUserSettings: vi.fn(),
    }),
}));

describe('loginService', () => {
    const t = (key) => key; // Mock translation function

    it('should log in successfully', async () => {
        axios.post.mockResolvedValue({
            status: 200,
            data: { token: 'mock-token' },
        });

        const result = await requestLogin({ email: 'test@example.com', password: 'password' }, t);
        expect(result).toEqual({ success: true });
    });

    it('should handle invalid credentials error', async () => {
        axios.post.mockRejectedValue({ response: { status: 400 } });

        const result = await requestLogin({ email: 'test@example.com', password: 'wrong-password' }, t);
        expect(result).toEqual({ error: 'login-service.invalidCredentials' });
    });

    it('should handle network errors', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        const result = await requestLogin({ email: 'test@example.com', password: 'password' }, t);
        expect(result).toEqual({ error: 'Network error. Please try again later.' });
    });
});
