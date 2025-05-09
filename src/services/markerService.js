import axios from 'axios';

export const markerService = () => {
    const baseURL = `${window.backendURL}/api/map`;

    async function getAllMarkers() {
        const response = await axios.get(`${baseURL}/markers`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getMarkersByArea(mapAreaData, mapItemIds) {
        const response = await axios.post(`${baseURL}/markers/in-area`, mapAreaData, mapItemIds, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getMarkerDetailsById(markerId) {
        const response = await axios.get(`${baseURL}/description/${markerId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function getMarkerById(markerId) {
        const response = await axios.get(`${baseURL}/marker/${markerId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function createMarker(markerData) {
        const response = await axios.post(`${baseURL}/marker/create`, markerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    async function updateMarker(markerData, markerId) {
        const response = await axios.put(`${baseURL}/marker/update/${markerId}`, markerData,{
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

    async function getMarkerTypes() {
        try {
            const response = await axios.get(`${baseURL}/marker-types`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching marker types:", error);
        }

    }

    return {
        getAllMarkers,
        getMarkersByArea,
        getMarkerDetailsById,
        getMarkerById,
        createMarker,
        updateMarker,
        deleteMarker,
        getMarkerTypes,
    };
};