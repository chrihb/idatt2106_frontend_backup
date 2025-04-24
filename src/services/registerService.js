import { useUserStore } from '@/stores/userStore';

const baseUrl = 'http://localhost:8088';

export const requestRegister = async (registerForm) => {
    const userStore = useUserStore();

    try {
        const response = await fetch(`${baseUrl}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerForm),
        });

        if (!response.ok) {
            if (response.status === 400) {
                return { error: 'Invalid registration data' };
            }
            if (response.status === 409) {
                return { error: 'Email already registered' };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        const data = await response.json();
        if (data.token) {
            userStore.setCredentials(data.token, registerForm.email);
            return { success: true };
        }

        return { error: 'Unexpected response format.' };
    } catch (error) {
        console.error('Error submitting registration:', error);
        return { error: 'Network error. Please try again later.' };
    }
};
