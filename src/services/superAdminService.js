import axios from "axios";
import { useUserStore } from "@/stores/userStore";
export const getAllAdmins = async () => {
    try {
        const userStore = useUserStore();

        const response = await axios.get(`${window.backendURL}/api/admin`, {
            headers: {
                Authorization: `Bearer ${userStore.adminToken}`
            }
        });

        if (response.status === 200 && Array.isArray(response.data)) {
            return { success: true, data: response.data };
        } else {
            return { error: 'Failed to fetch admins: Invalid response format from server.' };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: 'Failed to fetch admins: Invalid request.' };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        return { error: 'Network error. Please try again later.' };
    }
}

export const addAdministrator = async (email) => {
    try {
        const response = await axios.post();

        if (response.status === 200) {
            return { success: true };
        } else {
            return { error: 'Failed to add admin: Invalid response format from server.' };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: 'Failed to add admin: Invalid request.' };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        return { error: 'Network error. Please try again later.' };
    }
}

export const deleteAdministrator = async (adminId) => {
    try {
        const userStore = useUserStore();

        const response = await axios.delete(`${window.backendURL}/api/admin/delete/${adminId}`, {
            headers: {
                Authorization: `Bearer ${userStore.adminToken}`
            }
        });

        if (response.status === 200 || response.status === 204) {
            return { success: true };
        } else {
            return { error: 'Failed to delete admin: Invalid response format from server.' };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: 'Failed to delete admin: Invalid request.' };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        return { error: 'Network error. Please try again later.' };
    }
}

export const passwordResetLinkToAdministrator = async (adminId) => {
    try {
        const response = await axios.post();

        if (response.status === 200) {
            return { success: true };
        } else {
            return { error: 'Failed to send password reset link: Invalid response format from server.' };
        }
    } catch (error) {

        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: 'Failed to send password reset link: Invalid request.' };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        return { error: 'Network error. Please try again later.' };
    }
}
