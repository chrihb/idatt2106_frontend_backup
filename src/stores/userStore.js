import {defineStore} from 'pinia';
import {requestAuthenticationCheck} from "@/services/authenticationCheckService.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        email: null,
        authenticated: false,
    }),
    actions: {
        async isAuthenticated() {
            console.log("checking...");
            if (!this.token) {
                console.log("no token");
                this.authenticated = false;
                return false;
            }
            this.authenticated = await requestAuthenticationCheck();
        },
        setCredentials(token, email) {
            this.token = token;
            this.email = email;
        },
        clearToken() {
            this.token = null;
            this.email = null;
            this.authenticated = false;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: sessionStorage,
            },
        ],
    }
});
