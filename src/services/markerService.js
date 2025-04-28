import axios from 'axios';
import {useMarkerStore} from "@/stores/markerStore.js";

const baseURL = 'backendURL'; // Replace with actual API URL

export const mockMarkersData = async () => {
    const markerStore = useMarkerStore();
    const markersMock = [
        {
            id: 1,
            lat: 63.423494,
            lng: 10.424354,
            type: 'Hjertestarter',
            location: 'Location 1',
            address: 'Address 1',
            description: 'Description 1'
        },
        {
            id: 2,
            lat: 63.421424,
            lng: 10.400834,
            type: 'Bunker',
            location: 'Location 2',
            address: 'Address 2',
            description: 'Description 2'
        },
        {
            id: 3,
            lat: 63.421434,
            lng: 10.440124,
            type: 'Hjertestarter',
            location: 'Location 3',
            address: 'Address 3',
            description: 'Description 3'
        },
        {
            id: 4,
            lat: 63.425434,
            lng: 10.442124,
            type: 'Bunker',
            location: 'Location 4',
            address: 'Address 4',
            description: 'Description 4'
        },
        {
            id: 5,
            lat: 63.424434,
            lng: 10.439124,
            type: 'Hjertestarter',
            location: 'Location 5',
            address: 'Address 5',
            description: 'Description 5'
        }

    ];

    for (const markerItem of markersMock) {
        markerStore.addMarker(markerItem);
    }
    return {success: true};
}


export const requestMarkers = async (markersData) => {
    const markerStore = useMarkerStore();

    try {
        const respnse = await axios.get(`${baseURL}/markers`, markerData, {
            headers: { 'Content-Type': 'application/json' },
        });

        const markers = response.data.markers;
        if (markers && Array.isArray(markers)) {
            for (const markerItem of markers) {
                markerStore.addMarker(markerItem);
            }
            return {success: true};
        }

        return {error: 'Unexpected response format'}
    } catch (error) {
        
    }

}

export const saveMarker = async (markerData) => {
    try {
        const respnse = await axios.post(`${baseURL}/markers`, markerData, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 201) {
            return {success: true, marker: respnse.data.marker};
        } else {
            return {error: 'Failed to save marker'};
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                return {error: 'Invalid marker data'};
            }
            if (error.response.status === 403) {
                return {error: 'Permission denied'};
            }
            if (error.response.status === 409) {
                return {error: 'Marker already exists'};
            }
            return {error: 'An unexpected error occurred. Please try again.'};
        } else {
            console.error('Error sumbitting marker data', error);
            return {error: 'Network error. Please check your connection.'};
        }

    }
}

export const deleteMarker = async (markerId) => {
    try {
        const response = await axios.delete(`${baseURL}/markers/${markerId}`, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            return {success: true};
        } else {
            return {error: 'Failed to delete marker'};
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                return {error: 'Marker not found'};
            }
            if (error.response.status === 403) {
                return {error: 'Permission denied'};
            }
            return {error: 'An unexpected error occurred. Please try again.'};
        } else {
            console.error('Error deleting marker', error);
            return {error: 'Network error. Please check your connection.'};
        }
    }
}