import axios from 'axios';

export const emergencyZoneService = () => {
    const baseURL = `${window.backendURL}/api/map`;

    async function getAllEmergencyZones() {
        const response = await axios.get(`${baseURL}/zones`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getEmergencyZonesByArea(mapAreaData, zoneIds) {
        const response = await axios.post(`${baseURL}/zones/in-area`, mapAreaData, zoneIds, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getEmergencyZoneDetailsById(zoneId) {
        const response = await axios.get(`${baseURL}/description/${zoneId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getEmergencyZoneById(zoneId) {
        const response = await axios.get(`${baseURL}/zone/${zoneId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function createEmergencyZone(zone) {
        try {
            console.log("Payload: ", zone);
            const response = await axios.post(`${baseURL}/zone/create`, zone, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async function updateEmergencyZone(zoneData, zoneId) {
        const response = await axios.put(`${baseURL}/zone/update${zoneId}`, zoneData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function deleteEmergencyZone(zoneId) {
        const response = await axios.delete(`${baseURL}/delete/${zoneId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getZoneTypes() {
        try {
            const response = await axios.get(`${baseURL}/zone-types`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching zone types:", error);
        }

    }

    return {
        getAllEmergencyZones,
        getEmergencyZonesByArea,
        getEmergencyZoneDetailsById,
        getEmergencyZoneById,
        createEmergencyZone,
        updateEmergencyZone,
        deleteEmergencyZone,
        getZoneTypes,
    };
};