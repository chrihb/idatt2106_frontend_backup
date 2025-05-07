import axios from 'axios';
import {useUserStore} from '@/stores/userStore';
import {useRouter} from "vue-router";
import {getAddress} from "@/utils/addressTranslationUtil.js";



const mapAddress = async (objects) => {
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (object.latitude && object.longitude) {
            object.address = await getAddress(object.latitude, object.longitude);
        } else {
            object.address = "Unknown";
        }
    }
}

export const requestHouseholds = async () => {
    const userStore = useUserStore();

    try {
        const response = await axios.get(`${window.backendURL}/api/households/myHouseholds`,
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            }
        );

        console.log("Response status:", response.status);
        if (response.status !== 200) {
            return []
        }

        console.log("Response data:", response.data);

        await mapAddress(response.data);
        for (const household of response.data) {
            if (household.members) {
                await mapAddress(household.members);
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
    } catch (error) {
        console.error('Error checking authentication:', error.code);
        return {success: false};
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
}
