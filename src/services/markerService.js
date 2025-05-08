import axios from 'axios';

export const markerService = () => {
    const baseURL = `${window.backendURL}/api/map/markers`;

    async function getMarkersMock(mapAreaData, mapItemIds) {
        let markers;
        const markersInDatabase = [
            {
                markerId: 1,
                lat: 63.423494,
                lng: 10.424354,
                type: 'Hjertestarter',
            },
            {
                markerId: 2,
                lat: 63.421424,
                lng: 10.400834,
                type: 'Bunker',
            },
            {
                markerId: 3,
                lat: 63.421434,
                lng: 10.440124,
                type: 'Hjertestarter',
            },
            {
                markerId: 4,
                lat: 63.425434,
                lng: 10.442124,
                type: 'Møteplass',
            },
            {
                markerId: 5,
                lat: 63.424434,
                lng: 10.439124,
                type: 'Matstasjon',
            }

        ];

       if (mapItemIds && mapItemIds.length > 0) {
            markers = markersInDatabase.filter(marker => !mapItemIds.includes(marker.markerId));
       } else {
            markers = markersInDatabase;
       }

       return {
            success: true,
            markers,
        }
    }

    async function getMarkerDetailsMock(markerId) {
        switch (markerId) {
            case 1:
                return {
                    success: true,
                    name: 'Test Marker 1',
                    address: 'Test Address 1',
                    description: 'Test Description 1',
                };
            case 2:
                return {
                    success: true,
                    name: 'Test Marker 2',
                    address: 'Test Address 2',
                    description: 'Test Description 2',
                };
            case 3:
                return {
                    success: true,
                    name: 'Test Marker 3',
                    address: 'Test Address 3',
                    description: 'Test Description 3',
                };
            default:
                return {
                    success: true,
                    name: 'Test Marker',
                    address: 'Test Address',
                    description: 'Test Description',
                };

        }
    }

    async function getAllMarkersMock() {
        const markers = [
            {
                markerId: 1,
                lat: 63.423494,
                lng: 10.424354,
                type: 'Hjertestarter',
                name: 'Test Marker 1',
                address: 'Test Address 1',
                description: 'Test Description 1',
            },
            {
                markerId: 2,
                lat: 63.421424,
                lng: 10.400834,
                type: 'Bunker',
                name: 'Test Marker 2',
                address: 'Test Address 2',
                description: 'Test Description 2',
            },
            {
                markerId: 3,
                lat: 63.421434,
                lng: 10.440124,
                type: 'Hjertestarter',
                name: 'Test Marker 3',
                address: 'Test Address 3',
                description: 'Test Description 3',
            },
            {
                markerId: 4,
                lat: 63.425434,
                lng: 10.442124,
                type: 'Møteplass',
                name: 'Test Marker 4',
                address: 'Test Address 4',
                description: 'Test Description 4',
            },
            {
                markerId: 5,
                lat: 63.424434,
                lng: 10.439124,
                type: 'Matstasjon',
                name: 'Test Marker 5',
                address: 'Test Address 5',
                description: 'Test Description 5',
            }
        ]
        return {
            succsess: true,
            markers,
        }
    }

    async function getAllMarkers() {
        const response = await axios.get(baseURL, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getMarkersByArea(mapAreaData, mapItemIds) {
        const response = await axios.post(`${baseURL}/area`, {
            mapAreaData,
            mapItemIds,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getMarkerDetailsById(markerId) {
        const response = await axios.post(`${baseURL}/details`, {
            markerId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getMarkerById(markerId) {
        const response = await axios.get(`${baseURL}/${markerId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function createMarker(markerData) {
        const response = await axios.post(`${baseURL}/create`, {
            markerData,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function updateMarker(markerData) {
        const response = await axios.put(`${baseURL}/update`, {
            markerData,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function deleteMarker(markerId) {
        const response = await axios.delete(`${baseURL}/delete/${markerId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    return {
        getMarkersMock,
        getMarkerDetailsMock,
        getAllMarkersMock,
        getAllMarkers,
        getMarkersByArea,
        getMarkerDetailsById,
        getMarkerById,
        createMarker,
        updateMarker,
        deleteMarker,
    };
};