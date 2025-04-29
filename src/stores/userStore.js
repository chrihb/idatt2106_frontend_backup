import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        email: null,
    }),
    getters: {
        isAuthenticated() {
            return false;
        },
    },
    actions: {
        setCredentials(token, email) {
            this.token = token;
        },
        clearToken() {
            this.token = null;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
            },
        ],
    }
});
