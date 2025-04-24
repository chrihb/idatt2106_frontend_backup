import { useUserStore } from '@/stores/userStore';

const baseUrl = 'http://localhost:8088';

export const requestLogin = async (loginForm) => {
    const userStore = useUserStore();

    try {
        const response = await fetch(`${baseUrl}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginForm),
        });

        if (!response.ok) {
            if (response.status === 400) {
                return { error: 'Invalid credentials' };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        const data = await response.json();
        if (data.token) {
            userStore.setCredentials(data.token, loginForm.email);
            return { success: true };
        }

        return { error: 'Unexpected response format.' };
    } catch (error) {
        console.error('Error submitting login:', error);
        return { error: 'Network error. Please try again later.' };
    }
};
