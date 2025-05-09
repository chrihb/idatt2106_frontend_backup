import axios from "axios";
import { useUserStore} from "@/stores/userStore.js";
import { useRouter } from "vue-router";

export const requestAuthenticationCheck = async () => {
    const userStore = useUserStore();
    const router = useRouter();

    try {
        const response = await axios.post(`${window.backendURL}/api/users/is-auth`, {},
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`
                }
            }
        );


        if (response.status !== 200) {
            userStore.clearToken();
            await router.push('/login');
            return false;
        }

        return response.data; // authenticated
    } catch (error) {
        userStore.clearToken();
        await router.push('/login');
        return false;
    }
};
