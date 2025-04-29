import axios from "axios";
import { useUserStore} from "@/stores/userStore.js";
import { useRouter } from "vue-router";

export const requestAuthenticationCheck = async () => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        console.log("Sending Request...")
        const response = await axios.post(`${window.backendURL}/api/users/is-auth`, {},
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            }
        );


        console.log("Response data:", response.status);
        if (response.status === 404) {
            userStore.clearToken();
            await router.push('/login');
            return false;
        }

        console.log("Response data:", response.data);
        return response.data; // authenticated
    } catch (error) {
        console.error('Error checking authentication:', error);
        userStore.clearToken();
        await router.push('/login');
        return false;
    }
};
