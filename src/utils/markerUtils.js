export const createMarkerPopup = (type, location,  address, description) =>
    `
                <div class="popup">
                    <h2>${type}</h2>
                    <h3>${location}</h3>
                    <p>${address}</p>
                    <p>${description}</p>
                </div>
    `;
