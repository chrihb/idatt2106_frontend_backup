import L from 'leaflet';
import {useMapStore} from "@/stores/mapStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";
import {useEmergencyZoneStore} from "@/stores/emergencyZoneStore.js";
import {emergencyZoneService} from "@/services/emergencyZoneService.js";

export const createMarkerPopup = (type, location,  address, description) =>
    `
                <div class="popup">
                    <h2>${type}</h2>
                    <h3>${location}</h3>
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
        iconSize: [40, 40],
    });
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
            return;
        }
    }
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