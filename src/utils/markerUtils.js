import L from 'leaflet';

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
    const iconUrl = `/mapIcons/${type}.png`;
    console.log(iconUrl);
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40], // size of the icon
    });
}