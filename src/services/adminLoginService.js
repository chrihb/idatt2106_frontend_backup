import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import {requestHouseholds} from "@/services/householdService.js";
import { getUserSettings } from './userSettingsService';

export const requestLogin = async (loginForm, t) => {
    const userStore = useUserStore();

    try {
        const response = await axios.post(`${window.backendURL}/api/admin/login`, loginForm, {
            headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;
        console.log('Login response:', data);

        switch (response.status) {
            case 200:
                if (data) {

                    userStore.setCredentials({ token: data, authenticated: true, isAdmin: true });

                    const households = await requestHouseholds();

                    userStore.setCredentials({ householdId: households });

                    const settings = await getUserSettings();

                    userStore.setUserSettings(settings);

                    return { success: true };
                }
                break;
            case 400:
                return { error: t('login-service.twoFactor') };
            case 404:
                return { error: t('login-service.invalidAdminCredentials') };
            case 500:
                return { error: t('login-service.serverError') };
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
