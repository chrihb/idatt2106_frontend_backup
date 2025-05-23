import L from 'leaflet';
import {useMapStore} from "@/stores/mapStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {useEmergencyZoneStore} from "@/stores/emergencyZoneStore.js";
import {useMarkersStore} from "@/stores/markersStore.js";
import {useMarkerStore} from "@/stores/markerStore.js";
import { usePositionTrackingStore } from "@/stores/positionTrackingStore.js";
import {nextTick} from "vue";
import {useUserStore} from "@/stores/userStore.js";

let routeLayerGroup = null;

export const createMarkerPopup = (type, address, markerId) =>
    `
        <div class="popup text-sm text-gray-800 space-y-1">
            <h2 class="font-semibold text-base">${type}</h2>
                <p class="font-medium"> ${address}</p>
                <p>
                    <a href="#" class="directions-link text-blue-600 hover:underline font-medium" data-marker-id="${markerId}">
                        Veibeskrivelse
                    </a>
                </p>
        </div>
    `;

export const createZonePopup = (name, type, level, address, description) =>
    `
                <div class="popup">
                    <h2>${name}</h2>
                    <p>${type}</p>
                    <p>Nivå: ${level}</p>
                    <p>${address}</p>
                    <p>${description}</p>
                </div>
    `;

const iconCache = {};

export const createCustomMarkerIcon = (type) => {
    if (iconCache[type]) {
        return iconCache[type];
    }

    const iconUrl = `/icons/map/${type}.png`;
    const icon = L.icon({
        iconUrl: iconUrl,
        iconSize: [25, 25],
    });

    iconCache[type] = icon;
    return icon;
}

// Add a marker to the map
export const addMarkerToMap = (marker) => {
    if (!marker || !marker.markerId || !marker.lat || !marker.lng || !marker.type) {
        return;
    }

    const markersStore = useMarkersStore();
    if (markersStore.getMarkerById(marker.markerId)) {
        return;
    }

    const mapStore = useMapStore();
    // Create a custom icon for the marker
    const mapIcon = createCustomMarkerIcon(marker.type)

    // Create a marker with the given data
    const mapMarker = L.marker([marker.lat, marker.lng],
        {
            id: marker.markerId,
            icon: mapIcon
        });

    // Bind a popup to the marker
    mapMarker.on('click', async () => {
        try {
            const markerStore = useMarkerStore();
            const markerDetails = await markerStore.fetchMarkerDetailsById(marker.markerId);

            if (markerDetails) {
                const popupContent = createMarkerPopup(marker.type, markerDetails.address, marker.markerId);
                if (!mapMarker.getPopup()) {
                    mapMarker.bindPopup(popupContent);
                } else {
                    mapMarker.setPopupContent(popupContent);
                }
                mapMarker.openPopup();
                await nextTick();

                // Hent popup-elementet direkte og bind handleren der
                const popupEl = mapMarker.getPopup()?.getElement();
                if (popupEl) {
                    const link = popupEl.querySelector('.directions-link');
                    if (link) {
                        const handler = createDirectionsHandler(marker.lat, marker.lng);
                        link._directionsHandler = handler;
                        L.DomEvent.on(link, 'click', handler);
                    }
                }
            } else {
            }
        } catch (error) {
        }
    });


    mapMarker.on('popupclose', (e) => {
        const popupEl = e.popup.getElement();
        if (!popupEl) return;

        const link = popupEl.querySelector('.directions-link');
        if (link && link._directionsHandler) {
            L.DomEvent.off(link, 'click', link._directionsHandler);
            delete link._directionsHandler;
        }

        clearRoute();
    });


    // Check if the layerGroup for the type exists, if not create it
    if (!mapStore.layerGroup[marker.type] || !(mapStore.layerGroup[marker.type] instanceof L.LayerGroup)) {
        mapStore.layerGroup[marker.type] = L.layerGroup().addTo(mapStore.map);
    }
    // Add the marker to the appropriate layerGroup
    mapStore.layerGroup[marker.type].addLayer(mapMarker);
    mapStore.addMapItemId(marker.markerId);
}

