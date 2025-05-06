import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import {useRouter} from "vue-router";

export const requestHouseholds = async () => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.get(`${window.backendURL}/api/households/myHouseholds`, {
            headers: {
                Authorization: `Bearer ${userStore.token}`
            }
        });

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            userStore.clearToken();
            await router.push('/login');
            return null;
        }

        console.log("Response data:", response.data);
        if (response.data && response.data.length > 0) {
            userStore.setCredentials({
                householdId: [response.data[0]],
            });
        } else {
            userStore.setCredentials({
                householdId: [],
            });
        }
        return response.data;
    } catch (error) {
        console.error('Error checking authentication:', error.code);
        userStore.clearToken();
        await router.push('/login');
    }
};

export const getInviteCode = async (id) => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.get(`${window.backendURL}/api/households/${id}/invite`,
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            }
        );

        console.log("Response status:", response.status);
        if (response.status !== 200) {
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
export const kickUserFromHousehold = async (householdId, userId) => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.delete(`${window.backendURL}/api/households/${householdId}/kick/${userId}`, {
            headers: {
                Authorization: `Bearer ${userStore.token}`
            }
        });

        if (response.status === 401) {
            return { error: "\t\nUser not authorized to kick this user from the household" };
        }

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            return null;
        }
        console.log("User kicked successfully:", response.data);
        // Update userStore.householdId[0].members
        if (userStore.householdId[0]) {
            const updatedMembers = userStore.householdId[0].members.filter(m => m.id !== userId);
            const updatedHousehold = { ...userStore.householdId[0], members: updatedMembers };
            userStore.setCredentials({
                householdId: [updatedHousehold],
            });
        }
        return response.data;
    } catch (error) {
        console.error('Error kicking user:', error.code);
        userStore.clearToken();
    }
};
export const leaveHouseholdService = async (householdId) => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.post(`${window.backendURL}/api/households/${householdId}/leave`, {}, {
            headers: {
                Authorization: `Bearer ${userStore.token}`
            }
        });

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            return null;
        }

        console.log("Left household successfully:", response.data);
        // Clear household data in userStore
        userStore.setCredentials({
            householdId: [],
        });
        return response.data;
    } catch (error) {
        console.error('Error leaving household:', error.code);
        userStore.clearToken();
    }
};
