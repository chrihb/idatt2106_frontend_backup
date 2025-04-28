import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { inject } from 'vue';

const baseUrl = inject("backendURL");

export const requestLogin = async (loginForm) => {
    const userStore = useUserStore();

    try {
        const response = await axios.post(`${baseUrl}/user/login`, loginForm, {
            headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;
        if (data.token) {
            userStore.setCredentials(data.token, loginForm.email);
            return { success: true };
        }

        return { error: 'Unexpected response format.' };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                return { error: 'Invalid password' };
            }
            return { error: 'An error occurred. Please try again.' };
        }   else if (error.response.status === 404) {
            return { error: 'User does not exist' };
        }
        console.error('Error submitting login:', error);
        return { error: 'Network error. Please try again later.' };
    }
};
