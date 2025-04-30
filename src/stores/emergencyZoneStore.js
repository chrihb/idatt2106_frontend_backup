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
            coordinates: [],
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
        fetchDetailsOfEmergencyZone(zoneId) {
            this.error = null;

            try {
                const service = emergencyZoneService();
                //TODO: This is a placeholder for the actual service call
                const details = service.getEmergencyZoneDetailsMock(zoneId);
                setRestOfEmergencyZone(details);
                return details;
            } catch (error) {
                console.error('Error fetching emergency zone details:', error);
                throw error;
            }


        },

        setBasicEmergencyZone(emergencyZoneData) {
            this.zoneId = emergencyZoneData.zoneId;
            this.lat = emergencyZoneData.lat;
            this.lng = emergencyZoneData.lng;
            this.type = emergencyZoneData.type;
            this.level = emergencyZoneData.level;
            this.coordinates = emergencyZoneData.geojson.coordinates;
        },

        setRestOfEmergencyZone(emergencyZoneData) {
            this.name = emergencyZoneData.name;
            this.address = emergencyZoneData.address;
            this.description = emergencyZoneData.description;
        },

        setEmergencyZone(emergencyZoneData) {
            this.zoneId = emergencyZoneData.zoneId;
            this.name = emergencyZoneData.name;
            this.address = emergencyZoneData.address;
            this.lat = emergencyZoneData.lat;
            this.lng = emergencyZoneData.lng;
            this.type = emergencyZoneData.type;
            this.level = emergencyZoneData.level;
            this.description = emergencyZoneData.description;
            this.coordinates = emergencyZoneData.coordinates;

        },

        async saveEmergencyZone() {
            // Save the emergency zone data to the API
        },

        async deleteEmergencyZone() {
            // Delete the emergency zone from the API
        },

        clearEmergencyZoneState() {
            this.zoneId = null;
            this.name = '';
            this.address = '';
            this.lat = 0;
            this.lng = 0;
            this.type = '';
            this.level = 0;
            this.description = '';
            this.coordinates = [];
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