// Remove a marker from the map
export const removeMarkerFromMap = (markerId) => {
    const mapStore = useMapStore();

    for (const type in mapStore.layerGroup) {
        const layerGroup = mapStore.layerGroup[type];

        const layer = layerGroup.getLayers().find(layer => layer.options.id === markerId);
        if (layer) {
            layerGroup.removeLayer(layer);
            mapStore.removeMapItemId(markerId);
            return;
        }
    }
}

export const updateMarkerOnMap = (marker) => {
    removeMarkerFromMap(marker.markerId);
    addMarkerToMap(marker);
}

export const addEmergencyZoneToMap = (emergencyZone) => {

    if (!emergencyZone || !emergencyZone.zoneId || !emergencyZone.coordinates || emergencyZone.coordinates.length < 3) {
        return;
    }

    const emergencyZonesStore = useEmergencyZonesStore();
    if (emergencyZonesStore.getEmergencyZoneById(emergencyZone.zoneId)) {
        return;
    }

    const mapStore = useMapStore();

    if (mapStore.mapItemIds.includes(emergencyZone.zoneId)) {
        return;
    }

    const layerType = getLayerType(emergencyZone.level);

    if (!mapStore.layerGroup[layerType] || !(mapStore.layerGroup[layerType] instanceof L.LayerGroup)) {
        mapStore.layerGroup[layerType] = L.layerGroup().addTo(mapStore.map);
    }

    const polygon = L.polygon(emergencyZone.coordinates, {
        color: emergencyZoneStyle(emergencyZone.level).color,
        fillColor: emergencyZoneStyle(emergencyZone.level).fillColor,
        fillOpacity: 0.4,
        id: emergencyZone.zoneId,
        type: emergencyZone.type,
    });

    polygon.on('click', async () => {
        try {
            const emergencyZoneStore = useEmergencyZoneStore();
            const zoneDetails = await emergencyZoneStore.fetchEmergencyZoneDetailsById(emergencyZone.zoneId);

            if (zoneDetails) {
                const popupContent = createZonePopup(zoneDetails.name, emergencyZone.type, emergencyZone.level, zoneDetails.address, zoneDetails.description);
                polygon.bindPopup(popupContent).openPopup();
            }
        } catch (error) {
        }
    });

    mapStore.layerGroup[layerType].addLayer(polygon);

    mapStore.addMapItemId(emergencyZone.zoneId);
}

export const removeEmergencyZoneFromMap = (zoneId) => {
    const mapStore = useMapStore();

    for (const type in mapStore.layerGroup) {
        const layerGroup = mapStore.layerGroup[type];

        const layer = layerGroup.getLayers().find(layer => layer.options.id === zoneId);
        if (layer) {
            layerGroup.removeLayer(layer);
            mapStore.removeMapItemId(zoneId);
            return;
        }
    }
}

export const updateEmergencyZoneOnMap = (emergencyZone) => {
    removeEmergencyZoneFromMap(emergencyZone.zoneId);
    addEmergencyZoneToMap(emergencyZone);
}

export const getLayerType = (level) => {
    let layerType;
    switch (level) {
        case 1:
            layerType = "Fare nivå 1";
            break
        case 2:
            layerType = "Fare nivå 2";
            break
        case 3:
            layerType = "Fare nivå 3";
            break
        default:
            layerType = 'default';
    }
    return layerType;
}

export const emergencyZoneStyle = (level) => {
    let style;
    switch (level) {
        case 1:
            style = {
                color: 'yellow',
                fillColor: '#ff0',
            };
            break
        case 2:
            style = {
                color: 'orange',
                fillColor: '#FFA500',
            };
            break
        case 3:
            style = {
                color: 'red',
                fillColor: '#f03',
            };
            break
    }
    return style;
}

