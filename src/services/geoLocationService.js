export const watchUserPosition = (onSuccess, onError) => {
    if ("geolocation" in navigator) {
        return navigator.geolocation.watchPosition(onSuccess, onError);
    } else {
        console.error("Geolocation is not supported by your browser.");
        return null;
    }
}