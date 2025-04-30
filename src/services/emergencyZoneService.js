import axios from 'axios';

export const emergencyZoneService = () => {
    const baseUrl = `${window.backendURL}/api/emergency/zones`;

    async function getAllEmergencyZones() {
        const response = await axios.get(baseUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch emergency zones');
        }
        return response.json;
    }

    async function getEmergencyZonesByArea(mapAreaData, zoneIds) {
        const response = await axios.post(`${baseUrl}/area`, {
            mapAreaData,
            zoneIds,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch emergency zones by area');
        }
        return response.json;
    }

    async function getEmergencyZoneById(id) {
        const response = await axios.get(`${baseUrl}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch emergency zone by ID');
        }
        return response.json;
    }

    async function createEmergencyZone(zone) {
        const response = await axios.post(baseUrl, zone, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to create emergency zone');
        }
        return response.json;
    }

    async function updateEmergencyZone(zone) {
        const response = await axios.put(`${baseUrl}/${zone.zoneId}`, zone, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to update emergency zone');
        }
        return response.body;
    }

    async function deleteEmergencyZone(id) {
        const response = await axios.delete(`${baseUrl}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete emergency zone');
        }
        return response.body;
    }

    return {
        getEmergencyZones,
        getEmergencyZoneById,
        getAllEmergencyZones,
        getEmergencyZonesByArea,
        createEmergencyZone,
        updateEmergencyZone,
        deleteEmergencyZone,
    };
};