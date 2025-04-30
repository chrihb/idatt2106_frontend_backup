import L from 'leaflet';
import {useMapStore} from "@/stores/mapStore.js";
import {useEmergencyZonesStore} from "@/stores/emergencyZonesStore.js";

export const createMarkerPopup = (type, location,  address, description) =>
    `
                <div class="popup">
                    <h2>${type}</h2>
                    <h3>${location}</h3>
                    <p>${address}</p>
                    <p>${description}</p>
                </div>
    `;

export const createCustomMarkerIcon = (type) => {
    const iconUrl = `/icons/map/${type}.png`;
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40], // size of the icon
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

    mapStore.layerGroup[emergencyZone.type].addLayer(polygon);

    emergencyZonesStore.addEmergencyZone(emergencyZone);
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