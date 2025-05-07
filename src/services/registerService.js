import { useUserStore } from '@/stores/userStore';
import { inject } from "vue";
import axios from 'axios';


export const requestRegister = async (registerForm, t) => {

    try {
        const response = await axios.post(`${window.backendURL}/api/users/register`, registerForm, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            return { success: true };
        } else {
            return { error: 'Unexpected response format' };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                if (error.response.data === "Error: Email already in use") {
                    return { error: t('register-service.emailInUse') };
                }
                if (error.response.data === "Error: Phone number already in use") {
                    return { error: t('register-service.phoneInUse') };
                }
                if (error.response.data === "Error: Failed to send verification email") {
                    return { error: t('register-service.failedToSendEmail') };
                }
                if (error.response.data === "Error: An error occurred during registration") {
                    return { error: "An error occurred during registration" };
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
