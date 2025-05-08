import axios from 'axios';

export const emergencyZoneService = () => {
    const baseURL = `${window.backendURL}/api/map/zones`;

    async function getAllEmergencyZonesMock() {
        const zones = [
            {
                zoneId: 10,
                name: 'Test Zone 1',
                address: 'Test Address 1',
                description: 'Test Description 1',
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
                zoneId: 11,
                name: 'Test Zone 2',
                address: 'Test Address 2',
                description: 'Test Description 2',
                lat: 63.424494,
                lng: 10.439154,
                type: 'Flom',
                level: 2,
                coordinates: [
                    [63.4155074, 10.3640704],
                    [63.4124260, 10.3839112],
                    [63.4051920, 10.3835860],
                    [63.4097109, 10.3724194],
                    [63.4090753, 10.3604442],
                    [63.4148949, 10.3665222],
                    [63.4187146, 10.3741559],
                    [63.4132288, 10.3935730],
                ],
            },
            {
                zoneId: 12,
                name: 'Test Zone 3',
                address: 'Test Address 3',
                description: 'Test Description 3',
                lat: 63.424494,
                lng: 10.439154,
                type: 'Atombombe',
                level: 3,
                coordinates: [
                    [63.4015350, 10.4018511],
                    [63.4015715, 10.4230928],
                    [63.3950817, 10.4232474],
                    [63.3887169, 10.4209742],
                    [63.3959192, 10.4064291],
                    [63.4055464, 10.4177843],
                ],
            },
        ];

        return {
            success: true,
            zones
        }
    }

    async function getEmergencyZonesMock(mapAreaData, zoneIds) {
        let zones;
        const zonesInDatabase = [
            {
                zoneId: 10,
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
                zoneId: 11,
                lat: 63.424494,
                lng: 10.439154,
                type: 'Flom',
                level: 2,
                coordinates: [
                    [63.4155074, 10.3640704],
                    [63.4124260, 10.3839112],
                    [63.4051920, 10.3835860],
                    [63.4097109, 10.3724194],
                    [63.4090753, 10.3604442],
                    [63.4148949, 10.3665222],
                    [63.4187146, 10.3741559],
                    [63.4132288, 10.3935730],
                ],
            },
            {
                zoneId: 12,
                lat: 63.424494,
                lng: 10.439154,
                type: 'Atombombe',
                level: 3,
                coordinates: [
                    [63.4015350, 10.4018511],
                    [63.4015715, 10.4230928],
                    [63.3950817, 10.4232474],
                    [63.3887169, 10.4209742],
                    [63.3959192, 10.4064291],
                    [63.4055464, 10.4177843],
                ],
            },
        ];

        // Mocking the response for the emergency zones
        if (zoneIds && zoneIds.length > 0) {
            zones = zonesInDatabase.filter(zone => !zoneIds.includes(zone.zoneId));
        } else {
            zones = zonesInDatabase;
        }

        return {
            success: true,
            zones,
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
        const response = await axios.get(`${baseURL}/all-zones`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getEmergencyZonesByArea(mapAreaData, zoneIds) {
        const response = await axios.post(`${baseURL}/all-zones/`, {
            mapAreaData,
            zoneIds,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getEmergencyZoneDetailsById(zoneId) {
        const response = await axios.post(`${baseURL}/${zoneId}/description`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getEmergencyZoneById(zoneId) {
        const response = await axios.get(`${baseURL}/zone/${zoneId}/point`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function createEmergencyZone(zone) {
        const response = await axios.post(`${baseURL}/zone/create`, {
            zone,
        }, {
                headers: {
                    'Content-Type': 'application/json',
                },
        });
        return response.data;
    }

    async function updateEmergencyZone(zoneData, zoneId) {
        const response = await axios.put(`${baseURL}/zone/update${zoneId}`, {
            zoneData,
        },  {
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

    return {
        getAllEmergencyZonesMock,
        getEmergencyZonesMock,
        getEmergencyZoneDetailsMock,
        getAllEmergencyZones,
        getEmergencyZonesByArea,
        getEmergencyZoneDetailsById,
        getEmergencyZoneById,
        createEmergencyZone,
        updateEmergencyZone,
        deleteEmergencyZone,
    };
};