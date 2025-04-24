import {defineStore} from 'pinia';

export const useMapStore = defineStore('mapStore', {
    state: () => ({
        latitude: 0,
        longitude: 0,
        canTrack: false,
    }),
    getters: {
        getLatitude: (state) => state.latitude,
        getLongitude: (state) => state.longitude,
    },
    actions: {
        setCoordinates(latitude, longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        },
        toggleTracking() {
            this.canTrack = !this.canTrack;
        }
    },
});