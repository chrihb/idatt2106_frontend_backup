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
    try {
        const userStore = useUserStore();

        const response = await axios.put(
            `${window.backendURL}/api/admin/activate/${verificationToken}?newPassword=${password}`,
            {
                headers: {
                    Authorization: `Bearer ${userStore.adminToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200 && response.data === true) {
            return { success: true };
        } else {
            return { error: 'Failed to activate admin account: Invalid response from server.' };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: 'Failed to activate admin account: Invalid request or token.' };
            }
            if (error.response.status === 401) {
                return { error: 'Unauthorized: Invalid or missing token.' };
            }
            return { error: 'An error occurred. Please try again.' };
        }
        return { error: 'Network error. Please try again later.' };
    }
};

export const resetAdminPassword = async (verificationToken, password) => {
    try {
        const userStore = useUserStore();

        const response = await axios.put(
            `${window.backendURL}/api/admin/reset-password/${verificationToken}?newPassword=${password}`,
            {
                headers: {
                    Authorization: `Bearer ${userStore.adminToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200 && response.data === true) {
            return { success: true };
        } else {
            return { error: 'Failed to reset admin password: Invalid response from server.' };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: 'Failed to reset admin password: Invalid request or token.' };
            }
            if (error.response.status === 401) {
                return { error: 'Unauthorized: Invalid or missing token.' };
            }
            return { error: 'An error occurred. Please try again.' };
        }
        return { error: 'Network error. Please try again later.' };
    }
};
