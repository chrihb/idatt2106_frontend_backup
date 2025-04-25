import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        showStorage: false,
        showHousehold: false,
    }),
    actions: {
        toggleShowStorage() {
            this.showStorage = !this.showStorage;
        },
        toggleShowHousehold() {
            this.showHousehold = !this.showHousehold;
        }
    }
});
