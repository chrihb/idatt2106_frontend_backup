import {defineStore} from 'pinia';
import {requestAuthenticationCheck} from "@/services/authenticationCheckService.js";
import {requestHouseholds} from "@/services/householdService.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        authenticated: false,
        householdId: [],
        userSettings: {
            showStorageStatusOnFrontpage: true,
            showHouseholdStatusOnFrontpage: true
        },
        isAdmin: false,
        adminToken: null
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
        setCredentials({ token, authenticated, householdId, adminToken = null, isAdmin = false } = {}) {
            if (token !== undefined) this.token = token;
            if (authenticated !== undefined) this.authenticated = authenticated;
            if (householdId !== undefined) this.householdId = householdId;
            if (isAdmin !== undefined) this.isAdmin = isAdmin;
            if (adminToken !== undefined) this.adminToken = adminToken;
            console.log("token: ", this.token);
            console.log("is auth: ", this.authenticated);
            console.log("is admin: ", this.isAdmin);
            console.log("householdId: ", this.householdId);
            console.log(householdId)
        }
        ,
        clearToken() {
            this.token = null;
            this.authenticated = false;
            this.householdId = [];
            this.isAdmin = false;
            this.adminToken = null;
        },
        clearHouseholdId() {
            this.householdId = [];
        },
        async fetchHouseholds() {
            try {
                const households = await requestHouseholds();
                this.setCredentials({ householdId: households });
            } catch (error) {
                console.error("Error fetching households:", error);
            }
        },

        setUserSettings(settings) {
            this.userSettings = settings;
        },
    },
    getters: {
        getHouseholdByName: (state) => (name) => {
            return state.householdId.find(h => h.name?.toLowerCase() === name.toLowerCase());
        }
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
