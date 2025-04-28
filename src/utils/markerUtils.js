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
    const iconUrl = `/assets/icons/${type}.png`;
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [25, 41], // size of the icon
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    });
}