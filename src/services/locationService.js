import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import {requestHouseholds} from "@/services/householdService.js";

let locationInterval = null;

export const updateUserLocation = async (latitude, longitude) => {
  const userStore = useUserStore();
  const token = userStore.token || sessionStorage.getItem("token");

  if (!token) return;

  await axios.put(`${window.backendURL}/api/users/update-location`, {
    latitude,
    longitude
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const startLocationTracking = () => {
  const userStore = useUserStore();
  const token = userStore.token || sessionStorage.getItem("token");

  if (!token) {
    return;
  }

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await updateUserLocation(latitude, longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          stopLocationTracking();
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 20000 }
    );
  };
  //setTimeout(updateLocation, 500);
  updateLocation();
    // Update location every 5 minutes
  locationInterval = setInterval(updateLocation, 5 * 60 * 1000);
};

export const stopLocationTracking = () => {
  if (locationInterval) clearInterval(locationInterval);
  locationInterval = null;
};

export const getUserPosition = async () => {
  const userStore = useUserStore();

  try {
    const response = await axios.get(`${window.backendURL}/api/users/location`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });

    if (response.status !== 200) return null;

    return response.data;
  } catch (error) {
    return { success: false };
  }
};

