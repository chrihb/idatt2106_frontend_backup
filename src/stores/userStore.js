import {defineStore} from 'pinia';
import {requestAuthenticationCheck} from "@/services/authenticationCheckService.js";
import {requestHouseholds} from "@/services/householdService.js";
import {removeAccountMarkers} from "@/utils/mapUtils.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        authenticated: false,
        householdId: [],
        userSettings: {
            showStorageStatusOnFrontpage: true,
            showHouseholdStatusOnFrontpage: true
        }
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
            console.log(householdId)
        }
        ,
        clearToken() {
            this.token = null;
            this.authenticated = false;
            this.householdId = [];
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
            if (!settings) {
                console.error("Invalid settings provided");
                return;
            }
            this.userSettings = settings;
        },
    },
    getters: {
        getHouseholdByName: (state) => (name) => {
            return state.householdId.find(h => h.name?.toLowerCase() === name.toLowerCase());
        },
        isLoggedIn: (state) => {
            return !!state.token && state.authenticated;
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