export const centerMapOnMarker = (id) => {
    const mapStore = useMapStore();
    const markersStore = useMarkersStore();
    const marker = markersStore.getMarkerById(id);

    if (marker) {
        mapStore.centerMapOnSpecificLocation(marker.lat, marker.lng);
    }
}

export const centerMapOnEmergencyZone = (zoneId) => {
    const mapStore = useMapStore();
    const emergencyZonesStore = useEmergencyZonesStore();
    const emergencyZone = emergencyZonesStore.getEmergencyZoneById(zoneId);

    if (emergencyZone) {
        const bounds = L.latLngBounds(emergencyZone.coordinates);
        mapStore.map.fitBounds(bounds);
    }
}

export const drawRoute = async (startLat, startLng, endLat, endLng) => {
    const mapStore = useMapStore();

    routeLayerGroup = L.layerGroup().addTo(mapStore.map);

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            const polyline = L.polyline(coords, { color: 'blue' });
            routeLayerGroup.addLayer(polyline);
            mapStore.map.fitBounds(polyline.getBounds());
        } else {
            console.error('No route found');
        }
    } catch (error) {
        console.error('Failed to fetch route:', error);
    }
};


export const clearRoute = () => {
    const mapStore = useMapStore();

    if (routeLayerGroup && mapStore.map.hasLayer(routeLayerGroup)) {
        mapStore.map.removeLayer(routeLayerGroup);
        routeLayerGroup = null;
    }
};

export const getUserPosition = async () => {
    const positionTrackingStore = usePositionTrackingStore();
    const userPos = positionTrackingStore.getPosition;

    if (!userPos) {
        throw new Error("Brukerens posisjon er ikke tilgjengelig");
    }

    return userPos;
}


export const requestRouteToMarker = async (targetLat, targetLng) => {
    try {
        const userPosition = await getUserPosition();
        clearRoute(); // fjerner forrige rute, hvis noen
        await drawRoute(userPosition.lat, userPosition.lng, targetLat, targetLng);
    } catch (error) {
        alert(error.message);
    }
};


const createDirectionsHandler = (lat, lng) => {
    return (e) => {
        e.preventDefault();
        requestRouteToMarker(lat, lng);
    };
};
export const initAccountMarkers = async () => {
    const userStore = useUserStore();
    const markersStore = useMarkersStore();
    if (await userStore.isAuthenticated()) {
        const userPosition = await getUserPosition();


        userStore.householdId.forEach((household) => {
            const householdMarkerId = `household-${household.id}`;
            if (
                household.latitude &&
                household.longitude &&
                !markersStore.getMarkerById(householdMarkerId)
            ) {
                addMarkerToMap({
                    markerId: householdMarkerId,
                    lat: household.latitude,
                    lng: household.longitude,
                    type: "home",
                });
            }

            household.members.forEach((member) => {
                const memberMarkerId = `member-${member.id}`;
                if (
                    member.latitude &&
                    member.longitude &&
                    !markersStore.getMarkerById(memberMarkerId) &&
                    userPosition.id !== member.id
                ) {
                    addMarkerToMap({
                        markerId: memberMarkerId,
                        lat: member.latitude,
                        lng: member.longitude,
                        type: "AndreMedlemmer",
                    });
                }
            });
        });
    }

};


export const removeAccountMarkers = () => {
    const mapStore = useMapStore();

    for (const type in mapStore.layerGroup) {
        const layerGroup = mapStore.layerGroup[type];

        const layersToRemove = layerGroup.getLayers().filter((layer) => {
            const id = layer.options.id;
            return typeof id === 'string' &&
                (id.startsWith("member-") || id.startsWith("household-"));
        });

        for (const layer of layersToRemove) {
            layerGroup.removeLayer(layer);
            mapStore.removeMapItemId(layer.options.id);
        }

        // Clean up empty layer group
        if (layerGroup.getLayers().length === 0) {
            layerGroup.remove();
            delete mapStore.layerGroup[type];
        }
    }
};


