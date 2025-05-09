import axios from 'axios';
import {useUserStore} from '@/stores/userStore';
import {requestHouseholds} from "@/services/householdService.js";
import {getUserSettings} from './userSettingsService';

export const requestLogin = async (loginForm, t) => {
    const userStore = useUserStore();
    let adminUsername = "";
    let adminPassword = "";

    try {
        adminUsername = loginForm.username;
        adminPassword = loginForm.password;

        const tokenResponse = await axios.post(
            `${window.backendURL}/api/admin/2fa`,
            { email: loginForm.email },
            { headers: {'Content-Type': 'application/json'} }
        );

        const loginResponse = await axios.post(`${window.backendURL}/api/admin/login`, loginForm, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenResponse.data}`
            },
        });

        const data = loginResponse.data;

        switch (loginResponse.status) {
            case 200:
                if (data) {
                    userStore.setCredentials({ adminToken: data, isAdmin: true });

                    return { success: true };
                }
                break;
            case 400:
                return {error: t('login-service.invalidAdminData')};
            case 404:
                return { error: t('login-service.invalidAdminCredentials') };
            case 500:
                return { error: t('login-service.serverError') };
            default:
                return { error: t('login-service.unknownError') };
        }

        return { error: 'Login failed: Invalid response format from server.' };
    } catch (error) {
        console.error('Error submitting login:', error);

        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: t('login-service.invalidCredentials') };
            }
            if (error.response.status === 406) {
                return { error: t('login-service.emailNotVerified') };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        return { error: 'Network error. Please try again later.' };
    }
};