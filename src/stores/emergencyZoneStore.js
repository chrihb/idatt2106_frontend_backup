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
                description: emergencyZoneData.description,
                geojson: {
                    type: 'Polygon',
                    coordinates: emergencyZoneData.geojson.coordinates,
                },
            };
        },

        clearEmergencyZone() {
            this.emergencyZone = {
                zoneId: null,
                name: '',
                address: '',
                lat: 0,
                lng: 0,
                type: '',
                description: '',
                geojson: {
                    type: 'Polygon',
                    coordinates: {}
                },
            };
        },
    }
})