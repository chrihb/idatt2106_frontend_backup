import { requestPasswordReset, requestEmailVerification, executePasswordReset } from '@/services/emailService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

describe('emailService', () => {
    it('should request password reset', async () => {
        axios.post.mockResolvedValue({ data: 'Password reset email sent' });

        const response = await requestPasswordReset({ email: 'test@example.com' });
        expect(response).toEqual({ success: 'Password reset email sent' });
    });

    it('should handle invalid email error during password reset', async () => {
        axios.post.mockRejectedValue({ response: { status: 400 } });

        const response = await requestPasswordReset({ email: 'invalid@example.com' });
        expect(response).toEqual({ error: 'Invalid email address' });
    });

    it('should verify email with a token', async () => {
        axios.put.mockResolvedValue({ data: 'Email verified' });

        const response = await requestEmailVerification('mock-token');
        expect(response).toEqual({ success: 'Email verified' });
    });

    // ...additional tests for executePasswordReset...
});
