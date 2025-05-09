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
        },
        isAdmin: false,
        adminToken: null
    }),
    actions: {
        async isAuthenticated() {

            if (!this.token) {

                this.authenticated = false;
                return false;
            }
            this.authenticated = await requestAuthenticationCheck();
        },
        setCredentials({ token, authenticated, householdId, adminToken, isAdmin } = {}) {
            if (token !== undefined) this.token = token;
            if (authenticated !== undefined) this.authenticated = authenticated;
            if (householdId !== undefined) this.householdId = householdId;
            if (isAdmin !== undefined) this.isAdmin = isAdmin;
            if (adminToken !== undefined) this.adminToken = adminToken;
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
            }
        },

        setUserSettings(settings) {
            if (!settings) {
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
