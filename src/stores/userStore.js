import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        username: null,
    }),
    getters: {
        isAuthenticated() {
           // return !!this.token;
            return false;
        },
    },
    actions: {
        setToken(newToken) {
            this.token = newToken;
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
