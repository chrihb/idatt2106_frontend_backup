import {defineStore} from "pinia";


export const emergencyZoneStore = defineStore('emergencyZone', {
    state: () => ({
        emergencyZone: {
            zoneId: null,
            name: '',
            address: '',
            lat: 0,
            lng: 0,
            type: '',
            level: 0,
            description: '',
            geojson: {
                type: 'Polygon',
                coordinates: []
            },
        }
    }),
    getters: {
        getEmergencyZone: (state) => {
            return state.emergencyZone;
        },
        getEmergencyZoneId: (state) => {
            return state.emergencyZone.zoneId;
        },
    },
    actions: {
        fetchRestOfEmergencyZone(zoneId) {
            // Fetch the rest of the emergency zone data from the API
        },

        setBasicEmergencyZone(emergencyZoneData) {
            this.emergencyZone = {
                ...this.emergencyZone,
                zoneId: emergencyZoneData.zoneId,
                lat: emergencyZoneData.lat,
                lng: emergencyZoneData.lng,
                type: emergencyZoneData.type,
                level: emergencyZoneData.level,
                geojson: {
                    type: 'Polygon',
                    coordinates: emergencyZoneData.geojson.coordinates,
                },
            };
        },

        setRestOfEmergencyZone(emergencyZoneData) {
            this.emergencyZone = {
                ...this.emergencyZone,
                name: emergencyZoneData.name,
                address: emergencyZoneData.address,
                description: emergencyZoneData.description,
            };
        },

        setEmergencyZone(emergencyZoneData) {
            this.emergencyZone = {
                zoneId: emergencyZoneData.zoneId,
                name: emergencyZoneData.name,
                address: emergencyZoneData.address,
                lat: emergencyZoneData.lat,
                lng: emergencyZoneData.lng,
                type: emergencyZoneData.type,
                level: emergencyZoneData.level,
                description: emergencyZoneData.description,
                geojson: {
                    type: 'Polygon',
                    coordinates: emergencyZoneData.geojson.coordinates,
                },
            };
        },

        async saveEmergencyZone() {
            // Save the emergency zone data to the API
        },

        async deleteEmergencyZone() {
            // Delete the emergency zone from the API
        },

        clearEmergencyZone() {
            this.emergencyZone = {
                zoneId: null,
                name: '',
                address: '',
                lat: 0,
                lng: 0,
                type: '',
                level: 0,
                description: '',
                geojson: {
                    type: 'Polygon',
                    coordinates: []
                },
            };
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
            },
        ],
    },
})