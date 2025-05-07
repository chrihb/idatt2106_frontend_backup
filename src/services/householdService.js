import axios from 'axios';
import {useUserStore} from '@/stores/userStore';
import {useRouter} from "vue-router";
import {getAddress} from "@/utils/addressTranslationUtil.js";



const mapAddress = async (objects, { brief }) => {
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (object.latitude && object.longitude) {
            if (brief) object.address = await getAddress(object.latitude, object.longitude, { brief: true });
            else object.address = await getAddress(object.latitude, object.longitude, { brief: false });
        } else {
            object.address = "Unknown";
        }
    }
}

/**
 * Requests the user's households from the backend.
 * @returns {Promise<any|null>} - The list of households or null if an error occurred.
 */
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
            return []
        }

        console.log("Response data:", response.data);

        await mapAddress(response.data, { brief: false });
        for (const household of response.data) {
            if (household.members) {
                await mapAddress(household.members, { brief: true });
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error:', error.code);
    }
};

export const joinHousehold = async (inviteCode) => {
    const userStore = useUserStore();

    try {
        const response = await axios.post(`${window.backendURL}/api/households/${inviteCode}/join`, {},
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            }
        );

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            console.log("Join household failed");
            return null
            userStore.clearToken();
            await router.push('/login');
            return null;
        }

        console.log("Response data:", response.data);
        const households = await requestHouseholds();
        console.log("Households after joining:", households);
        userStore.setCredentials({ householdId: households });
        return {success: true};
    } catch (error) {
        console.error('Error checking authentication:', error.code);
        return {success: false};
    }
};

export const createHousehold = async (name, lat, lon) => {
    const userStore = useUserStore();

    console.log(name, lat, lon);

    try {
        const response = await axios.post(`${window.backendURL}/api/households/create`,
            {
                name: name,
                latitude: lat,
                longitude: lon
            },
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            }
        );

        console.log("Response status:", response.status);
        if (response.status !== 201) {
            console.log("Create household failed");
            return null
        }

        console.log("Response data:", response.data);
        const households = await requestHouseholds();
        console.log("Households after joining:", households);
        userStore.setCredentials({ householdId: households });
        return {success: true};
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

/**
 * Requests the household details from the backend.
 * @param id - The ID of the household to fetch.
 * @returns {Promise<any|null>} - The household details or null if an error occurred.
 */
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
/**
 * Removes a user from a household.
 * @param householdId The ID of the household from which to remove the user.
 * @param userId The ID of the user to remove.
 * @returns {Promise<{error: string}|any|null>} - The response data or an error object if an error occurred.
 */
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
            return {error: "\t\nUser not authorized to kick this user from the household"};
        }

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            return null;
        }
        console.log("User kicked successfully:", response.data);
        // Update userStore.householdId[0].members
        if (userStore.householdId[0]) {
            const updatedMembers = userStore.householdId[0].members.filter(m => m.id !== userId);
            const updatedHousehold = {...userStore.householdId[0], members: updatedMembers};
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
/**
 * Leaves a household.
 * @param householdId The ID of the household to leave.
 * @returns {Promise<any|null>} - The response data or null if an error occurred.
 */
export const leaveHouseholdService = async (householdId) => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.delete(`${window.backendURL}/api/households/${householdId}/leave`, {
            headers: {
                Authorization: `Bearer ${userStore.token}`
            }
        });

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            return null;
        }

        console.log("Left household successfully:", response.data);
        userStore.setCredentials({
            householdId: [],
        });
        return response.data;
    } catch (error) {
        console.error('Error leaving household:', error.code);
        await router.push('/login');
        return null;
    }
};

/**
 * Verifies if the user is an admin of the household.
 * @param householdId The ID of the household to check.
 * @returns {Promise<any|null>} - The response data or null if an error occurred.
 */
export const verifyIsAdmin = async (householdId) => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.get(`${window.backendURL}/api/households/${householdId}/isAdmin`, {
            headers: {
                Authorization: `Bearer ${userStore.token}`
            }
        });

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            return null;
        }

        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error verifying admin status:', error.code);
        userStore.clearToken();
        await router.push('/login');
        return null;
    }
};
