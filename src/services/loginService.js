import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import {requestHouseholds} from "@/services/householdService.js";
import { getUserSettings } from './userSettingsService';
import {initAccountMarkers} from "@/utils/mapUtils.js";

export const requestLogin = async (loginForm, t) => {
    const userStore = useUserStore();

    try {
        const response = await axios.post(`${window.backendURL}/api/users/login`, loginForm, {
            headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;

        if (response.status === 200 && data.token) {

            userStore.setCredentials({ token: data.token, authenticated: true });

            const households = await requestHouseholds();

            userStore.setCredentials({ householdId: households });

            const settings = await getUserSettings();

            userStore.setUserSettings(settings);

            return { success: true };
        } else {
            return { error: 'Login failed: Invalid response format from server.' };
        }
    } catch (error) {

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
