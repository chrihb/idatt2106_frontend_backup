import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

export const request2FA = async (loginForm, t) => {
    try {
        const response = await axios.post(
            `${window.backendURL}/api/admin/2fa`,
            { username: loginForm.username },
            { headers: { 'Content-Type': 'application/json' } }
        );

        return {
            success: true,
            ...response.data
        };
    } catch (error) {
        try {
            await requestLogin(loginForm, t);
            return {
                success: true,
                loggedIn: true,
            };
        } catch (error) {}

        console.error('Error requesting 2FA:', error);

        return {
            success: false,
            error: t('login.twoFactorError')
        };

        return {
            success: false,
            error: t('login.networkError')
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
            error: t('login.failed')
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
            error: t('login.networkError')
        };
    }
};

export const setAdminPassword = async (verificationToken, password) => {

}
