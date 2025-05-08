import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { getAddress } from '@/utils/addressTranslationUtil.js';

const mapAddress = async (objects, { brief }) => {
    for (const obj of objects) {
        if (obj.latitude && obj.longitude) {
            obj.address = await getAddress(obj.latitude, obj.longitude, { brief });
        } else {
            obj.address = "Unknown";
        }
    }
};

export const requestHouseholds = async () => {
    const userStore = useUserStore();
    try {
        const response = await axios.get(`${window.backendURL}/api/households/myHouseholds`, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.status !== 200) return [];

        await mapAddress(response.data, { brief: false });
        for (const household of response.data) {
            if (household.members) {
                await mapAddress(household.members, { brief: true });
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching households:', error);
        return [];
    }
};

export const joinHousehold = async (inviteCode) => {
    const userStore = useUserStore();
    try {
        const response = await axios.post(`${window.backendURL}/api/households/${inviteCode}/join`, {}, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.status !== 200) return null;

        const households = await requestHouseholds();
        userStore.setCredentials({ householdId: households });
        return { success: true };
    } catch (error) {
        console.error('Error joining household:', error);
        return { success: false };
    }
};

export const createHousehold = async (name, lat, lon) => {
    const userStore = useUserStore();
    try {
        const response = await axios.post(`${window.backendURL}/api/households/create`, {
            name, latitude: lat, longitude: lon
        }, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.status !== 201) return null;

        const households = await requestHouseholds();
        userStore.setCredentials({ householdId: households });
        return { success: true };
    } catch (error) {
        console.error('Error creating household:', error);
        return null;
    }
};

export const getInviteCode = async (id) => {
    const userStore = useUserStore();
    try {
        const response = await axios.get(`${window.backendURL}/api/households/${id}/invite`, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.status !== 200) return null;
        return response.data;
    } catch (error) {
        console.error('Error getting invite code:', error);
        return null;
    }
};

export const kickUserFromHousehold = async (householdId, userId) => {
    const userStore = useUserStore();
    try {
        const response = await axios.delete(`${window.backendURL}/api/households/${householdId}/kick/${userId}`, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.status === 401) {
            return { error: 'User not authorized to kick this user from the household' };
        }
        if (response.status !== 200) return null;

        // Update local store
        if (userStore.householdId[0]) {
            const updatedMembers = userStore.householdId[0].members.filter(m => m.id !== userId);
            const updatedHousehold = { ...userStore.householdId[0], members: updatedMembers };
            userStore.setCredentials({ householdId: [updatedHousehold] });
        }
        return response.data;
    } catch (error) {
        console.error('Error kicking user:', error);
        return null;
    }
};

export const leaveHouseholdService = async (householdId) => {
    const userStore = useUserStore();
    try {
        const response = await axios.delete(`${window.backendURL}/api/households/${householdId}/leave`, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.status !== 200) return null;

        userStore.setCredentials({ householdId: [] });
        return response.data;
    } catch (error) {
        console.error('Error leaving household:', error);
        return null;
    }
};

export const verifyIsAdmin = async (householdId) => {
    const userStore = useUserStore();
    try {
        const response = await axios.get(`${window.backendURL}/api/households/${householdId}/isAdmin`, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.status !== 200) return null;
        return response.data;
    } catch (error) {
        console.error('Error verifying admin status:', error);
        return null;
    }
};

export const setPrimaryHousehold = async (householdId) => {
    const userStore = useUserStore();
    try {
        const response = await axios.put(`${window.backendURL}/api/households/setPrimary/${householdId}`, {}, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error setting primary household:', error);
        return null;
    }
};

export const getPrimaryHousehold = async () => {
    const userStore = useUserStore();
    try {
        const response = await axios.get(`${window.backendURL}/api/households/getPrimary`, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });
        return response.status === 200 ? response.data : null;
    } catch (error) {
        console.error('Error fetching primary household:', error);
        return null;
    }
};
