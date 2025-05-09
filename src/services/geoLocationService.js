export const watchUserPosition = (onSuccess, onError) => {
    if ("geolocation" in navigator) {
        return navigator.geolocation.watchPosition(onSuccess, onError);
    } else {
        return null;
    }
}