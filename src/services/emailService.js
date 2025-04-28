import axios from "axios";

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${window.backendURL}/api/email/reset-password/`+email.email, {
            headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;

        if (response) {
            return { success: data };
        }

        return { error: 'Unexpected response format.' };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                return { error: 'Invalid email address' };
            }
            if (error.response.status === 404) {
                return { error: "User doesn't exist" };
            }
            return { error: 'An error occurred. Please try again.' };
        }
        console.error('Error submitting password reset:', error);
        return { error: 'Network error. Please try again later.' };
    }
}

export const requestEmailVerification = async (token) => {
    try {
        const response = await axios.put(`${window.backendURL}/api/users/verify/`+token, {
            headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;
        if (response) {
            return { success: data };
        }
        return { error: 'Unexpected response format.' };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                return { error: 'Token Invalid' };
            }
            if (error.response.status === 404) {
                return { error: "Not Found" };
            }
            return { error: 'An error occurred. Please try again.' };
        }
        console.error('Error submitting email verification:', error);
        return { error: 'Network error. Please try again later.' };
    }
}

export const executePasswordReset = async (token, password) => {
    try {
        const response = await axios.put(`${window.backendURL}/api/users/reset-password/`+token, {
            password
        });

        const data = response.data;
        if (response) {
            return { success: data };
        }
        return { error: 'Unexpected response format.' };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                return { error: 'Token Invalid' };
            }
            if (error.response.status === 404) {
                return { error: "Not Found" };
            }
            return { error: 'An error occurred. Please try again.' };
        }
        console.error('Error submitting password reset:', error);
        return { error: 'Network error. Please try again later.' };
    }

}