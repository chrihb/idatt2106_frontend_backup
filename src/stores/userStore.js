import {defineStore} from 'pinia';
import {requestAuthenticationCheck} from "@/services/authenticationCheckService.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        authenticated: false,
        householdId: [],
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
        setCredentials({ token, authenticated, householdId } = {}) {
            if (token !== undefined) this.token = token;
            if (authenticated !== undefined) this.authenticated = authenticated;
            if (householdId !== undefined) this.householdId = householdId;
        }
        ,
        clearToken() {
            this.token = null;
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
