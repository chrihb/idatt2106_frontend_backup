import axios from "axios";

export const getAllAdmins = async () => {
    try {
        const response = await axios.get();

        const admins = await response.data;
        console.log('Fetched admins:', admins);

        if (response.status === 200 && Array.isArray(admins)) {
            return { success: true, admins };
        } else {
            return { error: 'Failed to fetch admins: Invalid response format from server.' };
        }
    } catch (error) {
        console.error('Error fetching admins:', error);

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
        console.error('Error adding admin:', error);

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
        const response = await axios.delete();

        if (response.status === 200) {
            return { success: true };
        } else {
            return { error: 'Failed to delete admin: Invalid response format from server.' };
        }
    } catch (error) {
        console.error('Error deleting admin:', error);

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
        console.error('Error sending password reset link:', error);

        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                return { error: 'Failed to send password reset link: Invalid request.' };
            }
            return { error: 'An error occurred. Please try again.' };
        }

        return { error: 'Network error. Please try again later.' };
    }
}