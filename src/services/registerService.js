import { useUserStore } from '@/stores/userStore';
import { inject } from "vue";
import axios from 'axios';


export const requestRegister = async (registerForm, t) => {
    const userStore = useUserStore();

    try {
        const response = await axios.post(`${window.backendURL}/api/users/register`, registerForm, {
            headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;
        if (data.token) {
            userStore.setCredentials(data.token, registerForm.email, true, null);
            return { success: true };
        } else {
            return { success: true };
        }

        return { error: 'Unexpected response format.' };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                if (error.response.data === "Email already in use") {
                    return { error: t('register-service.emailInUse') };
                }
                if (error.response.data === "Phone number already in use") {
                    return { error: t('register-service.phoneInUse') };
                }
                if (error.response.data === "Failed to send verification email") {
                    return { error: t('register-service.failedToSendEmail') };
                }
                return { error: t('register-service.invalidData') };
            }
            return { error: t('register-service.error') };
        } else {
            console.error('Error submitting registration:', error);
            return { error: t('register-service.networkError') };
        }
    }
};
