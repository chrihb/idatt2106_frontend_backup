import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        username: null,
    }),
    getters: {
        isAuthenticated() {
            return this.token;
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
