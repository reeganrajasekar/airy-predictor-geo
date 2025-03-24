
// Geolocation service

/**
 * Checks if geolocation is available in the browser
 */
export const isGeolocationAvailable = (): boolean => {
  return "geolocation" in navigator;
};

/**
 * Gets the current position of the user
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationAvailable()) {
      reject(new Error("Geolocation is not available in this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Gets location information from coordinates
 */
export const getLocationFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string }> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();
    
    return {
      city: data.city || data.locality || "Unknown",
      country: data.countryName || "Unknown"
    };
  } catch (error) {
    console.error("Error getting location from coordinates:", error);
    return { city: "Unknown", country: "Unknown" };
  }
};
