import axios from 'axios';

export const emergencyZoneService = () => {
    const baseUrl = `${window.backendURL}/api/emergency/zones`;


    async function getEmergencyZonesMock(mapAreaData, zoneIds) {
        return {
            success: true,
            zones: [
                {
                    zoneId: 1,
                    lat: 63.424494,
                    lng: 10.439154,
                    type: 'Strømbrudd',
                    level: 1,
                    coordinates: [
                        [63.424494, 10.439154],
                        [63.424694, 10.448154],
                        [63.404494, 10.449154],
                        [63.394494, 10.439154],
                        [63.414494, 10.440154],
                        [63.413494, 10.442154],
                    ],
                },
                {
                    zoneId: 2,
                    lat: 63.424494,
                    lng: 10.439154,
                    type: 'Flom',
                    level: 2,
                    coordinates: [
                        [63.304494, 10.109154],
                        [63.324494, 10.149154],
                        [63.234494, 10.129154],
                        [63.204494, 10.109154],
                        [63.104494, 10.009154],
                        [63.204494, 10.169154],
                        [63.304494, 10.109154],
                        [63.354494, 10.129154],
                    ],
                },
                {
                    zoneId: 3,
                    lat: 63.424494,
                    lng: 10.439154,
                    type: 'Atombombe',
                    level: 3,
                    coordinates: [
                        [63.024494, 10.039154],
                        [63.024694, 10.048154],
                        [63.004494, 10.049154],
                        [63.004494, 10.039154],
                        [63.014494, 10.040154],
                        [63.013494, 10.042154],
                    ],
                },
            ],
        }
    }

    async function getEmergencyZoneDetailsMock(zoneId) {
        return {
            success: true,
            name: 'Test Zone',
            address: 'Test Address',
            description: 'Test Description',
        }
    }


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

    async functuion getEmergencyZoneDetailsById(zoneIds) {
        const response = await axios.post(`${baseUrl}/details`, {
            zoneIds,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch emergency zone details by ID');
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
        getEmergencyZonesMock,
        getAllEmergencyZones,
        getEmergencyZonesByArea,
        getEmergencyZoneDetailsById,
        getEmergencyZoneById,
        createEmergencyZone,
        updateEmergencyZone,
        deleteEmergencyZone,
    };
};