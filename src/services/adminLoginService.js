import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

export const request2FA = async (email) => {
    try {
        const response = await axios.post(
            `${window.backendURL}/api/admin/2fa`,
            { email },
            { headers: { 'Content-Type': 'application/json' } }
        );

        return {
            success: true,
            ...response.data
        };
    } catch (error) {
        console.error('Error requesting 2FA:', error);

        if (error.response) {
            return {
                success: false,
                error: error.response.data?.error || 'Failed to send 2FA code'
            };
        }

        return {
            success: false,
            error: 'Network error. Please check your connection and try again.'
        };
    }
};

export const requestLogin = async (loginForm, t) => {
    const userStore = useUserStore();

    try {
        const loginResponse = await axios.post(
            `${window.backendURL}/api/admin/login`,
            loginForm,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = loginResponse.data;

        if (loginResponse.status === 200 && data) {
            userStore.setCredentials({ adminToken: data, isAdmin: true });
            return { success: true };
        }

        return {
            success: false,
            error: 'Login failed: Invalid response format from server.'
        };
    } catch (error) {
        console.error('Error submitting login:', error);

        if (error.response) {
            switch (error.response.status) {
                case 400:
                    return {
                        success: false,
                        error: t('login-service.invalidAdminData')
                    };
                case 404:
                    return {
                        success: false,
                        error: t('login-service.invalidAdminCredentials')
                    };
                case 406:
                    return {
                        success: false,
                        error: t('login-service.emailNotVerified')
                    };
                case 500:
                    return {
                        success: false,
                        error: t('login-service.serverError')
                    };
                default:
                    return {
                        success: false,
                        error: t('login-service.unknownError')
                    };
            }
        }

        return {
            success: false,
            error: 'Network error. Please try again later.'
        };
    }
};