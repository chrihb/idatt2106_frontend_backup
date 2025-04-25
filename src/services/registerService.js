import { useUserStore } from '@/stores/userStore';
import { inject } from "vue";
import axios from 'axios';

const baseUrl = inject("backendURL");

export const requestRegister = async (registerForm) => {
    const userStore = useUserStore();

    try {
        const response = await axios.post(`${baseUrl}/user/register`, registerForm, {
            headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;
        if (data.token) {
            userStore.setCredentials(data.token, registerForm.email);
            return { success: true };
        }

        return { error: 'Unexpected response format.' };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                return { error: 'Invalid registration data' };
            }
            if (error.response.status === 409) {
                return { error: 'Email already registered' };
            }
            return { error: 'An error occurred. Please try again.' };
        } else {
            console.error('Error submitting registration:', error);
            return { error: 'Network error. Please try again later.' };
        }
    }
};
