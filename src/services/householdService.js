import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import {useRouter} from "vue-router";

export const requestHouseholds = async (token) => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.get(`${window.backendURL}/api/households/myHouseholds`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            userStore.clearToken();
            await router.push('/login');
            return null
        }

        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error checking authentication:', error.code);
        userStore.clearToken();
        await router.push('/login');
    }
};
