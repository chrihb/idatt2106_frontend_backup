import L from "leaflet";

export function initMap(map, startTracking) {
    map.value = L.map('map').setView([63.446827, 10.421906], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value);

    startTracking();
}

export function startTracking(map, mapStore) {
    let marker = null;

    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            (position) => {
                mapStore.setCoordinates(position.coords.latitude, position.coords.longitude)
                if (marker === null) {
                    // Create a new marker at the user's location
                    marker = L.marker([mapStore.latitude, mapStore.longitude]).addTo(map.value);
                    // Center the map on the user's location
                    map.value.setView([mapStore.latitude, mapStore.longitude], 15);
                } else {
                    // Update the marker's position
                    marker.setLatLng([mapStore.latitude, mapStore.longitude]);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
            }
        );
    } else {
        console.error("Geolocation is not supported by your browser.");
    }
}

export function centerMapOnPersonalPosition(map, mapStore) {
    map.value.setView([mapStore.latitude, mapStore.longitude], 15);
}