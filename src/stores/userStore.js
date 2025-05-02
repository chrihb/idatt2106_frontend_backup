import {defineStore} from 'pinia';
import {requestAuthenticationCheck} from "@/services/authenticationCheckService.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        email: null,
        authenticated: false,
        householdId: null,
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
        setCredentials(token, email, authenticated, householdId) {
            this.token = token;
            this.email = email;
            this.authenticated = authenticated;
            this.householdId = householdId;
        },
        clearToken() {
            this.token = null;
            this.email = null;
            this.authenticated = false;
            this.householdId = null;
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
