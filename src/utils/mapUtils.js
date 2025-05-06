import L from 'leaflet';
import {useMapStore} from "@/stores/mapStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {useEmergencyZoneStore} from "@/stores/emergencyZoneStore.js";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";
import {useMarkersStore} from "@/stores/markersStore.js";
import {markerService} from "@/services/markerService.js";
import {useMarkerStore} from "@/stores/markerStore.js";

export const createMarkerPopup = (type, address, description) =>
    `
                <div class="popup">
                    <h2>${type}</h2>
                    <p>${address}</p>
                    <p>${description}</p>
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

export const createCustomMarkerIcon = (type) => {
    const iconUrl = `/icons/map/${type}.png`;
    return L.icon({
        iconUrl: iconUrl,
        //shadowUrl: '/icons/map/marker-shadow.png',

        iconSize: [24, 24],
        //shadowSize: [30, 30],

    });
}

// Add a marker to the map
export const addMarkerToMap = (marker) => {

    if (!marker || !marker.markerId || !marker.lat || !marker.lng || !marker.type) {
        console.error('Invalid marker data');
        return;
    }

    const markersStore = useMarkersStore();
    if (markersStore.getMarkerById(marker.markerId)) {
        console.error('Marker already exists on the map');
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
            const service = markerService();
            const markerStore = useMarkerStore();
            //TODO: This is a placeholder for the actual service call
            const markerDetails = await service.getMarkerDetailsMock(marker.markerId)
            //const markerDetails = await markerStore.fetchMarkerDetailsById(marker.markerId);

            if (markerDetails.success) {
                const popupContent = createMarkerPopup(marker.type, markerDetails.address, markerDetails.description);
                mapMarker.bindPopup(popupContent).openPopup();
            } else {
                console.error('Failed to fetch marker details');
            }
        } catch (error) {
            console.error('Error fetching marker details:', error);
        }
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
        console.error('Invalid emergency zone data');
        return;
    }

    const emergencyZonesStore = useEmergencyZonesStore();
    if (emergencyZonesStore.getEmergencyZoneById(emergencyZone.zoneId)) {
        console.error('Emergency zone already exists on the map');
        return;
    }

    const mapStore = useMapStore();

    if (!mapStore.layerGroup[emergencyZone.type] || !(mapStore.layerGroup[emergencyZone.type] instanceof L.LayerGroup)) {
        mapStore.layerGroup[emergencyZone.type] = L.layerGroup().addTo(mapStore.map);
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
            const service = emergencyZoneService();
            const emergencyZoneStore = useEmergencyZoneStore();
            //TODO: This is a placeholder for the actual service call
            const zoneDetails = await service.getEmergencyZoneDetailsMock(emergencyZone.zoneId)
            //const zoneDetails = await emergencyZoneStore.fetchEmergencyZoneDetailsById(emergencyZone.zoneId);

            if (zoneDetails.success) {
                const popupContent = createZonePopup(zoneDetails.name, emergencyZone.type, emergencyZone.level, zoneDetails.address, zoneDetails.description);
                polygon.bindPopup(popupContent).openPopup();
            } else {
                console.error('Failed to fetch zone details');
            }
        } catch (error) {
            console.error('Error fetching zone details:', error);
        }
    });

    mapStore.layerGroup[emergencyZone.type].addLayer(polygon);

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

export const emergencyZoneStyle = (level) => {
    let style;
    switch (level) {
        case 1:
            style = {
                color: 'green',
                fillColor: '#3f0',
            };
            break
        case 2:
            style = {

                color: 'yellow',
                fillColor: '#ff0',
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
    } else {
        console.error(`Marker with ${id} not found.`);
    }
}

export const centerMapOnEmergencyZone = (zoneId) => {
    const mapStore = useMapStore();
    const emergencyZonesStore = useEmergencyZonesStore();
    const emergencyZone = emergencyZonesStore.getEmergencyZoneById(zoneId);

    if (emergencyZone) {
        const bounds = L.latLngBounds(emergencyZone.coordinates);
        mapStore.map.fitBounds(bounds);
    } else {
        console.error(`Emergency zone with ID ${zoneId} not found.`);
    }
}