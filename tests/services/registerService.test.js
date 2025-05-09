import { requestRegister } from '@/services/registerService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

describe('registerService', () => {
    const t = (key) => key; // Mock translation function

    it('should register successfully', async () => {
        axios.post.mockResolvedValue({ status: 200 });

        const result = await requestRegister({ email: 'test@example.com' }, t);
        expect(result).toEqual({ success: true });
    });

    it('should handle email already in use error', async () => {
        axios.post.mockRejectedValue({
            response: { status: 400, data: 'Error: Email already in use' },
        });

        const result = await requestRegister({ email: 'test@example.com' }, t);
        expect(result).toEqual({ error: 'register-service.emailInUse' });
    });

    it('should handle network errors', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        const result = await requestRegister({ email: 'test@example.com' }, t);
        expect(result).toEqual({ error: 'register-service.networkError' });
    });
});
